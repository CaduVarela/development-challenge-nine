import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { Button } from '@mui/material';

import Icon from '@mui/material/Icon'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import palette from './../../styles/utils.module.scss'

import { PatientType } from '@/shared/PatientType';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CustomError from '@/shared/CustomError';
import { useCallback, useEffect, useRef, useState } from 'react';

import ConfirmDelete from '../ConfirmDelete/ConfirmDelete';

// Types
interface Data extends PatientType {
  birthdateString: string,
  optionsColumn: React.ReactElement
}

interface ColumnData {
  dataKey: keyof Data | null;
  label: string;
  numeric?: boolean;
  wordBreak?: boolean;
  width: number;
}

// Generate sample table for testing purposes
/*
type Sample = [string, Date, string, string, string, string, string, string, string, number, React.ReactElement];

const optionsColumn : React.ReactElement = 
  <div>
    <Button sx={{ width: '10px', maxWidth: '10px', minWidth: '10px', margin: '8px 0 0 0' }} variant='contained' color='secondary' title='edit'>
      <Icon component={EditIcon} fontSize='small'></Icon>
    </Button>
    <Button sx={{ width: '10px', maxWidth: '10px', minWidth: '10px', margin: '8px 0 0 16px' }} variant='contained' color='warning' title='delete'>
      <Icon component={DeleteIcon} fontSize='small'></Icon>
    </Button>
  </div>

const sample: readonly Sample[] = [
  ['Carlos Eduardo Varela de Almeida', new Date('2004-09-02'), new Date('2004-09-02').toLocaleString().slice(0, 10), 'caduvarela@gmail.com', '84530-000', 'Brazil', 'PR', 'Ponta Grossa', 'bruh', 160, 
  optionsColumn],
];

const rows: Data[] = Array.from({ length: 200 }, (_, index) => {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  return createPatientData(index, ...randomSelection);
});
*/

function createPatientData(
  id: number | undefined,
  name: string,
  birthdate: Date,
  birthdateString: string,
  email: string,
  postalCode: string | undefined,
  country: string,
  state: string,
  city: string,
  street: string,
  addressNumber: number | undefined,
  optionsColumn: React.ReactElement
): Data {
  return { id, name, birthdate, birthdateString, email, postalCode, country, state, city, street, addressNumber, optionsColumn };
}

// Table config
const columns: ColumnData[] = [
  {
    width: 50,
    label: '#',
    dataKey: 'id',
    wordBreak: true,
    numeric: true
  },
  {
    width: 140,
    label: 'Name',
    dataKey: 'name',
    wordBreak: true
  },
  {
    width: 100,
    label: 'Birthdate',
    dataKey: 'birthdateString',
  },
  {
    width: 120,
    label: 'Email',
    dataKey: 'email',
    wordBreak: true,
  },
  {
    width: 80,
    label: 'Postal Code',
    dataKey: 'postalCode',
  },
  /*
  {
    width: 80,
    label: 'Country',
    dataKey: 'country',
  },
  */
  {
    width: 80,
    label: 'State',
    dataKey: 'state',
    wordBreak: true,
  },
  {
    width: 80,
    label: 'City',
    dataKey: 'city',
  },
  {
    width: 80,
    label: 'Street',
    dataKey: 'street',
    wordBreak: true,
  },
  /*
  {
    width: 100,
    label: 'Addr. Number',
    dataKey: 'addressNumber'
    numeric: true
  },
  */
  {
    width: 140,
    label: 'Options',
    dataKey: 'optionsColumn',
    wordBreak: true,
  },
];

const VirtuosoTableComponents: TableComponents<Data> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
            color: palette.themeColor,
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: Data) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
          sx={{ wordWrap: column.wordBreak || false ? 'break-word' : 'normal' }}
        >
          <>{typeof column.dataKey === typeof Date ? row[column.dataKey as keyof Data]?.toString : row[column.dataKey as keyof Data]}</>
        </TableCell>
      ))}
    </React.Fragment>
  );
}

// Component
export default function PatientTable({
  filterByNameLike='',
  targetIdRef,
  setDataManagerState,
} : {
  filterByNameLike?:string
  targetIdRef:React.MutableRefObject<number>,
  setDataManagerState: (val: 'new' | 'manager'| '' | null) => void,
}) {

  const [deleteTargetId, setDeleteTargetId] = useState(-1)
  const [deleteDesc, setDeleteDesc] = useState('')
  const [deleteAnswer, setDeleteAnswer] = useState<boolean | null>(null)
  const wrapperSetDeleteAnswer = useCallback ((val : typeof deleteAnswer) => {
    setDeleteAnswer(val)
  }, [setDeleteAnswer])

  // construct query params
  let params : string = '';
  if (filterByNameLike !== '') {
    params += `name=${filterByNameLike}`
  }

  // Fetch
  const patientQuery = useQuery({
    queryKey: ['patients'],
    queryFn: () => {
      //return fetch(`http://localhost:22194/patients?name=${filterByNameLike}`)
      return fetch(`http://localhost:22194/patients?`+params)
        .then((res) => res.json())
        .then((resJson : PatientType[] | CustomError) => {
          if ('rawError' in resJson)
            throw resJson
          return resJson
        })
    },
  })

  const queryClient = useQueryClient()

  const patientMutation = useMutation({
    mutationFn: () => {
      return fetch('http://localhost:22194/patients/'+deleteTargetId, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      setDeleteAnswer(null)
      setDeleteDesc('')
      setDeleteTargetId(-1)
      queryClient.invalidateQueries()
    }
  })

  function handleDelete(id: number, name: string) {
    setDeleteAnswer(false)
    setDeleteDesc('Do you really want to delete '+name+'?')
    setDeleteTargetId(id)
  }
  useEffect(() => {
    if (deleteAnswer === true) {
      console.log(deleteAnswer)
      patientMutation.mutate()
    }
  }, [deleteAnswer])

  let rows : Data[] = [];
  if (patientQuery.data) {
    patientQuery.data.map((patient) => {
      rows.push(
        createPatientData(
          patient.id, 
          patient.name, 
          patient.birthdate, 
          patient.birthdate.toLocaleString('en-GB').slice(0, 10), 
          patient.email, 
          patient.postalCode, 
          patient.country, 
          patient.state, 
          patient.city, 
          patient.street,
          patient.addressNumber,
          <div>
            <Button 
              sx={{ width: '10px', maxWidth: '10px', minWidth: '10px', margin: '8px 0 0 0' }} 
              variant='contained' 
              color='secondary' 
              title='edit' 
              onClick={() => {setDataManagerState('manager'); targetIdRef.current = patient.id as number}}
            >
              <Icon component={EditIcon} fontSize='small'  ></Icon>
            </Button>
            <Button 
              sx={{ width: '10px', maxWidth: '10px', minWidth: '10px', margin: '8px 0 0 16px' }} 
              variant='contained' 
              color='warning' 
              title='delete' 
              onClick={() => handleDelete(patient.id as number, patient.name as string)}
            >
              <Icon component={DeleteIcon} fontSize='small' ></Icon>
            </Button>
          </div>
        )
      )
    })
  }

  return (
    <Paper style={{ height: '100%', width: '100%', boxShadow: 'none', border: `1px solid ${palette.lightGray}` }}>
      {deleteAnswer !== null &&
        <ConfirmDelete setDeleteAnswer={wrapperSetDeleteAnswer} desc={deleteDesc}/>
      }
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
        style={{ boxShadow: 'none' }}
      />
    </Paper>
  );
}
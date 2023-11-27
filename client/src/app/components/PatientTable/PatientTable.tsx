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

interface Data {
  id: number,
  name: string,
  birthdate: string,
  email: string,
  postalCode: string,
  country: string,
  state: string,
  city: string,
  street: string,
  options: React.ReactElement
}

interface ColumnData {
  dataKey: keyof Data | null;
  label: string;
  numeric?: boolean;
  wordBreak?: boolean;
  width: number;
}

type Sample = [string, string, string, string, string, string, string, string, React.ReactElement];

const dataOptions : React.ReactElement = 
  <div>
    <Button sx={{ width: '10px', maxWidth: '10px', minWidth: '10px', margin: '8px 0 0 0' }} variant='contained' color='secondary' title='edit'>
      <Icon component={EditIcon} fontSize='small'></Icon>
    </Button>
    <Button sx={{ width: '10px', maxWidth: '10px', minWidth: '10px', margin: '8px 0 0 16px' }} variant='contained' color='warning' title='delete'>
      <Icon component={DeleteIcon} fontSize='small'></Icon>
    </Button>
  </div>

const sample: readonly Sample[] = [
  ['Carlos Eduardo Varela de Almeida', '02/09/2004', 'caduvarela@gmail.com', '84530-000', 'Brazil', 'PR', 'Ponta Grossa', 'bruh', 
  dataOptions],
];

function createData(
  id: number,
  name: string,
  birthdate: string,
  email: string,
  postalCode: string,
  country: string,
  state: string,
  city: string,
  street: string,
  options: React.ReactElement
): Data {
  return { id, name, birthdate, email, postalCode, country, state, city, street, options };
}

const columns: ColumnData[] = [
  {
    width: 30,
    label: '#',
    dataKey: 'id'
  },
  {
    width: 180,
    label: 'Name',
    dataKey: 'name',
  },
  {
    width: 100,
    label: 'Birthdate',
    dataKey: 'birthdate',
  },
  {
    width: 150,
    label: 'Email',
    dataKey: 'email',
    wordBreak: true,
  },
  {
    width: 80,
    label: 'Postal Code',
    dataKey: 'postalCode',
  },
  {
    width: 60,
    label: 'Country',
    dataKey: 'country',
  },
  {
    width: 60,
    label: 'State',
    dataKey: 'state',
    wordBreak: true,
  },
  {
    width: 100,
    label: 'City',
    dataKey: 'city',
  },
  {
    width: 100,
    label: 'Street',
    dataKey: 'street',
    wordBreak: true,
  },
  {
    width: 140,
    label: 'Options',
    dataKey: 'options',
    wordBreak: true,
  },
];

/* REMAKE ROWS DEFINITION





*/

const rows: Data[] = Array.from({ length: 200 }, (_, index) => {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  return createData(index, ...randomSelection);
});

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
          {row[column.dataKey as keyof Data]}
        </TableCell>
      ))}
      {

      }
    </React.Fragment>
  );
}

export default function ReactVirtualizedTable() {
  return (
    <Paper style={{ height: '100%', width: '100%' }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
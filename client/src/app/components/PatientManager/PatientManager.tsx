'use client'
import styles from './PatientManager.module.scss'
import { Button, TextField } from '@mui/material'

import { useCallback, useRef, useState, useEffect } from 'react'

import PatientTable from './../PatientTable/PatientTable'

import PatientDataManager from '../PatientDataManager/PatientDataManager'

const PatientManager = () => {

    const [nameFilterInputValue, setNameFilterInputValue] = useState('')
    const [nameFilter, setNameFilter] = useState('')

    const [refreshTableController, setUpdateTableController] = useState(false)

    const [dataManagerState, setDataManagerState] = useState<'new' | 'manager' | '' | null>('')

    const targetId = useRef(-1) // targetId is the current id to be edited or deleted

    const wrapperSetDataManagerState = useCallback ((val : typeof dataManagerState) => {
        setDataManagerState(val)
    }, [setDataManagerState])
    
    function refreshTable() {
        setUpdateTableController((prevState : boolean) => !prevState);
    }
    
    return(
        <div className={styles['panel-wrapper']}>

            {dataManagerState === 'new' &&
                <PatientDataManager variant='new' setDataManagerState={wrapperSetDataManagerState}/>
            }

            {dataManagerState === 'manager' &&
                <PatientDataManager setDataManagerState={wrapperSetDataManagerState} targetId={targetId.current}/>
            }

            <header>
                <h1>Patient Manager</h1>
            </header>

            <div className={styles['control-panel']}>
                <div className={styles['title']}>
                    <h3>Control Panel</h3>
                </div>
                <div className={styles['features-row']}>

                    <div className={styles['filter-by-name']}>
                        <TextField 
                            label='Filter by patient name' 
                            placeholder='Enter patient name here'
                            InputProps={{ style: { height: '42.5px', marginBottom: '16px', marginLeft: '0', minWidth: '240px'}, disableUnderline: true, }}
                            onChange={
                                (e) => setNameFilterInputValue(e.target.value)
                            }
                            value={nameFilterInputValue}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && nameFilter !== nameFilterInputValue) {
                                    setNameFilter(nameFilterInputValue); 
                                    refreshTable();
                                }
                            }}
                        >
                        </TextField>
                    </div>

                    <div className={styles['apply-filter']}>
                        <Button 
                            variant='contained' 
                            sx={{margin: 0}} 
                            onClick={() => {
                                if (nameFilter !== nameFilterInputValue) {
                                    setNameFilter(nameFilterInputValue);
                                    refreshTable();
                                }
                            }} 
                        >
                            Search
                        </Button>
                    </div>

                    <div className={styles['clear-filter']}>
                        <Button 
                            variant='outlined' 
                            sx={{margin: 0}}
                            onClick={() => {
                                if (nameFilterInputValue !== '') {
                                    setNameFilterInputValue('');
                                    setNameFilter('');
                                    refreshTable();
                                }
                            }}
                        >
                            Clear Filter
                        </Button>
                    </div>
                    
                    <div className={styles['add-new']}>
                        <Button variant='contained'
                            sx={{margin: 0}} 
                            onClick={() => setDataManagerState('new')}
                        >
                            Add New Patient
                        </Button>
                    </div>

                </div>
            </div>

            <div className={styles['data-table']}>
                <PatientTable key={refreshTableController ? '0' : '1'} filterByNameLike={nameFilter} targetIdRef={targetId} setDataManagerState={wrapperSetDataManagerState}/>
            </div>
        </div>
    )
}

export default PatientManager;
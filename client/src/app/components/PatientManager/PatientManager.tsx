'use client'
import styles from './PatientManager.module.scss'
import { Button, TextField } from '@mui/material'

import { useState } from 'react'

import PatientTable from './../PatientTable/PatientTable'

const PatientManager = () => {

    const [nameFilterValue, setNameFilterValue] = useState('')

    return(
        <div className={styles['panel-wrapper']}>
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
                            onChange={(e) => setNameFilterValue(e.target.value)}
                            value={nameFilterValue}
                            >
                        </TextField>
                    </div>

                    <div className={styles['apply-filter']}>
                        <Button variant='contained' sx={{margin: 0}}>Search</Button>
                    </div>

                    <div className={styles['clear-filter']}>
                        <Button variant='outlined' sx={{margin: 0}}>Clear Filter</Button>
                    </div>
                    
                    <div className={styles['add-new']}>
                        <Button variant='contained' sx={{margin: 0}}>Add New Patient</Button>
                    </div>

                </div>
            </div>

            <div className={styles['data-table']}>
                <PatientTable/>
            </div>
        </div>
    )
}

export default PatientManager;
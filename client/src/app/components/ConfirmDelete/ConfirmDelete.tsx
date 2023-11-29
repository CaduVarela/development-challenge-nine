'use client'

import styles from './ConfirmDelete.module.scss'
import palette from './../../styles/utils.module.scss'
import { Button } from '@mui/material'

const ConfirmDelete = ({
    setDeleteAnswer,
    desc
} : {
    setDeleteAnswer: (val: boolean | null) => void
    desc?: string
}) => {
    
    return(<>
        <div className={styles['blur-background']} onClick={() => setDeleteAnswer(null)}></div>
        <div className={styles['confirm-delete-panel']}>
            <h1>Confirm delete?</h1>
            {typeof desc !== undefined &&
                <p>{desc}</p>
            }
            <div className='text-center'>
                <Button variant='contained' onClick={() => setDeleteAnswer(true)} color='warning' sx={{margin: 0, marginRight: '16px'}}>Delete</Button>
                <Button variant='contained' onClick={() => setDeleteAnswer(null)} sx={{margin: 0, marginLeft: '16px'}}>No</Button>
            </div>
        </div>
    </>)
}

export default ConfirmDelete;
import express from 'express'

import * as patientController from './../controllers/PatientController' 

const router = express.Router()

router.route('/')
    .post(patientController.persistPatient)
    .get(patientController.getAllPatients)

router.route('/:id')
    .put(patientController.updatePatient)
    .delete(patientController.deletePatient)
    .get(patientController.getPatientById)

export = router
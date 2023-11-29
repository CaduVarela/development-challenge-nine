import express from 'express'

import * as patientController from './../controllers/PatientController' 

const router = express.Router()

router.route('/patients')
    .post(patientController.persistPatient)
    .get(patientController.getAllPatients)

router.route('/patients/:id')
    .put(patientController.updatePatient)
    .delete(patientController.deletePatient)
    .get(patientController.getPatientById)

export = router
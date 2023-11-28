import { Request, Response } from "express";
import { PatientType, isPatientType } from "@/models/PatientModel";
import * as patientService from './../services/PatientService';
import * as utils from '../utils';

function getHttpErrorStatusCode(error: utils.CustomError) {
    const databaseErrors = ['Error', 'ValidationError']

    if (error.errorTitle && databaseErrors.includes(error.errorTitle))
        return 400
    else
        return 500
}

function invalidRequest(res: Response, message='Invalid request') {
    res.status(400)
    res.json({
        errorTitle: 'Invalid request',
        errorMessage: message,
        rawError: 'Error on cath request in controller (bad request)'
    } as utils.CustomError)
}

export async function persistPatient(req : Request, res : Response) {
    const data = await patientService.persistPatient(req.body)

    res.status(200)

    res.json(data)
}

export async function getAllPatients(req : Request, res : Response) {
    const { name } = req.query

    const data = typeof name === 'string' ? await patientService.getAllPatients(name) : await patientService.getAllPatients();

    res.status(200)

    res.json(data)
}

export async function getPatientById(req : Request, res : Response) {
    const data = await patientService.getPatientById(parseInt(req.params.id))

    res.status(200)

    res.json(data)
}

export async function updatePatient(req : Request, res : Response) {
    const data = await patientService.updatePatient(parseInt(req.params.id), req.body)

    res.status(200)

    res.json(data)
}

export async function deletePatient(req : Request, res : Response) {
    const data = await patientService.deletePatient(parseInt(req.params.id))

    res.status(200)

    res.json(data)
}
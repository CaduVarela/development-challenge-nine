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
    if ( Object.entries(req.body).length === 0 || !isPatientType(req.body) ) {
        invalidRequest(res)
        return
    }

    const patientJSON : PatientType = {
        name: req.body.name,
        birthdate: req.body.birthdate,
        email: req.body.email,
        postalCode: req.body.postalCode,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        addressNumber: req.body.addressNumber,
    }

    const data = await patientService.persistPatient(patientJSON)

    res.status(200)
    if(utils.isCustomError(data))
        res.status(getHttpErrorStatusCode(data))

    res.json(data)
}

export async function getAllPatients(req : Request, res : Response) {
    const { name } = req.query

    const data = typeof name === 'string' ? await patientService.getAllPatients(name) : await patientService.getAllPatients();

    res.status(200)
    if(utils.isCustomError(data))
        res.status(getHttpErrorStatusCode(data))

    res.json(data)
}

export async function getPatientById(req : Request, res : Response) {
    if (typeof req.params.id !== "string") {
        invalidRequest(res)
        return
    }

    const data = await patientService.getPatientById(parseInt(req.params.id))

    res.status(200)
    if(utils.isCustomError(data))
        res.status(getHttpErrorStatusCode(data))

    res.json(data)
}

export async function updatePatient(req : Request, res : Response) {
    
    if ( Object.entries(req.body).length === 0 || !isPatientType(req.body) ) {
        invalidRequest(res)
        return
    }

    const patientJSON : PatientType = {
        name: req.body.name,
        birthdate: req.body.birthdate,
        email: req.body.email,
        postalCode: req.body.postalCode,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        addressNumber: req.body.addressNumber,
    }

    const data = await patientService.updatePatient(parseInt(req.params.id), patientJSON)

    res.status(200)
    if(utils.isCustomError(data))
        res.status(getHttpErrorStatusCode(data))

    res.json(data)
}

export async function deletePatient(req : Request, res : Response) {
    const data = await patientService.deletePatient(parseInt(req.params.id))

    res.status(200)
    if(utils.isCustomError(data))
        res.status(getHttpErrorStatusCode(data))

    res.json(data)
}
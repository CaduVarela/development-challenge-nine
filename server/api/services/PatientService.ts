import { Op, QueryTypes } from 'sequelize'
import * as utils from '../utils'

import { Patient, PatientType } from './../models/PatientModel'

export async function getAllPatients(whereNameLike?: string) {

    let nameFilterArgument = '%';

    if (whereNameLike) {
        nameFilterArgument = `%${whereNameLike}%`
    }

    try {
        const patientsData = await Patient.findAll({
            raw: true,
            where: {
                name: {
                    [Op.like]: nameFilterArgument
                },
            }
        })
        return patientsData
    } catch(error: any) {
        return utils.generateErrorJSON(error)
    }
}

export async function persistPatient(patientJSON : PatientType) {
    try {
        const newPatient = await Patient.create(patientJSON)
        return newPatient;
    } catch(error: any) {
        return utils.generateErrorJSON(error)
    }
}

export function getPatientById(id : number) {
    return Patient.findByPk(id).catch(utils.generateErrorJSON)
}

export function updatePatient(changeOnId : number, newPatientValueJSON : PatientType) {
    return Patient.update(newPatientValueJSON, {
        where: {
            id: {
                id: changeOnId
            }
        }
    }).catch(utils.generateErrorJSON)
}

export function deletePatient(deleteOnId : number) {
    return Patient.destroy({
        where: {
            id: deleteOnId
        }
    }).catch(utils.generateErrorJSON)
}
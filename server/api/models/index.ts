import * as dotenv from 'dotenv'
dotenv.config()

//import sequelize from './../../config/sequelize'

import { Patient } from './PatientModel'

Patient.sync({ alter: true })
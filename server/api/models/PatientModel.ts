import sequelize from '../../config/sequelize'
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class Patient extends Model<InferAttributes<Patient, { omit: '' }>, InferCreationAttributes<Patient, { omit: '' }>> {
    declare id: CreationOptional<number>

    declare name: string
    declare birthdate: Date
    declare email: string

    declare postalCode?: string
    declare country: string
    declare state: string
    declare city: string
    declare street: string
    declare addressNumber?: number
}

Patient.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
                isBefore: (() => {
                    let date = new Date()
                    date.setDate(date.getDate() + 1)

                    return date.toISOString().slice(0, 10)
                })()
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },

        postalCode: {
            type: DataTypes.STRING(9),
            defaultValue: ''
        },
        country: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        addressNumber: {
            type: DataTypes.INTEGER,
            defaultValue: null
        }
    },
    {
        tableName: 'patient',
        sequelize
    }
)

export type PatientType = {
    id?: number

    name: string
    birthdate: Date
    email: string

    postalCode?: string
    country: string
    state: string
    city: string
    street: string
    addressNumber?: number
}

export function isPatientType(data: PatientType | any): data is PatientType {
    return (
        typeof data.name === 'string' &&
        typeof data.email === 'string' &&
        typeof data.country === 'string' &&
        typeof data.state === 'string' &&
        typeof data.city === 'string' &&
        typeof data.street === 'string'
    )
}
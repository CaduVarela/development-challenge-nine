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

export function isPatientType(data: PatientType | any) {
    if (data === undefined) return false
    return (
        typeof (data as PatientType).name === 'string' &&
        typeof (data as PatientType).email === 'string' &&
        typeof (data as PatientType).country === 'string' &&
        typeof (data as PatientType).state === 'string' &&
        typeof (data as PatientType).city === 'string' &&
        typeof (data as PatientType).street === 'string'
    )
}
export type CustomError = {
    errorTitle?: string
    errorMessage?: string
    rawError: any
}

export function generateErrorJSON(error: string | CustomError | any) {
    let errorJSON: CustomError

    if(typeof error === 'string') {
        errorJSON = {
            rawError: error
        }
    }

    else if ('errorTitle' in error) {
        errorJSON = error
    }

    else {
        errorJSON = {
            errorTitle: error.constructor.name,
            errorMessage: error.parent?.sqlMessage || error.errors?.map((error: any) => error.message),
            rawError: error
        }
    }
}
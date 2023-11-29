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

export function isCustomError(data: CustomError | any | undefined): data is CustomError {
    if (data !== undefined && data !== null) {
        return (data as CustomError).rawError !== undefined
    }
    return false
}
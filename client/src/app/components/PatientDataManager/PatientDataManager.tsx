'use client'
import react from 'react'

// Style
import styles from './PatientDataManager.module.scss'
import palette from './../../styles/utils.module.scss'

// Hooks
import { useState, useEffect } from 'react'

// Material UI
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Button from '@mui/material/Button'

// Dayjs
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'

import { Icon, styled } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PatientType, isPatientType } from '@/shared/PatientType'
import CustomError from '@/shared/CustomError'

//import CountrySelect from '../CountrySelect/CountrySelect'

const PatientDataManager = ({
    variant='manager',
    targetId,
    setDataManagerState
} : {
    variant?: string,
    targetId?: number,
    setDataManagerState: (val: 'new' | 'manager'| '' | null) => void
}) => {

    const suportedLocaleLanguages = ['EN', 'BR'];
    const [userIPCountryCode, setUserIPCountryCode] = useState('en');
    const [formCurrentStep, setFormCurrentStep] = useState(0);

    const formSteps = [
        {
            id: 'personal',
            title: 'Patient user personal info',
        },
        {
            id: 'address',
            title: 'Patient address info',
        },
    ]
    const [formStepsError, setFormStepsError] = useState([false, false])

    interface Form {
        name: FormItem<string>,
        email: FormItem<string>,
        birthdate: FormItem<Dayjs | null>,
        postalCode: FormItem<string>,
        city: FormItem<string>,
        country: FormItem<string>,
        state: FormItem<string>,
        streetAddress: FormItem<string>,
        addressNumber: FormItem<string>
    }

    interface FormItem<fieldValueType> {
        value: fieldValueType,
        error: boolean,
        helperText: string,
        isRequired: boolean,
    }

    const defaultForm : Form = {
        name: { value: '', error: false, helperText: '', isRequired: true},
        email: { value: '', error: false, helperText: '', isRequired: true},
        birthdate: { value: null, error: false, helperText: '', isRequired: true},
        postalCode: { value: '', error: false, helperText: '', isRequired: false},
        city: { value: '', error: false, helperText: '', isRequired: true},
        country: { value: '', error: false, helperText: '', isRequired: true},
        state: { value: '', error: false, helperText: '', isRequired: true},
        streetAddress: { value: '', error: false, helperText: '', isRequired: true},
        addressNumber: { value: '', error: false, helperText: '', isRequired: false},
    }
    
    // Styled 
    const NavButton = styled(Button)({
        fontSize: '1.15em', 
        margin: 0, 
        padding: '2px', 
        color: palette.gray,
        borderBottom: `2px solid ${palette.gray}`, 
        borderRadius: '8px 8px 0 0',
        '&.error': {
            color: palette.warning,
            borderColor: palette.warning,
        },
        '&.current': {
            color: palette.themeColor,
            borderColor: palette.themeColor,
        },
        '&.current&.error': {
            color: palette.warning,
            borderColor: palette.warning,
            backgroundColor: palette.themeColorContrastLight,
        }
    })

    // Backend communication
    const queryClient = useQueryClient()
    
    // If targetId exists, gets patient based on this id
    let patientQuery
    if (targetId) {
        patientQuery = useQuery({
            queryKey: ['patients', targetId],
            queryFn: () => {
                return fetch(`http://localhost:22194/patients/${targetId}`)
                    .then((res) => res.json())
                    .then((resJson : PatientType | CustomError) => {
                    if ('rawError' in resJson)
                        throw resJson
                    return resJson
                })
            },
        })
    }

    const patientSearchMutation = useMutation({
        mutationFn: (newPatient : PatientType) => {
            return fetch(`http://localhost:22194/patients/${targetId}`, {
                method: 'PUT',
                body: JSON.stringify(newPatient),
                headers: {'Content-type': 'application/json'}
            })
            .then((res) => res.json())
            .then((resJson: PatientType | CustomError) => {
                if('rawError' in resJson)
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries()
            setDataManagerState(null)
        }
    })

    const patientCreateMutation = useMutation({
        mutationFn: (newPatient : PatientType) => {
            return fetch('http://localhost:22194/patients', {
                method: 'POST',
                body: JSON.stringify(newPatient),
                headers: {'Content-type': 'application/json'}
            })
            .then((res) => res.json())
            .then((resJson : PatientType | CustomError) => {
                if ('rawError' in resJson)
                    throw resJson
                return resJson
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries()
            setDataManagerState(null)
        }
    })

    // Defines current patient to defaultForm values or sync it to database if a targetId is defined
    const [currentPatient, setCurrentPatient] = useState(defaultForm)
    if (patientQuery !== undefined && patientQuery.data !== undefined) { 
        currentPatient.name.value = patientQuery.data.name as string
        currentPatient.email.value = patientQuery.data.email as string
        currentPatient.birthdate.value = dayjs(patientQuery.data.birthdate)
        currentPatient.postalCode.value = patientQuery.data.postalCode as string
        currentPatient.city.value = patientQuery.data.city as string
        currentPatient.country.value = patientQuery.data.country as string
        currentPatient.state.value = patientQuery.data.state as string
        currentPatient.streetAddress.value = patientQuery.data.street as string
        if (typeof patientQuery.data.addressNumber === 'number')
            currentPatient.addressNumber.value = patientQuery.data.addressNumber.toString()
    }

    const [form, setForm] = useState<Form>(currentPatient);

    // 
    async function getUserIPCountryCode() {
        let response = await fetch('http://ip-api.com/json/?fields=61439')
            .then(res => res.json());
        let countryCode : string = '';
        switch (response.countryCode) {
            case 'BR':
                countryCode = 'pt-br'
                break;
            default:
                if (suportedLocaleLanguages.includes(response.countryCode))
                    countryCode = response.countryCode.toLowerCase();
                break;
        }
        setUserIPCountryCode(countryCode);
    }
    useEffect(() => {
        getUserIPCountryCode();
    })

    // Form data manipulation
    function getAllFormFieldsName() {
        let variableNamesInForm : string[] = [];

        // Gets all possible fields
        for (let variableName in form) {
            variableNamesInForm.push(variableName)
        }

        return variableNamesInForm
    }

    function getCurrentFormPageFieldsNames() {
        let variableNamesInForm : string[] = getAllFormFieldsName();
        let currentPageFields : string[] = [];

        // Gets all fields on current form page
        variableNamesInForm.map((variableName : string) => {
            if(typeof document.getElementsByName(variableName)[0] != typeof undefined) {
                currentPageFields.push(variableName)
            }
        })

        return currentPageFields
    }

    function validateFields() {

        // prints current form state
        // console.log('validating: ')
        // console.log(form)

        let isValid : boolean = true;

        if (variant === 'new') {
            const currentPageFieldsNames : string[] = getCurrentFormPageFieldsNames();
            currentPageFieldsNames.map((fieldName : string) => { validateSingleField(fieldName); if(validateSingleField(fieldName) === false) isValid = false })
        }
        else if (variant === 'manager') {
            const allFormFieldsNames : string[] = getAllFormFieldsName();
            allFormFieldsNames.map((fieldName : string) => { validateSingleField(fieldName); if(validateSingleField(fieldName) === false) isValid = false })
        }

        return isValid
    }

    function validateSingleField(fieldName : string) {
        let isValid : boolean = true

        // Checks if its on default value and if it is required
        if ( form[fieldName as keyof Form].value === defaultForm[fieldName as keyof Form].value && defaultForm[fieldName as keyof Form].isRequired) {
            // In case it does, adds error and a helper text to the element
            setForm((prevState: Form) => ({
                ...prevState,
                [fieldName]: { value: prevState[fieldName as keyof Form].value, error: true, helperText: 'Field should not be empty', isRequired: prevState[fieldName as keyof Form].isRequired }
            }));
            isValid = false;
        }

        // Checks if date is valid in case the field is a dayjs variable type
        if (typeof form[fieldName as keyof Form].value === typeof dayjs()) {
            let date = dayjs(form[fieldName as keyof Form].value)
            let isValidDate = date.isValid();
            if (!isValidDate || date.year() > dayjs().year() || date.year() < dayjs().year() - 200) { 
                setForm((prevState: Form) => ({
                    ...prevState,
                    [fieldName]: { value: prevState[fieldName as keyof Form].value, error: true, helperText: 'Invalid date', isRequired: prevState[fieldName as keyof Form].isRequired}
                }));
                isValid = false;
            }
        }

        // Validates email
        if (fieldName === 'email') {
            let email = form.email.value;
            let isEmailValid = email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

            if (!isEmailValid) {
                setForm((prevState: Form) => ({
                    ...prevState,
                    [fieldName]: { value: email, error: true, helperText: 'Invalid email', isRequired: prevState[fieldName as keyof Form].isRequired}
                }));
                isValid = false;
            }
        }

        if (fieldName === 'addressNumber') {
            // Checks if it is a valid number
            if (isNaN(parseInt(form[fieldName as keyof Form].value as string)) && form[fieldName as keyof Form].value !== '') {
                setForm((prevState: Form) => ({
                    ...prevState,
                    [fieldName]: { value: prevState[fieldName as keyof Form].value as string, error: true, helperText: 'Invalid address number', isRequired: prevState[fieldName as keyof Form].isRequired}
                }));
                isValid = false;
                console.log('bruh')
            } 
        }

        return isValid
    }

    function formToPatientType(form : Form) : PatientType {
        return({
            id: targetId,
            name: form.name.value,
            birthdate: (form.birthdate.value as Dayjs).toDate(),
            email: form.email.value,
            postalCode: form.postalCode.value,
            country: form.country.value,
            state: form.state.value,
            city: form.city.value,
            street: form.streetAddress.value,
            addressNumber: parseInt(form.addressNumber.value),
        })
    }

    // handle events
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setForm((prevState: Form) => ({
            ...prevState,
            [name]: { value: value, error: false, helperText: '' }
        }));
    }

    function handleDateInputChange(newValue : Dayjs | null) {
        setForm((prevState: Form) => ({
            ...prevState,
            birthdate: { value: newValue, error: false, helperText: '', isRequired: defaultForm.birthdate.isRequired, }
        }));
    }

    function handleFormNextStep() {
        if (!validateFields()) return;

        if (formCurrentStep < formSteps.length-1) {
            setFormCurrentStep((prevState) => prevState + 1)
        }
        else {
            const newPatient : PatientType = formToPatientType(form)
            patientCreateMutation.mutate(newPatient)
        }
    }

    function handleFormPreviousStep() {
        setFormCurrentStep((prevState) => prevState - 1)
    }

    function handleClear() {
        let currentPageFieldsNames = getCurrentFormPageFieldsNames()

        // Only clears current form page values
        currentPageFieldsNames.map((fieldName) => {
            setForm((prevState: Form) => ({
                ...prevState,
                [fieldName]: defaultForm[fieldName as keyof Form]
            }));
        })
        
    }

    function handleDataUpdate() {
        if (!validateFields()) return;
        
        console.log('passou')

        console.log(form.birthdate.value?.isValid())

        const newPatientDataJSON = formToPatientType(form);

        patientSearchMutation.mutate(newPatientDataJSON);
    }

    // Misc
    // Everytime form changes, check the error state and update form step errors
    useEffect(() => {

        setFormStepsError((prevstate) => [
            prevstate[0] = false,
            prevstate[1] = false
        ]);

        if (form.name.error || form.birthdate.error || form.email.error) {
            setFormStepsError((prevstate) => [
                ...prevstate,
                prevstate[0] = true
            ]);
        } 

        if (form.country.error || form.postalCode.error || form.state.error || form.city.error || form.addressNumber.error || form.streetAddress.error) {
            setFormStepsError((prevstate) => [
                ...prevstate,
                prevstate[1] = true
            ]);
        }

    }, [form])

    return(<>
        <div className={styles['blur-background']} onClick={() => setDataManagerState(null)}></div>
        <div className={styles['panel-wrapper']}>
            <header >
                <div className={styles['title']}>
                    {variant === 'new' &&
                        <h1>New Patient Register</h1>
                    }
                    {variant === 'manager' && <>
                        <NavButton 
                            variant='text' 
                            onClick={() => setFormCurrentStep(0)} 
                            className={`${formCurrentStep === 0 && 'current'} ${formStepsError[0] && 'error'}`}
                        >
                            Personal
                        </NavButton>
                        <NavButton 
                            variant='text' 
                            onClick={() => setFormCurrentStep(1)} 
                            className={`${formCurrentStep === 1 && 'current'} ${formStepsError[1] && 'error'}`}
                        >
                            Address
                        </NavButton>
                    </>}
                </div>
                <div className={styles['close']}>
                    <button onClick={() => setDataManagerState(null)}>
                        <Icon component={CloseIcon} fontSize='large'></Icon>
                    </button>
                </div>
            </header>
            
            {formSteps[formCurrentStep].id === 'personal' && 
            <div className={`${styles['form']} ${styles[formSteps[formCurrentStep].id]}`}>

                <div className={`${styles['form-group']} ${styles['name']}`}>
                    <label htmlFor='form-name'>Name *</label>
                    <TextField error={form.name.error} helperText={form.name.helperText} name='name' id='form-name' placeholder='Patient&apos;s name here' onChange={handleInputChange} value={form.name.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['birthdate']}`}>
                    <label htmlFor='form-birthdate'>Birthdate *</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={userIPCountryCode}>
                        <DatePicker slotProps={{ textField: { variant: "standard", InputProps: { disableUnderline: true }, name: 'birthdate', id: 'form-birthdate',  error: form.birthdate.error, helperText: form.birthdate.helperText } }} onChange={(newValue) => handleDateInputChange(newValue)} sx={{width: "100%" }} value={form.birthdate.value} />
                    </LocalizationProvider>
                </div>

                <div className={`${styles['form-group']} ${styles['email']}`}>
                    <label htmlFor='form-email'>Email *</label>
                    <TextField error={form.email.error} helperText={form.email.helperText} name='email' type='email' id='form-email' placeholder='Patient&apos;s email here' onChange={handleInputChange} value={form.email.value}></TextField>
                </div>
                
            </div>
            }

            {formSteps[formCurrentStep].id === 'address' &&
            <div className={`${styles['form']} ${styles[formSteps[formCurrentStep].id]}`}>

                <div className={`${styles['form-group']} ${styles['country']}`}>
                    <label htmlFor='form-country'>Country *</label>
                    <TextField error={form.country.error} helperText={form.country.helperText} name='country' id='form-country' placeholder='Patient&apos;s country here' onChange={handleInputChange} value={form.country.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['postal-code']}`}>
                    <label htmlFor='form-postal-code'>Postal Code</label>
                    <TextField inputProps={{maxLength: 9}} error={form.postalCode.error} helperText={form.postalCode.helperText} name='postalCode' id='form-postal-code' placeholder='Patient&apos;s postal code here' onChange={handleInputChange} value={form.postalCode.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['city']}`}>
                    <label htmlFor='form-city'>City *</label>
                    <TextField error={form.city.error} helperText={form.city.helperText} name='city' id='form-city' placeholder='Patient&apos;s city here' onChange={handleInputChange} value={form.city.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['state']}`}>
                    <label htmlFor='form-state'>State *</label>
                    <TextField error={form.state.error} helperText={form.state.helperText} name='state' id='form-state' placeholder='Patient&apos;s (address) state here' onChange={handleInputChange} value={form.state.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['street-address']}`}>
                    <label htmlFor='form-street-address'>Street Address *</label>
                    <TextField error={form.streetAddress.error} helperText={form.streetAddress.helperText} name='streetAddress' id='form-street-address' placeholder='Patient&apos;s street address here' onChange={handleInputChange} value={form.streetAddress.value}></TextField>
                </div>
                
                <div className={`${styles['form-group']} ${styles['address-number']}`}>
                    <label htmlFor='form-address-number'>Address Number</label>
                    <TextField error={form.addressNumber.error} helperText={form.addressNumber.helperText} name='addressNumber' id='form-address-number' placeholder='Patient&apos;s address number here' onChange={handleInputChange} value={form.addressNumber.value}></TextField>
                </div>
            </div>
            }

            <div className={styles['form-buttons-row']}>
                {variant === 'new' && <>
                    <Button variant='contained' onClick={handleFormNextStep}>{(formCurrentStep == formSteps.length-1)? 'Finish' : 'Next'}</Button>
                    {formCurrentStep > 0 &&
                        <Button variant='outlined' onClick={handleFormPreviousStep}>Back</Button> 
                    }
                    <Button variant='outlined' onClick={handleClear}>Clear</Button>
                </>}
                {variant === 'manager' && <>
                    <Button variant='contained' onClick={handleDataUpdate}>Save Changes</Button>
                </>}
            </div>
        </div>
    </>)
}

export default PatientDataManager
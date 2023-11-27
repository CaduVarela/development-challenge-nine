'use client'
import react from 'react'

// Style
import styles from './PatientDataManager.module.scss'

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

import { Icon } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

//import CountrySelect from '../CountrySelect/CountrySelect'

const PatientDataManager = ({variant='manager'} : {variant?: string}) => {

    const suportedLocaleLanguages = ['EN', 'BR'];
    const [userIPCountryCode, setUserIPCountryCode] = useState('EN');
    const [formCurrentStep, setFormCurrentStep] = useState(0);

    const formSteps = [
        {
            id: 'personal',
            title: 'Patient user personal info'
        },
        {
            id: 'address',
            title: 'Patient address info'
        },
    ]


    interface Form {
        name: FormItem<string>,
        email: FormItem<string>,
        birthdate: FormItem<Dayjs | null>,
        postalCode: FormItem<string>,
        city: FormItem<string>,
        country: FormItem<string>,
        state: FormItem<string>,
        streetAddress: FormItem<string>,
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
    }

    const [form, setForm] = useState<Form>(defaultForm);
    
    // 
    async function getUserIPCountryCodeCountryCode() {
        let response = await fetch('http://ip-api.com/json/?fields=61439')
            .then(res => res.json());
        let countryCode = '';
        switch (response.countryCode) {
            case 'BR':
                countryCode = 'pt-br'
                break;
            default:
                if (suportedLocaleLanguages.includes(response.countryCode))
                    countryCode = response.countryCode;
                break;
        }
        setUserIPCountryCode(countryCode);
    }

    async function getZipCode() {
        let response = await fetch('')
            .then(res => res.json());
        console.log(response)
    }

    useEffect(() => {
        getUserIPCountryCodeCountryCode();
        //getZipCode();
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

    function getCurrentFormPageFieldsName() {
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
        console.log('validating: ')
        console.log(form)

        let isWrong : boolean = false;
        let currentPageFieldsName : string[] = getCurrentFormPageFieldsName();

        // Checks all current form step fields are filled
        currentPageFieldsName.map((variableName : string) => {

            // Checks if its not on default value and if it is required
            if ( form[variableName as keyof Form].value === defaultForm[variableName as keyof Form].value && defaultForm[variableName as keyof Form].isRequired) {
                // In case it does, add error and a helper text to the element
                setForm((prevState: Form) => ({
                    ...prevState,
                    [variableName]: { value: prevState[variableName as keyof Form].value, error: true, helperText: 'Field should not be empty', isRequired: prevState[variableName as keyof Form].isRequired }
                }));
                isWrong = true;
            }

            // Checks if date is valid in case the field is a dayjs variable type
            if (typeof form[variableName as keyof Form].value === typeof dayjs()) {
                let isValidDate = dayjs(form[variableName as keyof Form].value).isValid();
                if (!isValidDate) { 
                    setForm((prevState: Form) => ({
                        ...prevState,
                        [variableName]: { value: prevState[variableName as keyof Form].value, error: true, helperText: 'Invalid date', isRequired: prevState[variableName as keyof Form].isRequired}
                    }));
                    isWrong = true;
                }
            }

            // Validates email
            if (variableName === 'email') {
                let email = form.email.value;
                let isValid = email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

                if (!isValid) {
                    setForm((prevState: Form) => ({
                        ...prevState,
                        [variableName]: { value: email, error: true, helperText: 'Invalid email', isRequired: prevState[variableName as keyof Form].isRequired}
                    }));
                    isWrong = true;
                }
            }
        })

        return !isWrong
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

        if (formCurrentStep < formSteps.length-1)
            setFormCurrentStep((prevState) => prevState + 1)
    }

    function handleFormPreviousStep() {
        setFormCurrentStep((prevState) => prevState - 1)
    }

    function handleClear() {
        let currentPageFieldsName = getCurrentFormPageFieldsName()

        // Only clears current form page values
        currentPageFieldsName.map((name) => {
            setForm((prevState: Form) => ({
                ...prevState,
                [name]: defaultForm[name as keyof Form]
            }));
        })
        
    }

    function handleDataUpdate() {

    }


    return(
        <div className={styles['panel-wrapper']}>
            <header>
                <div className={styles['title']}>
                    {variant === 'new' &&
                        <h1>New Patient Register</h1>
                    }
                    {variant === 'manager' && <>
                        <Button variant='text' onClick={() => setFormCurrentStep(0)} sx={{fontSize: '1.15em', margin: 0}}>Personal</Button>
                        <Button variant='text' onClick={() => setFormCurrentStep(1)} sx={{fontSize: '1.15em', margin: 0}}>Address</Button>
                    </>}
                </div>
                <div className={styles['close']}>
                    <button>
                        <Icon component={CloseIcon} fontSize='large'></Icon>
                    </button>
                </div>
            </header>
            
            {formSteps[formCurrentStep].id === 'personal' && 
            <div className={`${styles['form']} ${styles[formSteps[formCurrentStep].id]}`}>

                <div className={`${styles['form-group']} ${styles['name']}`}>
                    <label htmlFor='form-name'>Name *</label>
                    <TextField error={form.name.error} helperText={form.name.helperText} name='name' id='form-name' placeholder='Teste' onChange={handleInputChange} value={form.name.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['birthdate']}`}>
                    <label htmlFor='form-birthdate'>Birthdate *</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={userIPCountryCode}>
                        <DatePicker slotProps={{ textField: { variant: "standard", InputProps: { disableUnderline: true }, name: 'birthdate',  error: form.birthdate.error, helperText: form.birthdate.helperText } }} onChange={(newValue) => handleDateInputChange(newValue)} sx={{width: "100%" }} value={form.birthdate.value} />
                    </LocalizationProvider>
                </div>

                <div className={`${styles['form-group']} ${styles['email']}`}>
                    <label htmlFor='form-email'>Email *</label>
                    <TextField error={form.email.error} helperText={form.email.helperText} name='email' type='email' id='form-email' placeholder='Teste' onChange={handleInputChange} value={form.email.value}></TextField>
                </div>
                
            </div>
            }

            {formSteps[formCurrentStep].id === 'address' &&
            <div className={`${styles['form']} ${styles[formSteps[formCurrentStep].id]}`}>
                <div className={`${styles['form-group']} ${styles['postal-code']}`}>
                    <label htmlFor='form-postal-code'>Postal Code</label>
                    <TextField error={form.postalCode.error} helperText={form.postalCode.helperText} name='postalCode' id='form-postal-code' placeholder='Teste' onChange={handleInputChange} value={form.postalCode.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['city']}`}>
                    <label htmlFor='form-city'>City *</label>
                    <TextField error={form.city.error} helperText={form.city.helperText} name='city' id='form-city' placeholder='Teste' onChange={handleInputChange} value={form.city.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['country']}`}>
                    <label htmlFor='form-country'>Country *</label>
                    <TextField error={form.country.error} helperText={form.country.helperText} name='country' id='form-country' placeholder='Teste' onChange={handleInputChange} value={form.country.value}></TextField>
                </div>

                {/*
                <div className={`${styles['form-group']} ${styles['country']}`}>
                    <label htmlFor='form-country'>Country *</label>
                    <CountrySelect name='country'/>
                </div>
                */}

                <div className={`${styles['form-group']} ${styles['state']}`}>
                    <label htmlFor='form-state'>State *</label>
                    <TextField error={form.state.error} helperText={form.state.helperText} name='state' id='form-state' placeholder='Teste' onChange={handleInputChange} value={form.state.value}></TextField>
                </div>

                <div className={`${styles['form-group']} ${styles['street-address']}`}>
                    <label htmlFor='form-street-address'>Street Address *</label>
                    <TextField error={form.streetAddress.error} helperText={form.streetAddress.helperText} name='streetAddress' id='form-street-address' placeholder='Teste' onChange={handleInputChange} value={form.streetAddress.value}></TextField>
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
    )
}

export default PatientDataManager
'use client'
import { createTheme } from "@mui/material/styles";

import palette from "./../utils.module.scss";

const mainTheme = createTheme({
    palette: {
        primary: {
            main: palette.themeColor,
        },
        secondary: {
            main: palette.themeColorContrast,
        },
        warning: {
            main: palette.warning,
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                }
            },
            defaultProps: {
                variant: 'standard',
                InputProps: {
                    disableUnderline: true,
                },
                fullWidth: true,
                FormHelperTextProps: {
                    sx: {
                        height: 0,
                        padding: 0,
                        margin: 0,
                    }
                },
                InputLabelProps: {
                    style: { 
                        zIndex: 1, 
                        top: '8px', 
                        left: '13px', 
                        pointerEvents: 'none', 
                        color: palette.darkGray,
                    }, 
                    sx: { 
                        "&.MuiInputLabel-shrink": {
                            color: palette.themeColor,
                            marginTop: '-10px',
                        },
                    }
                }
            },
            variants: [
                {
                    props: { variant: 'outlined' },
                    style: {
                    }
                },
            ],
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    padding: "13px 13px 8px",
                    borderRadius: "8px",
                    width: "100%",
                    backgroundColor: palette.lightGray,
                    fontSize: ".9em",
                    ":hover": {
                        borderColor: palette.darkestGray,
                    },
                    ":focus-within": {
                        borderColor: palette.themeColor,
                        backgroundColor: palette.lightestGray,
                    },
                    "&.Mui-error": {
                        borderColor: palette.themeColorContrast,
                        backgroundColor: palette.themeColorContrastLight,
                    },
                    "&.MuiPickersPopper-root": {
                        backgroundColor: palette.backgroundColor,
                    },
                },
            },
            defaultProps: {
                size: "small",
                sx: {
                    border: 1,
                    borderColor: palette.gray,
                },
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: 'contained' },
                    style: {
                        color: palette.backgroundColor,
                        boxShadow: 'none',
                    }
                },
                {
                    props: { variant: 'outlined' },
                    style: {
                    }
                }
            ],
            defaultProps: {
                size: 'large',
            },
            styleOverrides: {
                root: {
                    minWidth: '168px',
                    margin: '0 32px 16px 0',
                },
            },
        },
        MuiAutocomplete: {
            defaultProps: {
                fullWidth: true,
                sx: {
                    border: 0,
                    outline: 0,
                },
            },
        }
    }
})

export default mainTheme;
'use client'
import ReactQueryWrapper from "./components/ReactQueryWrapper/ReactQueryWrapper"

import MainTheme from './styles/mui/mainTheme'
import { ThemeProvider } from "@emotion/react"

import KloudsBackground from "./components/Klouds/KloudsBackground"
import PatientDataManager from "./components/PatientDataManager/PatientDataManager"
import PatientManager from "./components/PatientManager/PatientManager"

export default function Home() {

  return (
    <ReactQueryWrapper>
      <ThemeProvider theme={MainTheme}>
        <KloudsBackground/>
        <PatientManager/>
      </ThemeProvider>
    </ReactQueryWrapper>
  )
}

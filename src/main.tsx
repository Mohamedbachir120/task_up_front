import React from 'react'
import ReactDOM from 'react-dom/client'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import App from './App'
import './index.css'
import './annimation.css'
import LoginPage from './app/views/LoginPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from './app/views/RegisterPage'
import Home from './app/views/Home'
import PublicWrapper from './app/hoc/UnProtected'
import PrivateWrapper from './app/hoc/Protected'
import AlertPage from './app/views/AlertPage'
import { Objectif } from './app/models/Objectif'
import ObjectifPage from './app/views/Objectif'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"  replace/>}   />
        <Route path='/login' element={
          <PublicWrapper>

            <LoginPage />
          </PublicWrapper>
        }>

        </Route>
        <Route path='/register' element={
          <PublicWrapper>

            <RegisterPage />
          </PublicWrapper>
        }>

        </Route>

        <Route path='/home' element={
          <PrivateWrapper>

            <Home />
          </PrivateWrapper>
        }>

        </Route>
        <Route path='/objectifs' element={
          <PrivateWrapper>
            <ObjectifPage />
          </PrivateWrapper>
        }>
        </Route>
        <Route path='/notifications' element={
          <PrivateWrapper>

            <AlertPage />
          </PrivateWrapper>
        }>
          
        </Route>

      </Routes>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

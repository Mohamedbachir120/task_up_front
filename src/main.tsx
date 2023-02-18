import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './annimation.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './app/views/LoginPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from './app/views/RegisterPage'
import Home from './app/views/Home'
import { Provider } from 'react-redux'
import { store } from './app/store'
import PublicWrapper from './app/hoc/UnProtected'
import PrivateWrapper from './app/hoc/Protected'

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

      </Routes>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

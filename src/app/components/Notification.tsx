import React from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MainUiState, hideNotification } from '../../features/mainUi'

function NotificationAlert() {
    const dispatch = useAppDispatch()
    const mainUi = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi)
  return (
    <div>
    <ToastContainer position="top-end">
    <Toast show={mainUi.notificaionShown} onClose={()=>
        dispatch(hideNotification()) } >
          <Toast.Header className="bg-success text-white">
            <img  src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">{mainUi.notificationTitle}</strong>
            <small>Maintenant</small>
          </Toast.Header>
          <Toast.Body>{mainUi.notificationBody}</Toast.Body>
        </Toast>
    </ToastContainer>

    </div>
  )
}

export default NotificationAlert
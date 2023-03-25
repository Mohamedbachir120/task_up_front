import React, { useState } from 'react'
import Header from '../components/Header'
import SideBar from '../components/SideBar'
import { useFetchAlertQuery } from '../../features/alerts/alert'
import { useAppSelector } from '../hooks'
import { MainUiState } from '../../features/mainUi'
import { AuthState } from '../../features/auth/auth-slice'
import { Alert } from '../models/Alert'
import { Button, Card, Placeholder } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCheck, faEye } from '@fortawesome/free-solid-svg-icons'
import NotificationAlert from '../components/Notification'

function AlertPage() {
    const  [keyword,setKeyword] =  useState('')
    const {data,isLoading} = useFetchAlertQuery({keyword:""})
    const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
    const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  return (
    <div className='bg-white' style={{"minHeight":"100vh"}}>
          <NotificationAlert />

        <SideBar active="notifications" isOpened={false} /> 
         <Header />
         <div  className={` ${mainUi.margin_left} `}>
            {isLoading && (
                <div>
         <Card className='mx-5 my-3'  style={{ width: '90%' }}>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={3} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={12} /> 
             <Placeholder xs={12} size='lg' />
          </Placeholder>
        </Card.Body>
      </Card>
      <Card className='mx-5 my-3'  style={{ width: '90%' }}>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={3} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={12} /> 
             <Placeholder xs={12} size='lg' />
          </Placeholder>
        </Card.Body>
      </Card>
      <Card className='mx-5 my-3'  style={{ width: '90%' }}>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={3} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={12} /> 
             <Placeholder xs={12} size='lg' />
          </Placeholder>
        </Card.Body>
      </Card>
      </div>)}
            {!isLoading && data?.alerts?.map((alert)=>(<AlertComonent alert={alert} key={alert.id} />))}
        </div>
    </div>
  )
}
export function AlertComonent(param:{alert:Alert}){
    const {alert} = param
    return (<div className='card  mx-5 my-3 '>
        <div className='d-flex flex-row justify-content-between mx-2 my-2'>
        <div className='border text-secondary fs-6 p-1 rounded' style={{"maxWidth":"fit-content"}}>
            {alert.title}
        </div>
        <Button className="btn btn-light text-secondary" title='marquer comme lû'>
            <FontAwesomeIcon icon={faEye} />
        </Button>
        </div>
        <div className='ms-3 text-dark fs-5 px-3 pb-2'>
           <FontAwesomeIcon icon={faCheck} className='text-success' />     {alert.message}
        </div>
            {alert.title == "Dépechez vous" ?
            (<div className='bg-warning p-2 d-flex flex-row justify-content-between'>
                <div><FontAwesomeIcon icon={faBell} />     Tâche bientôt expiré</div>
                <div>
                        {alert.created_at.split('T')[0] }
                </div>    
            </div>):alert.title == "Date d'échéance expiré" ?
             (<div className='bg-danger text-light p-2 d-flex flex-row justify-content-between'>
                <div>

                <FontAwesomeIcon icon={faBell} />      Tâche  expiré  
                </div>
                <div>
                {alert.created_at.split('T')[0]}
                </div>
             </div>):
             <div className='bg-success text-light p-2 d-flex flex-row justify-content-between'>
                <div>  <FontAwesomeIcon icon={faBell} />     Tâche  assigné </div> 
                <div> {alert.created_at.split('T')[0]} </div>
             </div>   }
        
        
    </div>)
}

export default AlertPage
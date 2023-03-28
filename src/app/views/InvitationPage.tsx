import React from 'react'
import NotificationAlert from '../components/Notification'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import { useChangeStatusMutation, useFetchInvitationQuery } from '../../features/invitation/invitation'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MainUiState, setRefetchInvitation } from '../../features/mainUi'
import { Card, Placeholder } from 'react-bootstrap'
import { Invitation } from '../models/Invitation'
import CustomImage from '../components/Image'
import { randomColor } from '../constantes/constantes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'

function InvitationPage() {
    const keyword = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.refetchInvitations) 
    const {data,isLoading} = useFetchInvitationQuery({keyword:keyword});

    const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)

  return (
    <div className='bg-white' style={{"minHeight":"100vh"}}>
        <NotificationAlert />

        <SideBar active="invitation" isOpened={false} /> 
        <Header />
        <div  className={`${mainUi.margin_left} `}>
        <h2 className='text-secondary  mt-3 mx-5'><AiOutlineUsergroupAdd /> Invitations </h2>

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
      <div className='px-5 py-3'>
            {
                !isLoading && data?.map((inv:Invitation)=>(
                    <InvitationComponent invitation={inv} key={inv.id} />
                ))
            }
        
      </div>
        </div>
   </div>
  )
}
export function  InvitationComponent(param:{invitation:Invitation}){
    const {invitation} = param;
    const [changeStatus] = useChangeStatusMutation();
    const dispatch = useAppDispatch();
    return (
        <div className='card p-2 shadow-sm'>
            <div className="d-flex flex-row justify-content-start align-items-center">

                <div className='col-auto'>
                 <CustomImage data={{classes:"rounded-circle ",color:"ffffff",background:randomColor(invitation.collaboration.created_by.id),height:"5vh",label:invitation.collaboration.created_by.name.split(" ")[0].charAt(0)+invitation.collaboration.created_by.name.split(" ")[1].charAt(0)}}  />
                </div>    
            <div>
          <span className='text-secondary fw-bold fs-6'>
            
            &nbsp; &nbsp;{invitation.collaboration.created_by.name}</span>
            </div>
            </div>
            <p className='mx-5 my-1'>
                Souhaite vous inviter à rejoindre <strong> {invitation.collaboration.topic} </strong>
            </p>
            <div className='d-flex flex-row justify-content-end'>
                <button className='btn btn-danger col-1 mx-1' onClick={async ()=>{
                    try {
                        const {message,success} = await changeStatus({id:invitation.id,status:"REJECTED"}).unwrap();
                       dispatch(setRefetchInvitation((Math.random() * 100).toString())); 
                    } catch (error) {
                            alert("Opération échoué")
                    }
                    
               }}>
                        <FontAwesomeIcon icon={faXmark} /> Rejeter
                </button>
                <button className='btn btn-success col-auto mx-1' onClick={async ()=>{
                      try {
                        const {message,success} = await changeStatus({id:invitation.id,status:"ACCEPTED"}).unwrap();
                       dispatch(setRefetchInvitation((Math.random() * 100).toString()));
                    } catch (error) {
                            alert("Opération échoué")
                    }
                }}>
                        <FontAwesomeIcon icon={faCheck} /> Accepter
                </button>
            </div>

        </div>
    );
}

export default InvitationPage
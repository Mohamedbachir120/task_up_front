import React from 'react'
import NotificationAlert from '../components/Notification'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import { useAppSelector } from '../hooks'
import { MainUiState } from '../../features/mainUi'
import { useParams } from 'react-router-dom'
import { useDetailsCollaborationQuery } from '../../features/collaboration/collaboration'
import { AiOutlineNodeCollapse, AiOutlineOrderedList } from 'react-icons/ai'
import { BsPeopleFill } from 'react-icons/bs'
import { Departement } from '../models/Departement'
import CustomImage from '../components/Image'
import { randomColor } from '../constantes/constantes'
import AddStep from '../components/AddStep'
import { Step } from '../models/Step'

function CollaborationPage() {
  const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  const {id} = useParams();
  const {data,isLoading} = useDetailsCollaborationQuery({id: parseInt(id!)});  
  return (
    <div>
        <div className='bg-light' style={{"minHeight":"100vh"}}>
        <NotificationAlert />

        <SideBar active="collaboration" isOpened={false} /> 
         <Header />
         <AddStep />
        <div  className={` ${mainUi.margin_left} `}>
                <h2 className='text-secondary m-3'> 
                <AiOutlineNodeCollapse />   {data?.collaboration.topic}</h2>
                <h3 className='m-3 text-violet'>
                    <BsPeopleFill />&nbsp;
                     Participants </h3>    
                <div className='d-flex flex-row align-items-center flex-wrap'>
                { data?.departements.map((dep:Departement)=>
                (<div className='card col-3 p-3 m-2' key={dep.id}>
                    <div className='d-flex flex-row justify-content-center'>
                        <CustomImage data={{classes:"rounded-circle ",color:"ffffff",
                        background:randomColor(dep.id),height:"10vh",
                        label:dep.name.split(" ")[0].charAt(0)+dep.name.split(" ")[1].charAt(0)}}  />
                    </div>
                    <h5 className='text-secondary text-center my-2'>{dep.name}</h5>

                </div>)
                )   }

                </div>  
                <h3 className='m-3 text-violet'>
                    <AiOutlineOrderedList />&nbsp;
                    Étapes </h3>   
                    <div className='d-flex flex-row align-items-center flex-wrap'>
                        {data?.steps.map((step)=> (
                            <StepComponent step={step} key={step.id} />
                        ))}
                    </div>


        </div>
        
    </div>
    </div>
  )
}

export function StepComponent(param:{step:Step}){
    const {step} = param;
    return (
    <div className='m-2 col-3'>
            <div className='ms-2 bg-secondary px-2 py-1 rounded text-light ' style={{"maxWidth":"fit-content"}}>{step.order}</div>
            <div className='rounded p-3 border card' >
                
            <h6 className='text-secondary '>{step.title}</h6>

            </div>
    </div>);
  
  }
export default CollaborationPage
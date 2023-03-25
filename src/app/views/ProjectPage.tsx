import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
import io from 'socket.io-client';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { AuthState } from '../../features/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAddTaskMutation, useAssignSubTaskMutation, useDeleteMutation, useFetchDateTaskQuery, useFetchDayTasksQuery, useFetchMonthTasksQuery, useFetchProjectTasksQuery, useFetchTasksQuery, useGetSubTasksMutation, useMarkAsFinishedMutation } from '../../features/task/task';
import { MainUiState, setActifCalendarComponent, setMainActiveTab, showWelcomeModal, triggerRefetch } from '../../features/mainUi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowLeft, faArrowRight, faCalendar, faCalendarDays, faChampagneGlasses, faCheck, faFlag, faGreaterThan, faInfoCircle, faList, faSearch, faTable, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FullTask, Task } from '../models/Task';
import CustomImage from '../components/Image';
import {GrSteps} from 'react-icons/gr';
import Logo from './../../assets/logo.png'
import { backend_server, days, hours, monthNumberDays, months, randomColor } from '../constantes/constantes';
import { Form, useParams } from 'react-router-dom';
import TaskSkeleton from '../components/skeletons/TasksSkeletons';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';
import { SubTask } from '../models/SubTask';
import {BsTrophy} from 'react-icons/bs';
import { useFetchObjectifsMutation, useSetObjectifMutation } from '../../features/objectif/objectif';
import { LineComponent, TaskComponent } from './Home';
import NotificationAlert from '../components/Notification';


function ProjectPage() {
  
  const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
  const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  const [key, setKey] = useState('home');
  const dispatch = useAppDispatch()

  return (
    <div className='bg-light' style={{"minHeight":"100vh"}}>
        <NotificationAlert />

        <SideBar active="project" isOpened={false} /> 
         <Header />
        <div  className={` ${mainUi.margin_left} `}>
          <div className='d-flex flex-row bg-white border-bottom'>
              <h5 className='col-auto px-3 py-2 text-secondary mt-1'>Tout</h5>
          <ul className="list-unstyled d-flex flex-row col-10 align-self-center">
            <li className={(mainUi.mainActiveTab == "tableau") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" } 
            onClick={()=>{
              dispatch(setMainActiveTab("tableau"));
            }} >
              <FontAwesomeIcon icon={faTable} /> Tableau </li>
         
           

          
              </ul>
          </div>

        <TableauComponent /> 
      

        </div>
        
    </div>
  )
}




function TableauComponent(){
  const keyword = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.refetchKeyword);

  const {id} = useParams();
  const {data,isFetching,refetch} = useFetchProjectTasksQuery({id:parseInt(id!)});

  const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  
  return (
   <div>
    <h1></h1>
     { !isFetching && ( <div className={`d-flex flex-row  p-4 `}>
     <div className='col-3 mx-3'>
        <div className="card rounded bg-white mb-4">
          <LineComponent  color={"bg-secondary"} />
          <p className='m-1 text-secondary p-2'> À FAIRE  <span className='rounded-circle card d-inline px-1 mx-1'> {data?.todo.length } </span> </p>
        </div>
        <div className='rounded' style={{"maxHeight":"63vh","overflowY":"auto"}}>
          {!isFetching  && data?.todo.map((todo:FullTask) =>(<TaskComponent  key={todo.id} task={todo} color='text-warning' />))}
        </div>
     </div>
     <div className='col-3 mx-3'>
     <div className="card rounded bg-white mb-4">
          <LineComponent  color={"bg-success"} />
          <p className='m-1 text-secondary p-2'> TERMINÉ  <span className='rounded-circle card d-inline px-1 mx-1'> {data?.finished.length } </span> </p>
        </div>
        <div className='rounded' style={{"maxHeight":"70vh","overflowY":"auto"}}>
          {!isFetching  && data?.finished.map((todo) =>(<TaskComponent  key={todo.id} task={todo} color='text-success' />))}
        </div>
    </div>
    
    <div className='col-3 mx-3'>
    <div className="card rounded bg-white mb-4">
          <LineComponent  color={"bg-danger"} />
          <p className='m-1 text-secondary p-2'> EN RETARD  <span className='rounded-circle card d-inline px-1 mx-1'> {data?.late.length } </span> </p>
        </div>
        <div className='rounded' style={{"maxHeight":"70vh","overflowY":"auto"}}>
          {!isFetching  && data?.late.map((todo) =>(<TaskComponent  key={todo.id} task={todo} color='text-danger'  />))}
        </div>

    </div>
    </div>)}
    {isFetching && (<div className={``}>
        <TaskSkeleton />
    </div>)}
    
    </div>
  
  )
}


export default ProjectPage
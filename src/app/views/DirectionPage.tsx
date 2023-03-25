import React, { useState } from 'react'
import NotificationAlert from '../components/Notification'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MainUiState, setMainActiveTab } from '../../features/mainUi'
import { useFetchDepartementTasksQuery, useFetchDepartementTasksStatusQuery, useFetchDirectionTasksStatusQuery, useFetchProjectTasksQuery, useFetchTasksPerPersonnesQuery, useFetchTasksPerProjetcsQuery, useFetchTasksQuery } from '../../features/task/task'
import { LineComponent, TaskComponent } from './Home'
import TaskSkeleton from '../components/skeletons/TasksSkeletons'
import { AuthState } from '../../features/auth/auth-slice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsProgress, faPeopleGroup, faProjectDiagram, faTable } from '@fortawesome/free-solid-svg-icons'
import { FullTask } from '../models/Task'

function DirectionPage() {
    const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
    const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
    const [key, setKey] = useState('home');
    const dispatch = useAppDispatch()
    const [activeTab,SetActiveTab] = useState('status')
  return (
    <div    className='bg-light' style={{"minHeight":"100vh"}}>
         <NotificationAlert />
        <SideBar active="département" isOpened={false} /> 
         <Header />
        <div  className={` ${mainUi.margin_left} `}>
          <div className='d-flex flex-row bg-white border-bottom'>
              <h5 className='col-auto px-3 py-2 text-secondary mt-1'>Tout</h5>
          <ul className="list-unstyled d-flex flex-row col-10 align-self-center">
            <li className={(activeTab == "status") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" } 
            onClick={()=>{
              SetActiveTab("status");
            }} >
              <FontAwesomeIcon icon={faBarsProgress} /> Status </li>
              <li className={(activeTab == "projets") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" } 
            onClick={()=>{
                SetActiveTab("projets");
            }} >
              <FontAwesomeIcon icon={faProjectDiagram} /> Projets </li>
              <li className={(activeTab == "departements") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" } 
            onClick={()=>{
                SetActiveTab("departements");
            }} >
              <FontAwesomeIcon icon={faPeopleGroup} /> Départements </li>
           

          
              </ul>
          </div>

    {activeTab == "status" && (<TableauComponent />) }    
    {activeTab == "projets" && (<ProjectComponent />)} 
    {activeTab == "departements" && (<DepartementComponent />)} 

      

        </div>
    </div>
  )
}
function ProjectComponent(){
    const keyword = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.refetchKeyword);
    
    const {data,isFetching,refetch} = useFetchTasksPerProjetcsQuery({keyword});

    return(<div>
        <div className='d-flex flex-row mt-3 flex-wrap'>

        {data != undefined &&
            Object.entries(data?.data!).map((e)=> (
            
                
        <div className='col-3 mx-3'>
          <div className="card rounded bg-white mb-4">
            <LineComponent  color={"bg-primary"} />
            <p className='m-1 text-secondary p-2'> {e[0]} <span className='rounded-circle card d-inline px-1 mx-1'> {e[1].length } </span> </p>
          </div>
          <div className='rounded' style={{"maxHeight":"63vh","overflowY":"auto"}}>
            {!isFetching  && e[1].map((todo:FullTask) =>(<TaskComponent  key={todo.id} task={todo} color='text-warning' />))}
          </div>
       </div>
            ))
        }
        </div>

    </div>)



}
function DepartementComponent(){
    const keyword = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.refetchKeyword);
    
    const {data,isFetching,refetch} = useFetchDepartementTasksQuery({keyword});

    return(<div>
        <div className='d-flex flex-row mt-3 flex-wrap'>

        {data != undefined &&
            Object.entries(data?.data!).map((e)=> (
            
                
        <div className='col-3 mx-3'>
          <div className="card rounded bg-white mb-4">
            <LineComponent  color={"bg-primary"} />
            <p className='m-1 text-secondary p-2'> {e[0]} <span className='rounded-circle card d-inline px-1 mx-1'> {e[1].length } </span> </p>
          </div>
          <div className='rounded' style={{"maxHeight":"63vh","overflowY":"auto"}}>
            {!isFetching  && e[1].map((todo:FullTask) =>(<TaskComponent  key={todo.id} task={todo} color='text-warning' />))}
          </div>
       </div>
            ))
        }
        </div>

    </div>)



}
function TableauComponent(){
    const keyword = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.refetchKeyword);
  
    const {data,isFetching,refetch} = useFetchDirectionTasksStatusQuery({keyword});
  
    const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
    
    return (
     <div>
      
       { !isFetching && ( <div className={`d-flex flex-row  p-4 `}>
       <div className='col-3 mx-3'>
          <div className="card rounded bg-white mb-4">
            <LineComponent  color={"bg-secondary"} />
            <p className='m-1 text-secondary p-2'> À FAIRE  <span className='rounded-circle card d-inline px-1 mx-1'> {data?.todo.length } </span> </p>
          </div>
          <div className='rounded' style={{"maxHeight":"63vh","overflowY":"auto"}}>
            {!isFetching  && data?.todo.map((todo) =>(<TaskComponent  key={todo.id} task={todo} color='text-warning' />))}
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

export default DirectionPage
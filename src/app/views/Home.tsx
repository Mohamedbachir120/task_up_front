import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
import io from 'socket.io-client';
import { Button } from 'react-bootstrap';
import { AuthState } from '../../features/auth/auth-slice';
import { useAppSelector } from '../hooks';
import { useFetchTasksQuery } from '../../features/task/task';
import { MainUiState } from '../../features/mainUi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FullTask } from '../models/Task';
import CustomImage from '../components/Image';
import { randomColor } from '../constantes/constantes';

const socket = io("http://localhost:3000");

function Home() {
  
  const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
  // useEffect(() => {
  //   socket.on("receiveNotificationToUser"+authState.id.toString(),(obj)=>{
  //     console.log(obj)
  //     alert(obj.message)
  //   })
    
  // }, []);
  return (
    <div className='bg-light' style={{"minHeight":"100vh"}}>
      
        <SideBar active="home" /> 
         <Header />
        <AddTask  />
        <TasksComponent />
        
    </div>
  )
}
function TasksComponent(){
  const keyword = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.refetchKeyword);

  const {data,isFetching,refetch} = useFetchTasksQuery({keyword});

  const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  
  return (
  <div className={`d-flex flex-row ${mainUi.margin_left} p-4 `}>
     <div className='col-3 mx-3'>
        <div className="card rounded bg-white mb-4">
          <LineComponent  color={"bg-secondary"} />
          <p className='m-1 text-secondary p-2'> À FAIRE  <span className='rounded-circle card d-inline px-1 mx-1'> {data?.todo.length } </span> </p>
        </div>
        <div className='rounded' style={{"maxHeight":"70vh","overflowY":"auto"}}>
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
  
  </div>)
}
const TaskComponent = (param:{task:FullTask,color:string}) => {
      const {task,color} = param;
     return (
     <div className='task-card card p-2 my-2'>

     <div className=' d-flex flex-row align-items-center justify-content-between'>
      <div>

    <span className='text-secondary fs-6'> {task.project.name}</span>
    <p className='text-dark fs-6'> {task.title}</p>
    <span className={`${color} fs-6`}> {task.end_date}</span>
  
    </div>
    <div className=''>
      {task.users.map((user) =>
      (<div key={user.id} title={user.name}> <CustomImage  data={{classes:"my-1 rounded-circle",color:"ffffff",background:randomColor(user.id),height:"4.5vh",label:user.name.split(" ")[0].charAt(0)+user.name.split(" ")[1].charAt(0)}} key={user.id}/> </div>))}
    </div>
    </div>
    <div className=' d-flex flex-row justify-content-end hidden_task' >
      <button className='btn rounded-circle shadow-sm mx-1 success-btn py-3 ' title='Valider'>
        <FontAwesomeIcon icon={faCheck}  size='xs' />
         </button> 
      <button className='btn rounded-circle shadow-sm mx-1 erase-btn' title="supprimer">
        <FontAwesomeIcon icon={faTrash} size='xs' />
      </button>  
      </div>
    </div>
);

}
function LineComponent(color:{color:string}){
  return(<div className={ `${color.color} rounded`}  style={{"maxHeight":"0.3vh"}}> <br /> </div>);  

}

export default Home
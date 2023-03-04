import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
import io from 'socket.io-client';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { AuthState } from '../../features/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAddTaskMutation, useAssignSubTaskMutation, useDeleteMutation, useFetchDateTaskQuery, useFetchDayTasksQuery, useFetchTasksQuery, useMarkAsFinishedMutation } from '../../features/task/task';
import { MainUiState, setMainActiveTab, triggerRefetch } from '../../features/mainUi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowLeft, faCalendar, faCheck, faGreaterThan, faInfoCircle, faList, faSearch, faTable, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FullTask } from '../models/Task';
import CustomImage from '../components/Image';
import {GrSteps} from 'react-icons/gr';

import { backend_server, randomColor } from '../constantes/constantes';
import { Form } from 'react-router-dom';
import TaskSkeleton from '../components/skeletons/TasksSkeletons';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';

// const socket = io("http://localhost:3000");

function Home() {
  
  const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
  const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  const [key, setKey] = useState('home');

  const dispatch = useAppDispatch()
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
        <div  className={` ${mainUi.margin_left} `}>
          <div className='d-flex flex-row bg-white border-bottom'>
              <h5 className='col-auto px-3 py-2 text-secondary mt-1'>Tout</h5>
          <ul className="list-unstyled d-flex flex-row col-10 align-self-center">
            <li className={(mainUi.mainActiveTab == "tableau") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" } 
            onClick={()=>{
              dispatch(setMainActiveTab("tableau"));
            }} >
              <FontAwesomeIcon icon={faTable} /> Tableau </li>
            <li className={(mainUi.mainActiveTab == "liste") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" }  
              onClick={()=>{
                dispatch(setMainActiveTab("liste"));
              }}>
              <FontAwesomeIcon icon={faList} /> Liste </li>
            <li className={(mainUi.mainActiveTab == "calendrier") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" }   onClick={()=>{
              dispatch(setMainActiveTab("calendrier"));
            }} >
              <FontAwesomeIcon icon={faCalendar} /> Calendrier </li>

          
              </ul>
          </div>

        { mainUi.mainActiveTab == "tableau" ? <TableauComponent /> :
          mainUi.mainActiveTab == "calendrier" ? <CalendrierComponent /> : 
        <ListComponent />}

        </div>
        
    </div>
  )
}
function CalendrierComponent(){
  const [today,setToday] = useState({date:new Date()});
  function addDay(date:Date) {
    const newDate = date
    newDate.setDate(newDate.getDate() + 1)
    return newDate 
  }
  function subDay(date:Date) {
    const newDate = date
    newDate.setDate(newDate.getDate() - 1)
    return newDate 
  }
  function compare_hour(date:string, hour:number):boolean{
      const hourString = hour.toString().length == 1 ? "0"+hour.toString() : hour.toString()
      return date.split(' ')[1].split(':')[0] == hourString
  }

  const [keyword,setKeyword] = useState("")
  const {data,isFetching} = useFetchDayTasksQuery({date:today.date.toISOString().split('T')[0]});
  const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
  const  searchPerDate = useFetchDateTaskQuery({keyword:keyword})
  return (<div>
    <div className='d-flex flex-row bg-white p-2 ms-2'>
      <div className='col-3'>

    <InputGroup className='col-3'>
          <InputGroup.Text className='bg-white text-secondary'>

          <FontAwesomeIcon icon={faSearch}  />

          </InputGroup.Text>
          
      <FormControl className='border-start-0' type='text' placeholder='Tapez pour rechercher  ...' 
          
          onChange={(e) => {
              setKeyword(e.target.value);
              const date = new Date(searchPerDate.data?.date!)
              setToday({...today,date:date})
          }}
      
      /> 
    </InputGroup>
      </div>
      <div className='align-self-center ms-2 col-auto'>
        Aujourd'hui
      </div>
      <button className='btn col-auto text-secondary ms-1' onClick={()=>{
          setToday({...today,date:subDay(today.date)});
         
      }}>
          <FontAwesomeIcon icon={faLessThan}  size='xs'/>
      </button>
      <button className='btn col-auto text-secondary' onClick={()=>{
          setToday({...today,date:addDay(today.date)});

      }}>
          <FontAwesomeIcon icon={faGreaterThan} size='xs' />
      </button>
      <div className='align-self-center'>
        {days[today.date.getDay()] } { today.date.getDate()} { months[today.date.getMonth()] } 
      </div>
    </div>
    <div className='d-flex flex-row bg-white '>
      <div className='col-1 border border-start-0 p-3 text-center'>
        Toute la journée
      </div>
      <div className='col-11 border'>

      </div>
    </div>
    {
      hours.map((h)=> (<div className='d-flex flex-row  bg-white' key={h}>

      <div className='col-1  p-3 text-center align-self-start'>
        { h.toString().length == 1 ? "0"+h.toString() : h.toString() }
      </div>
      <div className='col-11 border'>
          { !isFetching  &&  data?.tasks?.filter((e)=> compare_hour(e.end_date,h)).map((e)=>{
            const classAt = e.status == "TERMINÉ" ? "bg-success " : e.status == "EN RETARD" ? "bg-danger " : ""; 
           
           return (
            <div key={e.id} className={`border-bottom p-1 d-flex flex-row justify-content-between  ${classAt}}`}>
              <div className={e.status != 'À FAIRE' ? 'text-light' : ''}> {e.title}</div>
              <div className={e.status != 'À FAIRE' ? 'text-light' : ''}>{e.end_date}</div>
               </div>)})
          }
      </div>
      </div>))
    }
  </div>)
}
function ListComponent(){
  return (<div>
    <h1>Liste  component</h1>
</div>)
}


function TableauComponent(){
  const keyword = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.refetchKeyword);
  // const fetchFile = useFetchReportQuery({date:keyword});

  const {data,isFetching,refetch} = useFetchTasksQuery({keyword});

  const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  
  return (
   <div>
    
     { !isFetching && ( <div className={`d-flex flex-row  p-4 `}>
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
    </div>)}
    {isFetching && (<div className={``}>
        <TaskSkeleton />
    </div>)}
    
    </div>
  
  )
}
const TaskComponent = (param:{task:FullTask,color:string}) => {
      const [componentState,setComponentState] = useState('editing');
      const {task,color} = param;
      const [showSubTask,setShowSubTask] = useState("d-none")
      const [addingSubtask,SetAddingSubtask] = useState(false)
      const [taskTitle,setTaskTitle] = useState("")
      const [successState,setSuccessState] = useState({state:false,message:"Sous-tâches ajoutés avec succès"})
      const dispatch  = useAppDispatch();
      const [assignSubTask,{isLoading}] = useAssignSubTaskMutation();
      const [deleteTask] = useDeleteMutation();
      const [markAsFinished] = useMarkAsFinishedMutation();

      const [deleteModal,showDeleteModal] = useState(false);

      function displaySuccess(){
      setSuccessState({...successState,state:true});
        setTimeout(() => {
          setSuccessState({...successState,state:false});
          dispatch(triggerRefetch((Math.random() * 100).toString()));

       }, 1500);
      }

     return ( <div>
{componentState == "finished" && (
<div className='card bg-success rounded my-2 py-2'>
  <FontAwesomeIcon icon={faCheck} color='white'  size='2x'/>
  <h5 className='text-center text-white mt-2'>Félécitation tâche terminé </h5>
</div>)}
{componentState == "deleted" && (
<div className='card bg-danger rounded my-2 py-2'>
  <FontAwesomeIcon icon={faTrash} color='white'  size='2x'/>
  <h5 className='text-center text-white mt-2'>cette tâche  a été supprimé </h5>
</div>)}
{componentState == "editing" && ( <div className='task-card card pt-2 my-2 px-0'>

     <div className=' d-flex flex-row align-items-center justify-content-between mx-2'>
      <div>

    <span className='text-secondary fs-6'> {task.project.name}</span>
    <div>

    <span className='text-dark fs-6'> {task.title}</span>
    </div>
    <button className='btn sub_task_btn ' title='Sous tâches' onClick={()=>{
      if(showSubTask == ""){
        setShowSubTask("d-none");

      }else{

        setShowSubTask("");
      }
    }}>
    <GrSteps  title='sous-tâches' /> 
    </button>

      { task.sub_tasks?.length > 0 && (
    <ul >
      {
        task.sub_tasks.map((sub)=> 
        (<li key={sub.id} className={`${showSubTask}`}> {sub.title}</li>))
      }
    </ul>)
      }
    <div>

    <span className={`${color} fs-6`}> {task.end_date}</span>
    </div>
  
    </div>
    <div className=''>
      {task.users.map((user) =>
      (<div key={user.id} title={user.name}> <CustomImage  data={{classes:"my-1 rounded-circle",color:"ffffff",background:randomColor(user.id),height:"4.5vh",label:user.name.split(" ")[0].charAt(0)+user.name.split(" ")[1].charAt(0)}} key={user.id}/> </div>))}
    </div>
    </div>
    {task.status != "TERMINÉ" &&(<div className="d-flex flex-row hidden_task align-items-center ps-1">
        <div className='col-8 d-flex flex-row'>
          <button className='btn btn-light my-2' onClick={()=>{
            SetAddingSubtask(!addingSubtask);
          }}>
            <FontAwesomeIcon icon={faAdd} className='m-1' />Ajouter sous-tâche
          </button>
        </div>
    <div className=' d-flex flex-row justify-content-end col-4 ' >
      <button className='btn rounded-circle shadow-sm mx-1 success-btn  ' title='Valider' onClick={async ()=>{
        try {
           const response = await markAsFinished({id:task.id});
           setComponentState('finished') 
           setTimeout(() => {
            setComponentState('editing') 
            dispatch(triggerRefetch((Math.random() * 100).toString()));
  
         }, 1500);

        } catch (error) {
          console.log(error);
        }
      }}>
        <FontAwesomeIcon icon={faCheck}  size='xs' />
         </button> 
      <button className='btn rounded-circle shadow-sm mx-1 erase-btn' title="supprimer" onClick={()=>{
            showDeleteModal(true)
      }}>
        <FontAwesomeIcon icon={faTrash} size='xs' />
      </button>  
      </div>
    </div>)}
  { addingSubtask && successState.state == false && ( <div className='card d-flex flex-row p-2'>
     <div className='col-10'>
    <FormControl className='' type='text' placeholder='sous-tâche' value={taskTitle} 
              onChange={e => setTaskTitle(e.target.value)}
              /> 
         {taskTitle.trim().length <= 2 && (<label className='text-daner m-1 text-danger'>Écrivez quelques choses</label>) }   
      </div>         
      <div className='col-2 px-2'>
        <button className="btn  btn-light rounded-circle" disabled={taskTitle.trim().length <= 2} onClick={async () => {
          try {
            const response = await assignSubTask({title:taskTitle,id:task.id}); 

            setTaskTitle("");
            displaySuccess();

          } catch (error) {
            console.log(error);
          }
        }}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
    </div>)}
    {
     addingSubtask && successState.state && (  <div className='bg-success text-light p-2 rounded mt-2'>
        <FontAwesomeIcon icon={faInfoCircle} className='mt-1' /> Sous-tâche  ajoutée avec succès </div>)
    }
 
    </div>)}

    <Modal show={deleteModal} onHide={()=>{showDeleteModal(false)}}>
        <Modal.Header closeButton >
          <Modal.Title className='text-danger'>Suppression d'une tâche </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <div className=" my-2 py-3" style={{"maxHeight":"30vh","overflowY":"auto","overflowX":"auto"}}>
            <h5 className='text-center'>La suppression d'une tâche est irréversible  . Voulez vous continuer ? <br />
             </h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button className='btn-light' onClick={()=>{
           showDeleteModal(false)
          }}>
            Annuler
          </Button>
          <Button className='main-btn' onClick={async ()=>{
              try {
    
                showDeleteModal(false)
                
                const response = await deleteTask({id:task.id});
                setComponentState('deleted') 
                setTimeout(() => {
                 setComponentState('editing') 
                 dispatch(triggerRefetch((Math.random() * 100).toString()));
       
              }, 1500);
     
             } catch (error) {
               console.log(error);
             }

          }}>
            Valider
          </Button>
        </Modal.Footer>
      </Modal>
    </div> )
    
}
function LineComponent(color:{color:string}){
  return(<div className={ `${color.color} rounded`}  style={{"maxHeight":"0.3vh"}}> <br /> </div>);  

}

export default Home
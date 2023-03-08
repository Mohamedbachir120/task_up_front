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

// const socket = io("http://localhost:3000");

function ProjectPage() {
  
  const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
  const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  const [key, setKey] = useState('home');
  const dispatch = useAppDispatch()
  useEffect(() => {
    // socket.on("receiveNotificationToUser"+authState.id.toString(),(obj)=>{
    //   console.log(obj)
    //   alert(obj.message)
    // })
   
   
    
  }, []);
  return (
    <div className='bg-light' style={{"minHeight":"100vh"}}>
      
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
      const [sub_tasks,setSubTask] = useState<SubTask[]>([])
      const [deleteModal,showDeleteModal] = useState(false);
      const [getSubtasks] = useGetSubTasksMutation()
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

    <span className='text-secondary fs-6'>
       {task.project.name}</span>
    <div>

      <FontAwesomeIcon icon={faFlag}  className={
         task.priority == 1 ? "text-danger" : 
         task.priority == 2 ? "text-orange" :
         task.priority == 3 ? "text-yellow" :
         "text-info"}  title='priorité' /> &nbsp;
    <span className='text-dark fs-6'> {task.title}</span>
    </div>
    <button className='btn sub_task_btn ' title='Sous tâches' onClick={ async ()=>{
      if(showSubTask == ""){
        setShowSubTask("d-none");


      }else{
        try {
          if(sub_tasks.length == 0){

            const {subTasks} = await getSubtasks({id:task.id}).unwrap();
            setSubTask(subTasks);
          }
        } catch (error) {
          
        }

        setShowSubTask("");
      }
    }}>
    <GrSteps  title='sous-tâches' /> 
    </button>

      { sub_tasks?.length > 0 && (
    <ul >
      {
        sub_tasks.map((sub)=> 
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

export default ProjectPage
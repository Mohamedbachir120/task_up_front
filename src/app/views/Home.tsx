import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
import io from 'socket.io-client';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { AuthState } from '../../features/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAddTaskMutation, useAssignSubTaskMutation, useDeleteMutation, useFetchDateTaskQuery, useFetchDayTasksQuery, useFetchMonthTasksQuery, useFetchTasksQuery, useGetSubTasksMutation, useMarkAsFinishedMutation } from '../../features/task/task';
import { MainUiState, setActifCalendarComponent, setMainActiveTab, showWelcomeModal, triggerRefetch } from '../../features/mainUi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowLeft, faArrowRight, faCalendar, faCalendarDays, faChampagneGlasses, faCheck, faFlag, faGreaterThan, faInfoCircle, faList, faSearch, faTable, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FullTask, Task } from '../models/Task';
import CustomImage from '../components/Image';
import {GrSteps} from 'react-icons/gr';
import Logo from './../../assets/logo.png'
import { backend_server, days, hours, monthNumberDays, months, randomColor } from '../constantes/constantes';
import { Form } from 'react-router-dom';
import TaskSkeleton from '../components/skeletons/TasksSkeletons';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';
import { SubTask } from '../models/SubTask';
import {BsTrophy} from 'react-icons/bs';
import { useFetchObjectifsMutation, useSetObjectifMutation } from '../../features/objectif/objectif';

// const socket = io("http://localhost:3000");

function Home() {
  
  const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
  const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
  const [key, setKey] = useState('home');
  const [fetchObjectifs] = useFetchObjectifsMutation();
  const dispatch = useAppDispatch()
  useEffect(() => {
    // socket.on("receiveNotificationToUser"+authState.id.toString(),(obj)=>{
    //   console.log(obj)
    //   alert(obj.message)
    // })
    async function fetchObj(){

      const {objectifs} = await fetchObjectifs({}).unwrap()

      if(objectifs.length  == 0){
        dispatch(showWelcomeModal(true))
      }
    }
    fetchObj();
   
    
  }, []);
  return (
    <div className='bg-light' style={{"minHeight":"100vh"}}>
      
        <SideBar active="home" isOpened={false} /> 
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
         
            <li className={(mainUi.mainActiveTab == "calendrier") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" }   onClick={()=>{
              dispatch(setMainActiveTab("calendrier"));
            }} >
              <FontAwesomeIcon icon={faCalendar} /> Calendrier </li>

          
              </ul>
          </div>

        { mainUi.mainActiveTab == "tableau" ? <TableauComponent /> :
          mainUi.mainActiveTab == "calendrier" ? <CalendrierComponent /> : 
        <></>}

        {<WelcomComponent />}
        </div>
        
    </div>
  )
}
function WelcomComponent(){
  const welcomeModal = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.welcomeModal)
  const dispatch = useAppDispatch()
  const [screen,SetScreen] = useState("welcome")
  const [Mensuel,setMensuel] = useState(10)
  const [Annuel,setAnnuel] = useState(100)
  const [setObjectif]  = useSetObjectifMutation()
  const [fetchObjectifs] = useFetchObjectifsMutation();

  return (
    <Modal show={welcomeModal} onHide={()=>{dispatch(showWelcomeModal(false))}}
    centered>
      
        <Modal.Body>
        { screen == "welcome" && (<div className=" my-2 py-3" >
            <div className='d-flex flex-row justify-content-center'>

              <img src={Logo} height={200} />
            </div>
            <h4 className='text-center px-3 typewriter'>
              Bienvenue à TaskUp Votre parcours de  <br />
             </h4>
             <h4 className='text-center px-3 typewriter'>
              productivité commence ici
             </h4>
            
             <div className='d-flex flex-row justify-content-center '>

             <Button className='main-btn col-3 my-3 mt-5' onClick={async ()=>{
              SetScreen("objectifs")
             }}>
            Suivant <FontAwesomeIcon icon={faArrowRight} />
          </Button>
             </div>
          </div>)

        }
         {screen == "objectifs" && (
         <div>
          <h3  className='text-center text-light'><BsTrophy    
          className=' p-3 rounded'
          style={{ 
            "background":"#7b68ee",
            "minHeight":"5vw",
            "minWidth":"5vw",
            "maxWidth":"5vw",
            "maxHeight":"5vw"}} /> </h3>
          <h3 className='text-center mb-4'>Fixer vos objectifs</h3>
            <div className='d-flex flex-column align-items-center'>
              <label htmlFor="" className='fw-bold'>Mensuel </label>
              <div>

              10  <input type='range' min={10} max={100} className='my-1' defaultValue={10} onChange={(e)=>{
              setMensuel(parseInt(e.target.value));
          }} /> 100
              </div>
          <br />
           <label htmlFor="" className='fw-bold'>Annuel </label> 
           <div>

              100  <input type='range' min={100} max={1000} className='my-1' defaultValue={10} onChange={(e)=>{
              setAnnuel(parseInt(e.target.value));
          }} /> 1000
           </div>
           <Button className='main-btn col-3 my-3' onClick={async ()=>{
              dispatch(showWelcomeModal(false))
              const {message,success} = await setObjectif({
                yearly:Annuel,
                monthly:Mensuel
              }).unwrap();
             const {objectifs} = await fetchObjectifs({}).unwrap()

              window.location.replace('/objectifs')  

             }}>
          <FontAwesomeIcon icon={faCheck} />  Valider 
          </Button>
            </div>
            
         </div>) }
          
        </Modal.Body>
       
      </Modal>
  )

}
function CalendrierDayComponent(){
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

  const  searchPerDate = useFetchDateTaskQuery({keyword:keyword})
  const dispatch = useAppDispatch()
  return (<div>
    <div className='d-flex flex-row bg-white p-2 '>
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
      <button className='btn btn-light ms-5' onClick={()=>{
        dispatch(setActifCalendarComponent('month'))
      }}>
        <FontAwesomeIcon icon={faCalendarDays} /> Vue Mensuel
      </button>
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
function CalendrierComponent(){
  const actif = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi.actifCalendarComponent)
  return (
    <div>
      {actif == 'day' &&  (<CalendrierDayComponent />)}
      {actif == 'month' &&  (<CalendrierMonthComponent />)}

    </div>
  );
}

function CalendrierMonthComponent(){
  const [keyword,setKeyword] = useState('')
  const dispatch = useAppDispatch()
  const [today,setToday] = useState({date:new Date()});
  const [count,setCount] = useState(0)
  const firstDay = today.date.getDay() -  (today.date.getDate() % 7) + 1  
  const  searchPerDate = useFetchDateTaskQuery({keyword:keyword})
  const {data,isLoading} = useFetchMonthTasksQuery({date:today.date.toISOString().split('T')[0]})
  return ( 
    <div className=''>
    <div className='d-flex flex-row bg-white p-2 '>
  

  
  <div className='align-self-center ms-3 fw-bold'>
     { months[today.date.getMonth()] } 
  </div>
  
  <div>

  <input type="date" className='form-control col-2 ms-3' onChange={(e)=>{
      setToday({date:new Date(e.target.value) })
  }} />
  </div>
  <button className='btn btn-light ms-5' onClick={()=>{
    dispatch(setActifCalendarComponent('day'))
  }}>
    <FontAwesomeIcon icon={faCalendarDays} /> Vue Jours 
  </button>
</div>
<div className='d-flex flex-row '>
  {days.map((day)=>
  <div key={day} className='col p-2  bg-white border-end border-top'> {day}</div>)}
</div>
<div className='d-flex flex-row'>
  {days.map((day,index)=>{
     
    if(index >= firstDay){
   
       return  (<div key={day} className='col p-2 day_calendar bg-white border-end  text-end'>
          {data?.tasks.filter((task)=> {
            const curren_day = task.end_date.split(' ')[0].split('-')[2]
           return parseInt(curren_day) == index - firstDay + 1
          }).map((task)=>{
            
            return (<TaskMonthComponent task={task} />)
          })}
         {index - firstDay + 1}</div>)
     }else{
      return  (<div key={day} className='col p-2 day_calendar bg-white '> </div>)

     }
  
  })}
</div>
<div className='d-flex flex-row'>
  {days.map((day,index)=>{
     
   
   
       return  (<div key={day} className='col p-2 day_calendar bg-white border-end text-end'>
           {data?.tasks.filter((task)=> {
            const curren_day = task.end_date.split(' ')[0].split('-')[2]
            console.log(curren_day, (index - firstDay +1))

           return parseInt(curren_day) == index+ (7 - firstDay) + 1
          }).map((task)=>{
            
            return (<TaskMonthComponent task={task} />)
          })}
        
         {index+ (7 - firstDay) + 1}</div>)
   
  })}
</div>
<div className='d-flex flex-row'>
  {days.map((day,index)=>{
     
   
   
       return  (<div key={day} className='col p-2 day_calendar bg-white border-end text-end'>
           {data?.tasks.filter((task)=> {
            const curren_day = task.end_date.split(' ')[0].split('-')[2]
           return parseInt(curren_day) == index+ (14 - firstDay) + 1
          }).map((task)=>{
            
            return (<TaskMonthComponent task={task} />)
          })}
        
         {index+ (14 - firstDay) + 1}</div>)
   
  })}
</div>
<div className='d-flex flex-row'>
  {days.map((day,index)=>{
     
   
   
       return  (<div key={day} className='col p-2 day_calendar bg-white border-end text-end'>
           {data?.tasks.filter((task)=> {
            const curren_day = task.end_date.split(' ')[0].split('-')[2]
           return parseInt(curren_day) == index+ (21 - firstDay) + 1
          }).map((task)=>{
            
            return (<TaskMonthComponent task={task} />)
          })}
         {index+ (21 - firstDay) + 1}</div>)
   
  })}
</div>
<div className='d-flex flex-row'>
  {days.map((day,index)=>{
      const numberDay =  monthNumberDays.get(months[today.date.getMonth()]) 
    
      if(index+ (28 - firstDay) + 1 <= numberDay!) {

        return  (<div key={day} className='col p-2 day_calendar bg-white border-end text-end'>
             {data?.tasks.filter((task)=> {
            const curren_day = task.end_date.split(' ')[0].split('-')[2]
           return parseInt(curren_day) == index+ (28 - firstDay) + 1
          }).map((task)=>{
            
            return (<TaskMonthComponent task={task} />)
          })}
          
           {index+ (28 - firstDay) + 1}</div>)
      }else {
      return  (<div key={day} className='col p-2  bg-white '> </div>)

      }
   
  })}
</div>
<div className='d-flex flex-row'>
  {days.map((day,index)=>{
      const numberDay =  monthNumberDays.get(months[today.date.getMonth()]) 
    
      if(index+ (35 - firstDay) + 1 <= numberDay!) {

        return  (<div key={day} className='col p-2 day_calendar bg-white border-end text-end'>
             {data?.tasks.filter((task)=> {
            const curren_day = task.end_date.split(' ')[0].split('-')[2]
           return parseInt(curren_day) == index+ (35 - firstDay) + 1
          }).map((task)=>{
            
            return (<TaskMonthComponent task={task} />)
          })}
          
           {index+ (35 - firstDay) + 1}</div>)
      }else {
      return  (<div key={day} className='col p-2  bg-white '> </div>)

      }
   
  })}
</div>

</div>

)

}

function TaskMonthComponent(param:{task:Task}){
  const {task} = param
  const bg = task.status == "EN RETARD" ? "bg-danger text-light" : task.status == "À FAIRE" ?  "bg-white": "bg-success text-light"
  return (<div className={`text-start p-1 m-1 card ${bg}`} title={task.title}>
    { task.title.length > 20 &&
    task.title.substring(0,20)}
     { task.title.length <= 20 &&
    task.title}
  </div>)
}
function TableauComponent(){
  const keyword = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi.refetchKeyword);

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

export default Home
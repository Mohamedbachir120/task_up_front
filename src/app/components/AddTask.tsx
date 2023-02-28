import { faAdd, faCalendar, faEraser, faPlus, faSearch, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup, Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import {MdOutlinePersonAddAlt} from "react-icons/md"
import  {BsTrash,BsBarChartSteps} from "react-icons/bs"
import { SubTask } from '../models/SubTask'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AddTaskUiState, add, addUser, change, hideDependanceModal, hideTaskModal, remove, resetToInitial, setDependanceTask, setEndDate, showDependanceModal, showTaskModal, testFunc, unSelectUser } from '../../features/task/addTaskUi'
import { Task } from '../models/Task'
import { User } from '../models/User'
import CustomImage from './Image'
import { randomColor } from '../constantes/constantes'
import { useFetchDepartementProjectsQuery } from '../../features/projects/project'
import { Project } from '../models/Project'
import { useAddTaskMutation, useFetchInitialDataQuery } from '../../features/task/task'
import { AuthState } from '../../features/auth/auth-slice'
import Loader from './Loader'
import { initialize } from '../../features/mainUi'

function AddTask() {
  const [keyword,setKeyword] = useState("")
  const {data,isFetching,refetch} = useFetchInitialDataQuery({keyword});
  const [taskInfos,setTaskInfos] = useState<{title:string,description:string,selectedProject:number|undefined}>({title:"",description:"",selectedProject:0})
  const [searchUser,setSearchUser] = useState("")
  const [searchTask,setSearchTask] = useState("")

  const [errors,setErrors] = useState({title:"Le nom d'une tâche doit être remplis",echeance:"Vous devez spécifier une échéance à votre tâche"});

  const uiState = useAppSelector((state:{addTaskUi:AddTaskUiState})=>state.addTaskUi)
  const authState = useAppSelector((state:{auth:AuthState})=>state.auth)

  const [addTask,{isLoading}] = useAddTaskMutation();
  const dispatch =useAppDispatch()

  const [screen,setScreen] = useState("create")

  return (
    <div>
      { uiState.showTaskModal && screen == "create"  &&
      (<div className='add_task_modal shadow-lg card p-3'  >
          <div className="d-flex flex-flex-row algin-items-center mb-3 justify-content-between">
            <div className='pt-1 col-1'>   

            <div className='bg-secondary d mt-2' style={{"borderRadius":"2px","minHeight":"2vh","maxWidth":"2vh","maxHeight":"2vh","minWidth":"2vh"}}>

            </div>
            </div>
            <div className='col-10'>
            <InputGroup >   
               <FormControl className='border-0' type='text' placeholder='Task name' onChange={(e)=>{
                  if(e.target.value.trim().length < 1){
                      setErrors({...errors,title:"Le nom d'une tâche doit être remplis"})
                  }else{
  
                      setErrors({...errors,title:""})

                  }
                  setTaskInfos({...taskInfos,title: e.target.value});
               }} /> 
            </InputGroup>
              <label className='text-danger my-1'> {errors.title}</label>
            </div>
            <div className='col-1'>
              <Button className='btn btn-light' onClick={(e)=>{
                dispatch(hideTaskModal());
            }}><FontAwesomeIcon icon={faXmark}  /> </Button>
            </div>
          </div>
          <div className="d-flex flex-flex-row algin-items-center ">
          <div className='d-flex flex-row alig-items-center'>
           <div className=' text-secondary   align-self-center'>
            Dans
            </div> 

            <Form.Select className='align-self-center mx-2' style={{"borderRadius":"15px"}} onChange={(e)=>{
                setTaskInfos({...taskInfos,selectedProject:parseInt(e.target.selectedOptions[0].value)})
            }}>
              { isFetching &&  (<option defaultChecked={true}>Sélectionner votre projet</option>) }
                { 
                !isFetching && data?.projects.map((project:Project)=>{
                 return  (<option value={project.id} key={project.id}> {project.name}</option>)
                })

                }
            </Form.Select>
            <span className='text-secondary  mx-2 align-self-center'>
              Pour
            </span> 
             
            </div>
              <OverlayTrigger
            trigger={"click"}
            key={"top"}
            placement={"bottom"}
            transition={true}
            overlay={
            <Popover className={`popover-positioned`} style={{"minWidth":"25vw"}}>
              <Popover.Body>
                
              <InputGroup >
                <InputGroup.Text className='bg-white '>
                <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='text' placeholder='Rechercher..'  onChange={(e)=>{
                  
                  setSearchUser(e.target.value);
                  
                }}/> 
            </InputGroup>
            {
              data?.users.filter((user)=>{
                return user.name.includes(searchUser); 
              }).map((user)=> {
               const ele =  uiState.selectedUsers.find((u:User)=> u.id == user.id);

              return   (<UserComponent user={user}  selected={ele!= undefined} key={user.id} /> )
              
              })
              
            }
              </Popover.Body>
            </Popover>
          }
        >
          <Button className='btn-light shadow rounded-circle fs-4 text-secondary border mx-3' title='Assigner'>
              <MdOutlinePersonAddAlt />
              </Button>
        </OverlayTrigger>
            {
              uiState.selectedUsers.map((user)=> (<div className='align-self-center' title={user.name} key={user.id}>
                <CustomImage data={{classes:"rounded-circle",color:"ffffff",background:randomColor(user.id),height:"6vh",label:user.name.split(" ")[0].charAt(0)+user.name.split(" ")[1].charAt(0)}}  />
              </div>)) 
            }

          </div>
          <div className='mt-2'>

            <textarea className='form-control'  placeholder='Descripion (Facultatif)' rows={6} onChange={(e)=>{
                setTaskInfos({...taskInfos,description:e.target.value});
                console.log()
            }}></textarea>
          </div>
          <p className='btn search text-start text-dark' onClick={()=>{
              dispatch(add());
          }}><FontAwesomeIcon icon={faPlus} /> Ajouter une sous-tâche </p>
          {uiState.subTasks.length > 0  && (<p>Sous-tâches</p>)}
          <div style={{"maxHeight":"10vh","overflowY":"auto","overflowX":"hidden"}}> 

          {
            uiState.subTasks.map((e,index)=> (<SubTaskComponent key={index} k={index}  subTask={e}  />))
          }

          </div>
          <div className='d-flex flex-row justify-content-between my-3'>
            <div className="d-flex flex-row">

            <button className='btn btn-light text-secondary fs-5 rounded-circle shadow border mx-2' onClick={()=>{
              dispatch(showDependanceModal())
            }} title='Dépendances'>
              <BsBarChartSteps />
            </button>
          
            <OverlayTrigger
            trigger={"click"}
            key={"echeance"}
            placement={"top"}
            transition={true}
            overlay={
            <Popover className={`popover-positioned`} style={{"minWidth":"25vw"}}>
              <Popover.Header as="h3">Échéance</Popover.Header>
              <Popover.Body>
                <h6>Sélectionner l'échéance de cette tâche</h6>
              <input
              className='form-control'
              id="end_date"
              type="datetime-local"
              name="partydate"
              value={uiState.end_date}
              onChange={(e)=>{
                dispatch(setEndDate(e.target.value));
                setErrors({...errors,echeance:""});
              }}
               />
              </Popover.Body>
            </Popover>
          }
        >
          <div className='text-danger'>

         <button className='btn btn-light text-secondary fs-5 rounded-circle shadow border'  title='Échéance'>
              <FontAwesomeIcon icon={faCalendar} />
           
            </button>
          </div>
        </OverlayTrigger>
            </div>
          <button className='btn main-btn text-light' onClick={async () =>{ 
              
              
              if(taskInfos.title.trim().length == 0){
                  setErrors({...errors,title:"Le nom d'une tâche doit être remplis"})
              }else if(uiState.end_date == undefined){
                setErrors({...errors,echeance:"Vous devez spécifier une échéance à votre tâche"})
              }else{

                setScreen("loading");
                try {
                  const  {success,message}   = await addTask({
                    users: uiState.selectedUsers.length > 0 ?  uiState.selectedUsers.map((user) => user.id) : [authState.id],
                    sub_tasks: uiState.subTasks.map((task) => task.title),
                    title: taskInfos.title,
                    description: taskInfos.description,
                    dependance_id: uiState.dependanceTask?.id,
                    project_id:  taskInfos.selectedProject == 0 ? data?.projects[0].id : taskInfos.selectedProject,
                    end_date: uiState.end_date
                  }).unwrap();

                  setTaskInfos({...taskInfos,title:"",description:"",selectedProject:0})
                  
                  setScreen("created");
                  refetch();
                } catch (error) {
                  setScreen("error");
                  
                }
                setTimeout(()=>{
                  dispatch(resetToInitial());

                  setScreen("create");
                  setErrors({title:"Le nom d'une tâche doit être remplis",echeance:"Vous devez spécifier une échéance à votre tâche"});

                },1000);
              }
              


          }}>
            Créer une tâche
          </button>
          </div>
        {uiState.end_date.length < 2 && errors.echeance.length > 0 && (<label className='text-danger'>{errors.echeance}</label>)}  
        { uiState.end_date.length > 2 && (<label className='text-secondary my-1'>
         <span className='fw-bold'> 
         <BsBarChartSteps /> Échéance : &nbsp; </span> 
          {uiState.end_date.replace("T"," ")}</label>)}  

         {uiState.dependanceTask != undefined && (<label className='text-secondary my-1'>
      <span className='fw-bold'> 
      <FontAwesomeIcon icon={faCalendar} /> Tâche dépendante : &nbsp;  </span>    
           {uiState.dependanceTask?.title }</label>) } 


      </div>)
      }
        { uiState.showTaskModal && screen == "created"  &&
      (<div className='add_task_modal shadow-lg card p-3 py-5'  >
         <div className='d-flex flex-row justify-content-center'>

          <h1 className='bg-success text-light p-4 rounded-circle'>
            <FontAwesomeIcon icon={faThumbsUp}  size='2x'/>
          </h1>

         </div>
        <h1 className='text-center text-success'> Tâche créé avec succès</h1>

      </div>) 
      }
        { uiState.showTaskModal && screen == "loading"  &&
      (<div className='add_task_modal shadow-lg card p-3 py-5'  >
         <div className='d-flex flex-row justify-content-center'>

           <Loader /> 


         </div>
        <h5 className='text-center text-secondary'> Envoi en cours ... </h5>

      </div>) 
      }
       { uiState.showTaskModal && screen == "error"  &&
      (<div className='add_task_modal shadow-lg card p-3 py-5'  >
         <div className='d-flex flex-row justify-content-center'>

          <h1 className='bg-danger text-light p-4 rounded-circle'>
            <FontAwesomeIcon icon={faXmark}  size='lg'/>
          </h1>

         </div>
        <h2 className='text-center text-danger'> Opération échouée </h2>

      </div>) 
      }
    <button className='btn text-light main-btn add_task' onClick={(e)=>{
        dispatch(showTaskModal());
      }}>
      <FontAwesomeIcon icon={faAdd}  /> Tâche
    </button>
    
    <Modal show={uiState.showDependanceModal} onHide={()=>{dispatch(hideDependanceModal())}}>
        <Modal.Header closeButton >
          <Modal.Title>Ajouter une tâche dépendante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-row">
          <InputGroup>
                <InputGroup.Text className='bg-white text-secondary'>

                <FontAwesomeIcon icon={faSearch}  />

                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='text' placeholder='Tapez pour rechercher  ...' 
                
                onChange={(e) => {
                  setSearchTask(e.target.value);
                }}
            
            /> 
            </InputGroup>
          </div>
          <div className=" my-2 py-3" style={{"maxHeight":"30vh","overflowY":"auto","overflowX":"auto"}}>
              {
               !isFetching &&  data?.tasks.filter((task)=>{
                return task.title.includes(searchTask);
               }).map((task:Task) =>(
                  <div className= { task.status == "À FAIRE" ? "py-2 px-3 pending_task" : "py-2 px-3 outdated_task"  } key={task.id} >
                  <div className="form-check  ">
                <input className="form-check-input" type="radio" name='dependance' value={task.id} key={task.id} defaultChecked={uiState.dependanceTask?.id == task.id} 
                onChange={(e)=>{
                  if(e.target.checked){
                    dispatch(setDependanceTask(task));
                  }
                }}
                />
                <label className="form-check-label text-secondary" >
                  {task.title}
                </label>
              </div>
              </div>
                )) 
              }
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button className='btn-light' onClick={()=>{
            dispatch(setDependanceTask(undefined));
            dispatch(hideDependanceModal())
          }}>
            Annuler
          </Button>
          <Button className='main-btn' onClick={()=>{
            dispatch(hideDependanceModal())
          }}>
            Valider
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  )
}
export function UserComponent({user,selected}:{user:User,selected:boolean}){
  const dispatch = useAppDispatch();
  
return (
<div className='d-flex flex-row  align-items-center my-1' 
  style={{"cursor":"pointer"}}
  onClick={
  ()  =>  {
  if(selected == true) dispatch(unSelectUser(user.id));
  else dispatch(addUser(user));
  }
}
  >
  <div className='align-self-center col-2' >

  <CustomImage data={{classes:"rounded-circle ",color:"ffffff",background:randomColor(user.id),height:"5vh",label:user.name.split(" ")[0].charAt(0)+user.name.split(" ")[1].charAt(0)}}  />
  </div>
  <p className='align-self-center m-2 fs-6 col-6'>{user.name}</p>
  {
    selected && (<button className='btn '>
         <BsTrash color='violet' onClick={()=>{

      }}  />
    </button>)
  }
</div>)
}
export function SubTaskComponent(param:{subTask:SubTask,k:number}){
    const dispatch = useAppDispatch();
    return (
      <div className="d-flex flex-row align-item-center my-1" key={param.k}>
        <div className='col-10 align-self-center'>
        <FormControl  defaultValue={param.subTask.title} onChange={(e)=>{
                dispatch(change({index:param.k,value:e.target.value}))

                
        }} />

        </div>
        <div className='col-2 align-self-center mx-3 fs-4'>
          <BsTrash color='violet' onClick={()=>{

                dispatch(remove(param.k));
          }}  />

        </div>


      </div>
      )
}

export default AddTask
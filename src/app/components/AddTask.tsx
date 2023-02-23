import { faAdd, faCalendar, faEraser, faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup, Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import {MdOutlinePersonAddAlt} from "react-icons/md"
import  {BsTrash,BsBarChartSteps} from "react-icons/bs"
import { SubTask } from '../models/SubTask'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AddTaskUiState, add, addUser, change, hideDependanceModal, hideTaskModal, remove, setDependanceTask, setEndDate, showDependanceModal, showTaskModal, unSelectUser } from '../../features/task/addTaskUi'
import { Task } from '../models/Task'
import { User } from '../models/User'
import CustomImage from './Image'
import { randomColor } from '../constantes/constantes'
import { useFetchDepartementProjectsQuery } from '../../features/projects/project'
import { Project } from '../models/Project'

function AddTask() {
  const [keyword,setKeyword] = useState("")
  const {data,isFetching} = useFetchDepartementProjectsQuery({keyword});

  const uiState = useAppSelector((state:{addTaskUi:AddTaskUiState})=>state.addTaskUi)
  const dispatch =useAppDispatch()
  const allTasks = [new Task(1,"task1"),new Task(2,"task2","EN RETARD"),new Task(3,"task3","TERMINÉ")]
  const users:User[] = [new User(1,"mohamed hadj"),new User(2,"meriem sahrane")]  

  return (
    <div>
      { uiState.showTaskModal && 
      (<div className='add_task_modal shadow-lg card p-3'  >
          <div className="d-flex flex-flex-row algin-items-center mb-3 justify-content-between">
            <div className='pt-1 col-1'>   

            <div className='bg-secondary d mt-2' style={{"borderRadius":"2px","minHeight":"2vh","maxWidth":"2vh","maxHeight":"2vh","minWidth":"2vh"}}>

            </div>
            </div>
            <div className='col-10'>
            <InputGroup >   
               <FormControl className='border-0' type='text' placeholder='Task name'  /> 
            </InputGroup>

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

            <Form.Select className='align-self-center mx-2' style={{"borderRadius":"15px"}}>
              { isFetching &&  (<option defaultChecked={true}>Sélectionner votre projet</option>) }
                { 
                !isFetching && data?.data.map((project:Project)=>{
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
                
            <FormControl className='border-start-0' type='text' placeholder='Rechercher..' /> 
            </InputGroup>
            {
              users.map((user)=> {
               const ele =  uiState.selectedUsers.find((u)=> u.id == user.id);

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
                <CustomImage data={{classes:"rounded-circle",color:"ffffff",background:randomColor(),height:"6vh",label:user.name.split(" ")[0].charAt(0)+user.name.split(" ")[1].charAt(0)}}  />
              </div>)) 
            }

          </div>
          <div className='mt-2'>

            <textarea className='form-control'  placeholder='Descripion (Facultatif)' rows={6}></textarea>
          </div>
          <p className='btn search text-start text-dark' onClick={()=>{
              dispatch(add());
          }}><FontAwesomeIcon icon={faPlus} /> Ajouter une sous-tâche </p>
          {uiState.subTasks.length > 0  && (<p>Sous-tâches</p>)}
          <div style={{"maxHeight":"20vh","overflowY":"auto","overflowX":"hidden"}}> 

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
              }}
               />
              </Popover.Body>
            </Popover>
          }
        >
         <button className='btn btn-light text-secondary fs-5 rounded-circle shadow border'  title='Échéance'>
              <FontAwesomeIcon icon={faCalendar} />
           
            </button>
        </OverlayTrigger>
            </div>
          <button className='btn main-btn text-light'>
            Créer une tâche
          </button>
          </div>

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
                
                onChange={(e) => {}}
            
            /> 
            </InputGroup>
          </div>
          <div className=" my-2 py-3" style={{"maxHeight":"30vh","overflowY":"auto","overflowX":"auto"}}>
              {
                allTasks.map((task:Task) =>(
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
        
          <Button className='main-btn' onClick={()=>{

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
return (<div className='d-flex flex-row  align-items-center my-1' onClick={()=>{
  if(selected == true) dispatch(unSelectUser(user.id));
  else dispatch(addUser(user));
}}>
  <div className='align-self-center col-2' >

  <CustomImage data={{classes:"rounded-circle ",color:"ffffff",background:randomColor(),height:"5vh",label:user.name.split(" ")[0].charAt(0)+user.name.split(" ")[1].charAt(0)}}  />
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
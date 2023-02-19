import { faAdd, faCalendar, faEraser, faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup, Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import {MdOutlinePersonAddAlt} from "react-icons/md"
import  {BsTrash,BsBarChartSteps} from "react-icons/bs"
import { SubTask } from '../models/SubTask'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AddTaskUiState, add, change, hideDependanceModal, hideTaskModal, remove, setEndDate, showDependanceModal, showTaskModal } from '../features/task/addTaskUi'
import { Task } from '../models/Task'
import { key } from 'localforage'

function AddTask() {
  
  const uiState = useAppSelector((state:{addTaskUi:AddTaskUiState})=>state.addTaskUi)
  const dispatch =useAppDispatch()

  const allTasks = [new Task(1,"task1"),new Task(2,"task2","EN RETARD"),new Task(3,"task3","TERMINÉ")]
  

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
           <div className='text-secondary   align-self-center'>
            Dans
            </div> 
            <Form.Select className='align-self-center mx-2'>
                 <option defaultChecked={true}>Sélectionner votre projet</option>

            </Form.Select>
            <span className='text-secondary  mx-2 align-self-center'>
              Pour
            </span> 
              <Button className='btn-light shadow rounded-circle fs-4 text-secondary border mx-3' title='Assigner'>
              <MdOutlinePersonAddAlt />
              </Button>


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
            key={"top"}
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
                  <div className= { task.status == "À FAIRE" ? "py-2 px-3 pending_task" : "py-2 px-3 outdated_task"  } >
                  <div className="form-check  ">
                <input className="form-check-input" type="checkbox" value={task.id} key={task.id} />
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
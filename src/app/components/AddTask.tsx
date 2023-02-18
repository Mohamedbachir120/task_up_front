import { faAdd, faEraser, faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import {MdOutlinePersonAddAlt} from "react-icons/md"
import  {BsTrash} from "react-icons/bs"
import { SubTask } from '../models/SubTask'

function AddTask() {
  const [showModal,setShowModal] = useState(false)
  const [subTasks,setSubTask] = useState<SubTask[]>([])
  function remove(index:number){
    console.log(index)
    setSubTask(subTasks => subTasks.filter((e,i) =>  index != i))
  }
  return (
    <div>
      { showModal && 
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
                setShowModal(false);
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
              setSubTask(subTasks => [...subTasks,new SubTask("   ")])
          }}><FontAwesomeIcon icon={faPlus} /> Ajouter une sous-tâche </p>
          {subTasks.length > 0  && (<p>Sous-tâches</p>)}
          <div style={{"maxHeight":"25vh","overflowY":"auto","overflowX":"hidden"}}> 

          {
            subTasks.map((e,index)=> (<SubTaskComponent key={index} k={index}  subTask={e}  remove={remove} />))
          }

          </div>

      </div>)
      }
    <button className='btn text-light main-btn add_task' onClick={(e)=>{
        setShowModal(true);
      }}>
      <FontAwesomeIcon icon={faAdd}  /> Tâche</button>
    </div>
  )
}
export function SubTaskComponent(param:{subTask:SubTask,k:number,remove:any}){
    return (
      <div className="d-flex flex-row align-item-center my-1" key={param.k}>
        <div className='col-10 align-self-center'>
        <FormControl  defaultValue={param.subTask.title}  />

        </div>
        <div className='col-2 align-self-center mx-3 fs-4'>
          <BsTrash color='violet' onClick={()=>{
                param.remove(param.k);
          }}  />

        </div>


      </div>
      )
}

export default AddTask
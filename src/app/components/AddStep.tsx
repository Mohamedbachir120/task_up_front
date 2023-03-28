import { faAdd, faCalendar, faEraser, faPlus, faSearch, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup, Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import {MdOutlinePersonAddAlt} from "react-icons/md"
import  {BsTrash,BsBarChartSteps} from "react-icons/bs"
import { SubTask } from '../models/SubTask'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AddTaskUiState, add, addUser, change, hideDependanceModal, hideTaskModal, remove, resetToInitial, setDependanceTask, setEndDate, showDependanceModal, showTaskModal, unSelectUser } from '../../features/task/addTaskUi'
import { Task } from '../models/Task'
import CustomImage from './Image'
import { randomColor } from '../constantes/constantes'
import { Project } from '../models/Project'
import { useAddTaskMutation, useFetchInitialDataQuery } from '../../features/task/task'
import { AuthState } from '../../features/auth/auth-slice'
import Loader from './Loader'
import { MainUiState, initialize, triggerRefetch } from '../../features/mainUi'
import { User } from '../models/User'
import { useAddStepMutation, useFetchInitialDataStepQuery } from '../../features/collaboration/collaboration'
import { useParams } from 'react-router-dom'
import { Departement } from '../models/Departement'
import { Step } from '../models/Step'

function AddStep() {
  const keyword = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi.refetchInitialAddTask)
  const [taskInfos,setTaskInfos] = useState<{title:string,description:string,selectedDep:number}>({title:"",description:"",selectedDep:0})
  const [searchTask,setSearchTask] = useState("")
  const [priority,setPriority] = useState(4)
  
  const [dependanceStep,setDependencyStep] = useState<number|undefined>(undefined)
  
  const [errors,setErrors] = useState({title:"Le nom  doit être remplis",echeance:"Vous devez spécifier une échéance à votre étape"});
  const {id} = useParams();
  const uiState = useAppSelector((state:{addTaskUi:AddTaskUiState})=>state.addTaskUi)
  const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
  const {data,isFetching,refetch} = useFetchInitialDataStepQuery({id:parseInt(id!)});

  const [addStep] = useAddStepMutation();

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
                      setErrors({...errors,title:"Le nom  doit être remplis"})
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
                setTaskInfos({...taskInfos,selectedDep:parseInt(e.target.selectedOptions[0].value)})
            }}>
              { isFetching &&  (<option defaultChecked={true}>Sélectionner département</option>) }
                { 
                !isFetching && data?.departements.map((dep:Departement)=>{
                 return  (<option value={dep.id} key={dep.id}> {dep.name}</option>)
                })

                }
            </Form.Select>
           
             
            </div>
              
            {
              uiState.selectedUsers.map((user)=> (<div className='align-self-center' title={user.name} key={user.id}>
                <CustomImage data={{classes:"rounded-circle",color:"ffffff",background:randomColor(user.id),height:"6vh",label:user.name.split(" ")[0].charAt(0)+user.name.split(" ")[1].charAt(0)}}  />
              </div>)) 
            }

          </div>
         
          <div className='mt-2'>

            <textarea className='form-control'  placeholder='Descripion (Facultatif)' rows={4} onChange={(e)=>{
                setTaskInfos({...taskInfos,description:e.target.value});
                console.log()
            }}></textarea>
          </div>
          
          <div className='d-flex flex-row justify-content-between my-2'>
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
            rootClose
            overlay={
            <Popover className={`popover-positioned`} style={{"minWidth":"25vw"}}>
              <Popover.Header as="h3">Échéance</Popover.Header>
              <Popover.Body>
                <h6>Sélectionner l'échéance de cette étape</h6>
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
                  setErrors({...errors,title:"Le nom  doit être remplis"})
              }else if(uiState.end_date == undefined){
                setErrors({...errors,echeance:"Vous devez spécifier une échéance à votre étape"})
              }else{

                setScreen("loading");
                try {
                  console.log(taskInfos.title,taskInfos.description,dependanceStep,taskInfos.selectedDep,uiState.end_date,id);
                  const  {success,message}   = await addStep({
                    title: taskInfos.title,
                    description: taskInfos.description,
                    dependance: dependanceStep,
                    departement:  taskInfos.selectedDep == 0 ? data?.departements[0].id : taskInfos.selectedDep!,
                    due_date: uiState.end_date,
                    collaboration: parseInt(id!)

                  }).unwrap();



                  setTaskInfos({...taskInfos,title:"",description:"",selectedDep:0})
                  
                  setScreen("created");
                  refetch();
                  dispatch(triggerRefetch( (Math.random() *4).toString() ));
                } catch (error) {
                  setScreen("error");
                  
                }
                setTimeout(()=>{
                  dispatch(resetToInitial());

                  setScreen("create");
                  setErrors({title:"Le nom  doit être remplis",echeance:"Vous devez spécifier une échéance à votre étape"});

                },1000);
              }
              


          }}>
            Créer une Étape
          </button>
          </div>
        {uiState.end_date.length < 2 && errors.echeance.length > 0 && (<label className='text-danger'>{errors.echeance}</label>)}  
        { uiState.end_date.length > 2 && (<label className='text-secondary my-1'>
         <span className='fw-bold'> 
         <BsBarChartSteps /> Échéance : &nbsp; </span> 
          {uiState.end_date.replace("T"," ")}</label>)}  

         {uiState.dependanceTask != undefined && (<label className='text-secondary my-1'>
      <span className='fw-bold'> 
      <FontAwesomeIcon icon={faCalendar} /> Étape dépendante : &nbsp;  </span>    
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
        <h1 className='text-center text-success'> Étape créé avec succès</h1>

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
      <FontAwesomeIcon icon={faAdd}  /> ÉTAPE
    </button>
    
    <Modal show={uiState.showDependanceModal} onHide={()=>{dispatch(hideDependanceModal())}}>
        <Modal.Header closeButton >
          <Modal.Title>Ajouter une étape dépendante</Modal.Title>
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
               !isFetching &&  data?.steps.filter((step)=>{
                return step.title.includes(searchTask);
               }).map((step:Step) =>(
                  <div className= { step.status == "À FAIRE" ? "py-2 px-3 pending_task" : "py-2 px-3 outdated_task"  } key={step.id} >
                  <div className="form-check  ">
                <input className="form-check-input" type="radio" name='dependance' value={step.id} key={step.id} defaultChecked={dependanceStep == step.id} 
                onChange={(e)=>{
                  if(e.target.checked){
                    setDependencyStep(step.id)
                  }
                }}
                />
                <label className="form-check-label text-secondary" >
                  {step.title}
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



export default AddStep
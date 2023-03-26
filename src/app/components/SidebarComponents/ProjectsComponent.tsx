import { useState } from "react";
import { useFetchDepartementProjectsMutation, useFetchStructureDepartementsQuery, useStoreProjectMutation } from "../../../features/projects/project";
import { Project } from "../../models/Project";
import { AuthState } from "../../../features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faGreaterThan, faParagraph, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineDown } from "react-icons/ai";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import { ProjectComponent } from "./ProjectComponent";
import Loader from "../Loader";
import { Departement } from "../../models/Departement";
import { setRefetchInitialAddTask } from "../../../features/mainUi";

export function ProjectsComponent(){
    const [showProject,setShowProject] = useState(false)
    const [projectModal,showProjectModal] = useState(false);
    const [keyword,setKeyword] = useState("");
    const [name,setName] = useState("")
    const [projects,setProjects] = useState<Project[]>([])
    const [getDepartementProject] = useFetchDepartementProjectsMutation()
    const [storeProject] = useStoreProjectMutation()
    const [screen,setScreen] = useState('intial');
    const [departement,setDepartement] = useState(1)
    const auth = useAppSelector((state:{auth:AuthState}) => state.auth);
    const {data,isLoading} = auth.role == "Directeur" ? 
    useFetchStructureDepartementsQuery({}) : {
      data:undefined,
      isLoading:true } ;
   const {id} = useParams();
   const dispatch = useAppDispatch();
   const[isFixed,setIsFixed] = useState(0)
    return (
    <div className='border-start-0 border-end-0 border mt-3 '>
    <div className='  side-bar-section d-flex flex-row justify-content-between px-2  py-2'
    onClick={async (e)=>{
      setShowProject(!showProject);
      try {
         const {data} = await getDepartementProject({keyword:""}).unwrap();
         setProjects(data); 
      } catch (error) {
        
      }
    }}>
        <span>PROJETS</span>
        <span>
        {!showProject &&   (<FontAwesomeIcon color='#999999' size={"sm"}  icon={faGreaterThan}/>)}
         {showProject &&  (<AiOutlineDown /> )}
          
          
          </span>
  
    </div>
     {showProject && (<div className='my-2'>
  
    <div className='d-flex flex-row'>
    <Button className='btn-grey btn  mx-4 w-100 fs-6 text-secondary ' onClick={()=>{
      showProjectModal(true)
    }}>
         <FontAwesomeIcon icon={faAdd} /> Nouveau projet
    </Button>
  
    </div>
    <div className='ps-3' style={{"maxHeight":"30vh","overflowY":"auto"}}>
  
      {  projects.map((project) =>(<ProjectComponent project={project} key={project.id}  active={parseInt(id ?? "0") == project.id} />))}
    </div>
    </div>)}
    <Modal show={projectModal} onHide={()=>{showProjectModal(false)}}>
          <Modal.Header closeButton >
            <Modal.Title className='text-violet'>Création d'un nouveau projet </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {screen == "loading" && <div className=''>
            <h5 className='text-center'> création en cours veuillez patientez </h5>
            <div className='d-flex flex-row justify-content-center'>
            <Loader />
  
            </div>
            </div>}
          {screen == 'intial' && (<div>
  
            <label> Veuillez choisir un nom </label>
             <InputGroup className='col-3'>
            <InputGroup.Text className='bg-white text-secondary'>
  
            <FontAwesomeIcon icon={faParagraph}  />
  
            </InputGroup.Text>
            
        <FormControl className='border-start-0' type='text' 
         value={name} 
        placeholder='Nom du projet' 
            
            onChange={ (e) => {
              setName(e.target.value);
             
            }}
            /> 
           
      </InputGroup>
      {auth.role == "Directeur" && (
        <div className='my-2'>
        <label> Département</label>
        <select className='form-select' onChange={(e)=>{
           setDepartement(parseInt(e.target.value))
        }}>
            {!isLoading && data?.map((dep:Departement) => (<option value={dep.id} key={dep.id}>
              {dep.name}</option>))}
        </select>
    
        </div>
      )}
      
      <div className='my-2'>
            <div>
            <label htmlFor="" className='my-2'> Le projet posséde t-il des tâches répétitives ?</label>
          
            </div>
            <label htmlFor="" className='mx-3'>Non &nbsp; </label>
            <input type='radio' value={"isFixed"} checked={isFixed == 0} onChange={()=>{
              setIsFixed(0)
            }}  />
            <label htmlFor="" className='mx-3'>Oui </label>
  
            <input type='radio' value={"isFixed"} checked={isFixed == 1} 
            onChange={()=>{
              setIsFixed(1)
            }}
            />
  
            
        </div>
            </div>)}
            {screen == 'success' && (<div>
              <div className='d-flex flex-row justify-content-center'>
  
                <h1 className='bg-success text-light p-4 rounded-circle'>
                  <FontAwesomeIcon icon={faThumbsUp}  size='2x'/>
                </h1>
  
                </div>
                <h1 className='text-center text-success'> Projets créé avec succès</h1>
  
              
              </div>)
              }
          </Modal.Body>
          <Modal.Footer>
          <Button className='btn-light' onClick={()=>{
             showProjectModal(false)
            }}>
              Annuler
            </Button>
            <Button className='main-btn' onClick={async ()=>{
              if(name.trim().length > 0){
  
              
                try {
                    setScreen("loading");
                    const  {success,message} = await 
                     storeProject({name:name,is_fixed:isFixed,departement:
                      auth.role == "Directeur" ? departement : undefined }).unwrap();
                    const {data} = await getDepartementProject({keyword:""}).unwrap();
                    setProjects(data); 
                    setScreen("success");
  
                    dispatch(setRefetchInitialAddTask((Math.random() * 100).toString()))
  
                    setTimeout(() => {
                        setName("")
                        setScreen("intial");
                        setKeyword((Math.random() * 100).toString());
                        showProjectModal(false)
                    }, 1500);
                  
              
       
               } catch (error) {
                 console.log(error);
               }}
  
            }}>
              Valider
            </Button>
          </Modal.Footer>
        </Modal>
  
  
    
    </div>)
  }
  
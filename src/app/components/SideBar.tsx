import React, { useState } from 'react'
import logo from "../../assets/logo.png"
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, faAdd, faArrowDown, faArrowRight, faArrowUp, faCalendar, faDownLong, faDownload, faFilePdf, faGear, faGreaterThan, faHome, faParagraph, faRedo, faSearch, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Form, Link } from 'react-router-dom'
import { VscHome,VscBell, VscGraphLine } from "react-icons/vsc";
import {BsTrophy} from 'react-icons/bs';
import {AiOutlineDown,AiOutlineDoubleLeft} from "react-icons/ai"
import { IconType } from 'react-icons'
import { backend_server, randomColor } from '../constantes/constantes'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MainUiState, hideMarginLeft, initialize, setRapportSideBar, triggerRefetchKeywordDoc } from '../../features/mainUi'
import { useAddTaskMutation, useFetchRapportsMutation, useGenerateReportMutation } from '../../features/task/task'
import Loader from './Loader'
import { Rapport } from '../models/Document'
import { useFetchDepartementProjectsMutation, useStoreProjectMutation } from '../../features/projects/project'
import { Project } from '../models/Project'
import { useDeleteDocumentMutation } from '../../features/task/document'

function SideBar(params:{active:string,isOpened:boolean}) {
  const dispatch = useAppDispatch();
  const uistate = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi);


  if(uistate.margin_left == "margin_left"){ return   (
   
    <div className='side-bar border-end  bg-white'>
      <div className="d-flex flex-row justify-content-between align-items-center m-2">
      <div className='d-flex flex-row align-items-center'>

        <img  src={logo}/> 
        <h5 className='fw-bold'>TaskUp</h5>
      </div>
      <div className="d-flex flex-row justify-content-end">

      <button className='btn text-secondary'>
        <FontAwesomeIcon  icon={faGear} />
      </button> 
      <button className='btn text-violet' onClick={()=>{
       dispatch(hideMarginLeft());
      }}>
      <AiOutlineDoubleLeft />
      </button>
      </div>
      </div>
      <SearchComponent />
      <SideBarItem icon={VscHome} title='Accueil' active={params.active == "home" }  link='/home'/>
      <SideBarItem icon={VscBell} title='Notifications' active={params.active == "notifications" }  link='/notifications'/>
      <ShowMoreComponent active={params.active} isOpened={params.isOpened}  />
      <ProjectsComponent />
      <DocumentsComponent /></div>
  )}
  return (<></>)
}
export function SearchComponent(){
  return (  
  <div className='rounded search  bg-light d-flex flex-row align-items-center border-0 shadow-0 m-3 px-2 py-2'>
  <div className='col-2 '>
    <FontAwesomeIcon size='sm'  icon={faSearch} />

  </div>
  <div className='col-7'>
    Rechercher
  </div>
  <div className='col-3'>
    Ctrl + k
  </div>

</div>);
}
function SideBarItem(params:{title:string,active:boolean,link:string,icon:IconType}){

  return (
    <div className= {params.active ? 'active ps-3 side-bar-item py-1 my-1':"ps-3 side-bar-item py-1 my-1"}>
      <Link  to={params.link}  >
       <params.icon size={18} />  &nbsp; {params.title}
      </Link>
    </div>
  )
}
function ShowMoreComponent(params:{active:string,isOpened:boolean}){
  const [showMore,setShowMore] = useState(params.isOpened)

  return(
    <div>
   { !showMore ?
      <div className= {"ps-3 side-bar-item py-1 my-1"}>
      <Link  to={"#"}  onClick={(e)=>{
        e.preventDefault();
        setShowMore(true);
      }}>
       <FontAwesomeIcon  icon={faArrowDown} />  &nbsp; Afficher plus
      </Link>
      </div>  : (<></>) }
    { showMore ?
     <div>
      <SideBarItem icon={VscGraphLine} title='Performances' active={params.active == "performances" }  link='/performances'/>
      <SideBarItem icon={BsTrophy} title='Objectifs' active={params.active == "objectifs" }  link='/objectifs'/>
      <div className= {"ps-3 side-bar-item py-1 my-1"}>
      <Link  to={"#"}  onClick={(e)=>{
        e.preventDefault();
        setShowMore(false);
      }}>
       <FontAwesomeIcon  icon={faArrowUp} />  &nbsp; Afficher moins
      </Link>
      </div>  
    </div>:(<></>)}</div>
    )
  
}
function ProjectsComponent(){
  const [showProject,setShowProject] = useState(false)
  const [keyword,setKeyword] = useState("");
  const [name,setName] = useState("")
  const [projects,setProjects] = useState<Project[]>([])
  const [getDepartementProject] = useFetchDepartementProjectsMutation()
  const [projectModal,showProjectModal] = useState(false);
  const [storeProject,isLoading] = useStoreProjectMutation()
  const [screen,setScreen] = useState('intial');
 
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

    {  projects.map((project) =>(<ProjectComponent project={project} key={project.id} />))}
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
  
          </div>)}
          {screen == 'success' && (<div>
            <div className='d-flex flex-row justify-content-center'>

              <h1 className='bg-success text-light p-4 rounded-circle'>
                <FontAwesomeIcon icon={faThumbsUp}  size='2x'/>
              </h1>

              </div>
              <h1 className='text-center text-success'> Projets créé avec succès</h1>

            
            </div>)}
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
                  const  {success,message} = await  storeProject({name:name}).unwrap();
                  const {data} = await getDepartementProject({keyword:""}).unwrap();
                  setProjects(data); 
                  setScreen("success");


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
function ProjectComponent(param:{project:Project}){
  const {project} = param; 
  return (
  <div className= {"ps-3 side-bar-item py-1 my-1"}>
  <Link  to={"/project/"+project.id}  >
   <img src={  `https://ui-avatars.com/api/?background=${randomColor(project.id)}&color=ffffff&name=${project.name.charAt(0)}`} />  &nbsp; {project.name}
  </Link>
</div>)
}
function DocumentsComponent(){
  const [date,setDate] = useState({date:new Date()})
  const [showDoc,setshowDoc] = useState(false)
  const [url,setUrl] = useState('');
  const keyword = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi.refetchKeywordDoc)
  const [generateReport,{isLoading}] = useGenerateReportMutation();
  const [documentModal,showDocumentMOdal] = useState(false);
  const dispatch = useAppDispatch()
  const [fetchRapport] = useFetchRapportsMutation();
  const rapports  = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi.rapportSideBar)
  return (
  <div className='border-start-0 border-end-0 border '>
  <div className='  side-bar-section d-flex flex-row justify-content-between px-2  py-2'
  onClick={async (e)=>{
    setshowDoc(!showDoc);
    try {
      const {rapports} = await fetchRapport({keyword:""}).unwrap();
      dispatch(setRapportSideBar(rapports));  
    } catch (error) {
      
    }

  }}>
      <span>DOCUMENTS</span>
      <span>
      {!showDoc &&   (<FontAwesomeIcon color='#999999' size={"sm"}  icon={faGreaterThan}/>)}
       {showDoc &&  (<AiOutlineDown /> )}
        
        
        </span>

  </div>
   {showDoc && (<div className='my-2'>

  <div className='d-flex flex-row'>
  <Button className='btn-grey btn  mx-4 w-100 fs-6 text-secondary ' onClick={()=>{

  showDocumentMOdal(true)
    
  }}>
       <FontAwesomeIcon icon={faAdd} /> Nouveau document
  </Button>

  </div>
  <div className='ps-3' style={{"maxHeight":"30vh","overflowY":"auto"}}>

    { rapports.map((rapport) =>(<DocumentComponent doc={rapport} key={rapport.id} />))}
  </div>
  </div>)}
  <Modal show={documentModal} onHide={()=>{showDocumentMOdal(false)}}>
        <Modal.Header closeButton >
          <Modal.Title className='text-violet'>Génration d'un rapport d'activité </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {isLoading && <div className=''>
          <h5 className='text-center'> génération en cours veuillez patientez </h5>
          <div className='d-flex flex-row justify-content-center'>
          <Loader />

          </div>
          </div>}
        {!isLoading && url == '' && (<div>

          <label> Veuillez choisir une date </label>
           <InputGroup className='col-3'>
          <InputGroup.Text className='bg-white text-secondary'>

          <FontAwesomeIcon icon={faCalendar}  />

          </InputGroup.Text>
          
      <FormControl className='border-start-0' type='date' placeholder='' 
          
          onChange={async (e) => {
            console.log(e.target.value);
            try {
              const {url} = await  generateReport({date:e.target.value}).unwrap();
              const {rapports} = await fetchRapport({keyword:""}).unwrap();
              dispatch(setRapportSideBar(rapports));  
              dispatch(triggerRefetchKeywordDoc((url)))
              setUrl(url);

            } catch (error) {
              
            }
          }}
          /> 
    </InputGroup>
          </div>)}
          {!isLoading && url != '' && (<div>
              <h3 className='text-center my-3'>Rapport généré avec succès</h3>

            <div className='d-flex flex-row justify-content-center mt-5 my-4'>
                <a href={`${backend_server}${url}`} className='btn btn-primary'  target='_blank'>Télécharger &nbsp;
               <FontAwesomeIcon icon={faDownload} /> </a>
              <button className='btn' onClick={()=>{
                setUrl('')
              }}>
              Générer à nouveau  &nbsp; <FontAwesomeIcon icon={faRedo} />
              </button>
            </div></div>)}
        </Modal.Body>
        <Modal.Footer>
        <Button className='btn-light' onClick={()=>{
           showDocumentMOdal(false)
          }}>
            Annuler
          </Button>
          <Button className='main-btn' onClick={async ()=>{
              try {
    
                showDocumentMOdal(false)
                
            
     
             } catch (error) {
               console.log(error);
             }

          }}>
            Valider
          </Button>
        </Modal.Footer>
      </Modal>
  
  </div>)
}
function DocumentComponent(param:{doc:Rapport}){
  const {doc} = param;
  const IMG = doc.name.split(' ')[1].charAt(0)
  const [deleteDocument,{isLoading}] = useDeleteDocumentMutation()
  const dispatch = useAppDispatch()
  const [fetchRapport] = useFetchRapportsMutation();

  return (
    <div className='d-flex flex-row '>

  <div className= {"ps-3 side-bar-item py-1 my-1 align-self-center"}>
  <Link  to={backend_server+doc.url} target='_blank' >
   <img src={  `https://ui-avatars.com/api/?background=${randomColor(doc.id)}&color=ffffff&name=${IMG}`} />  &nbsp; {doc.name}
  </Link>
    </div>
    <div className='align-self-center' onClick={async ()=>{
      try {
        const {success,message} = await deleteDocument({id:doc.id}).unwrap();

        const {rapports} = await fetchRapport({keyword:""}).unwrap();
        dispatch(setRapportSideBar(rapports));  

      } catch (error) {
        
      }
    }}>
      <button className='btn text-danger'>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
</div>)
}
export default SideBar
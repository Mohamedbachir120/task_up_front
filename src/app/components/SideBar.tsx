import React, { useEffect, useState } from 'react'
import logo from "../../assets/logo.png"
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, faAdd, faArrowDown, faArrowRight, faArrowUp, faBarsProgress, faCalendar, faDownLong, faDownload, faFileAlt, faFilePdf, faGear, faGreaterThan, faHome, faParagraph, faPeopleGroup, faProjectDiagram, faRedo, faSearch, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Form, Link, useParams } from 'react-router-dom'
import { VscHome,VscBell, VscGraphLine } from "react-icons/vsc";
import {BsPeople, BsTrophy} from 'react-icons/bs';
import {AiOutlineDown,AiOutlineDoubleLeft} from "react-icons/ai"
import { IconType } from 'react-icons'
import { backend_server, randomColor } from '../constantes/constantes'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MainUiState, hideMarginLeft, initialize, setRapportSideBar, setRefetchInitialAddTask, showModalSeach, showNotification, triggerRefetchKeywordDoc } from '../../features/mainUi'
import { useAddTaskMutation, useFetchRapportsMutation, useGenerateDepartementReportMutation, useGenerateReportMutation, useSearchQuery } from '../../features/task/task'
import Loader from './Loader'
import { Rapport } from '../models/Document'
import { useFetchDepartementProjectsMutation, useStoreProjectMutation } from '../../features/projects/project'
import { Project } from '../models/Project'
import { useDeleteDocumentMutation } from '../../features/task/document'
import { AuthState } from '../../features/auth/auth-slice'
import { TaskComponent } from '../views/Home'
import CustomImage from './Image'
import { io } from 'socket.io-client'

const socket = io("http://localhost:3000");

function SideBar(params:{active:string,isOpened:boolean}) {
  const dispatch = useAppDispatch();
  const uistate = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi);
  const auth = useAppSelector((state:{auth:AuthState}) => state.auth)
  useEffect(() => {
    socket.on("receiveNotificationToUser"+auth.id.toString(),(obj)=>{
      
      dispatch(showNotification({title:obj.title,body:obj.message}))
    })
  }, []);
  if(uistate.margin_left == "margin_left"){ return   (
   
    <div className='side-bar border-end  bg-white'>
      <div className="d-flex flex-row justify-content-between align-items-center m-2">
      <div className='d-flex flex-row align-items-center'>

        <img  src={logo}/> 
        <h5 className='fw-bold'>TaskUp</h5>
      </div>
      <div className="d-flex flex-row justify-content-end">

      <button className='btn text-secondary' title='settings' onClick={()=>{
        window.location.replace('/settings');
      }}>
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
      {auth. role == "Chef de département" && (<SideBarItem icon={BsPeople} title='Département' active={params.active == "département" }  link='/departement'/>) }
      {auth. role == "Directeur" && (<SideBarItem icon={BsPeople} title='Direction' active={params.active == "direction" }  link='/direction'/>) }

     <SideBarItem icon={VscBell} title='Notifications' active={params.active == "notifications" }  link='/notifications'/>
      
      <ShowMoreComponent active={params.active} isOpened={params.isOpened}  />
      <ProjectsComponent />
      <DocumentsComponent />
        <ModalSearchComponent/> </div>
  )}
  return (<></>)
}
export function ModalSearchComponent(){
  const dispatch = useAppDispatch()
  const [keyword,setKeyword] = useState("")
  const searchModal = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi.modalSearch);
  const [screen,setScreen] = useState('tasks'); 
  const {data,isFetching} = useSearchQuery({keyword:keyword,filter:screen});
  return(  <Modal show={searchModal} onHide={()=>{dispatch(showModalSeach(false))}} size='xl' >
  <Modal.Header closeButton >
    <Modal.Title className='text-violet'> RECHERCHE APPROFONDIE</Modal.Title>
  </Modal.Header>
  <Modal.Body>
 
  <div className='d-flex flex-row bg-white border-bottom'>
          <ul className="list-unstyled d-flex flex-row col-7 align-self-center">
            <li className={(screen == "tasks") ? "col-auto px-3 py-2   bg-white mt-1 active_tab_item" : "col-auto px-3 py-2   bg-white mt-1 tab_item" } 
            onClick={()=>{
              setScreen("tasks");
            }} >
              <FontAwesomeIcon icon={faBarsProgress} /> Tâches </li>
              <li className={(screen == "projets") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" } 
            onClick={()=>{
                setScreen("projets");
            }} >
              <FontAwesomeIcon icon={faProjectDiagram} /> Projets </li>
              <li className={(screen == "personnes") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" } 
            onClick={()=>{
                setScreen("personnes");
            }} >
              <FontAwesomeIcon icon={faPeopleGroup} /> Personnes </li>
           
            <li className={(screen == "documents") ? "col-auto px-3 py-2 border-start  bg-white mt-1 active_tab_item" : "col-auto px-3 py-2 border-start  bg-white mt-1 tab_item" } 
            onClick={()=>{
                setScreen("documents");
            }} >
              <FontAwesomeIcon icon={faFileAlt} /> Documents </li>
           
          
              </ul>
              <div className='col-5'>
    <InputGroup >
                <InputGroup.Text className='bg-white py-3'>
                <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='text' placeholder='Rechercher..'  onChange={(e)=>{
                  
                  setKeyword(e.target.value);
                  
                }}/> 
      </InputGroup>
    </div>
      </div>
  <div className='py-3'>
    {keyword.length == 0  && !isFetching && <div className='my-4'>
      <h5 className='text-center'>Tapez quelques choses ... ! </h5>
      </div>}
    {isFetching && (<div className='d-flex flex-row justify-content-center'>
      <Loader />

    </div>)}
{screen == 'tasks'  &&(<div>
  { data?.tasks.map((task)=>
  (<TaskComponent  color='text-dark' task={task} />))

  }
</div>)}
{screen == 'projets'  &&(<div>
  { data?.projects.map((project)=>
  (<div   key={project.id} className=' my-1 card p-2'>
  <Link  to={"/project/"+project.id}  className='text-decoration-none text-violet' onClick={()=>{
    dispatch(showModalSeach(false))
  }}>
    <CustomImage data={{classes:"rounded",color:"ffffff",background:randomColor(project.id),height:"6vh",label:project.name.charAt(0)}} />
   &nbsp; &nbsp; {project.name}</Link> 
    </div>))

  }
</div>)}
{screen == 'personnes'  &&(<div>
  { data?.users.map((user)=>
  (<div   key={user.id} className=' my-1 card p-2'>
  <Link  to={"#"}  className='text-decoration-none text-violet' >
    <CustomImage data={{classes:"rounded-circle",color:"ffffff",background:randomColor(user.id),height:"6vh",label:user.name.split(" ")[0].charAt(0)+user.name.split(" ")[1].charAt(0)}} />
   &nbsp; &nbsp; {user.name}</Link> 
    </div>))

  }
</div>)}
{screen == 'documents'  &&(<div>
  { data?.rapports.map((rapport)=>
  (<div   key={rapport.id} className=' my-1 card p-2'>
  <Link  to={backend_server+rapport.url}  className='text-decoration-none text-violet' onClick={()=>{
    dispatch(showModalSeach(false))
  }}>
    <CustomImage data={{classes:"rounded",color:"ffffff",background:randomColor(rapport.id),height:"6vh",label:rapport.name.charAt(0)}} />
   &nbsp; &nbsp; {rapport.name}</Link> 
    </div>))

  }
</div>)}

</div>    

  </Modal.Body>
 
</Modal>
)
}
export function SearchComponent(){
  const dispatch = useAppDispatch()
  return (  

  <div className='rounded search  bg-light d-flex flex-row align-items-center border-0 shadow-0 m-3 px-2 py-2'
  onClick={()=>{
    dispatch(showModalSeach(true));
  }}>
  <div className='col-2 '>
    <FontAwesomeIcon size='sm'  icon={faSearch} />

  </div>
  <div className='col-7'>
    Rechercher
  </div>
  <div className='col-3'>
    Ctrl + k
  </div>

</div>

);
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
    <div className='mt-4'>
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
                  console.log(isFixed)
                  const  {success,message} = await  storeProject({name:name,is_fixed:isFixed}).unwrap();
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
function ProjectComponent(param:{project:Project,active:boolean}){
  const {project,active} = param; 
  return (
  <div className= {active ? "active ps-3 side-bar-item py-1 my-1" : "ps-3 side-bar-item py-1 my-1"}>
  <Link  to={"/project/"+project.id}  >
   <img src={  `https://ui-avatars.com/api/?background=${randomColor(project.id)}&color=ffffff&name=${project.name.charAt(0)}`} />  &nbsp; {project.name}
  </Link>
</div>)
}
function DocumentsComponent(){
  const [date,setDate] = useState({date:new Date()})
  const [showDoc,setshowDoc] = useState(false)
  const [url,setUrl] = useState('');
  const auth = useAppSelector((state:{auth:AuthState}) => state.auth)

  const keyword = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi.refetchKeywordDoc)
  const [generateReport,{isLoading}] = useGenerateReportMutation();
  const [generateDepartmentReport] = useGenerateDepartementReportMutation();
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
              if(auth.role == "Chef de département"){

                const {url} = await  generateDepartmentReport({date:e.target.value}).unwrap();
                const {rapports} = await fetchRapport({keyword:""}).unwrap();
                dispatch(setRapportSideBar(rapports));  
                dispatch(triggerRefetchKeywordDoc((url)))
                setUrl(url);
              }else{
                const {url} = await  generateReport({date:e.target.value}).unwrap();
                const {rapports} = await fetchRapport({keyword:""}).unwrap();
                dispatch(setRapportSideBar(rapports));  
                dispatch(triggerRefetchKeywordDoc((url)))
                setUrl(url);
              }

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
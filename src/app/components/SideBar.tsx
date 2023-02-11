import React, { useState } from 'react'
import logo from "../../assets/logo.png"
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, faAdd, faArrowDown, faArrowRight, faArrowUp, faGear, faGreaterThan, faHome, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { VscHome,VscBell, VscGraphLine } from "react-icons/vsc";
import {BsTrophy} from 'react-icons/bs';
import {AiOutlineDown,AiOutlineDoubleLeft} from "react-icons/ai"
import { IconType } from 'react-icons'
import { randomColor } from '../constantes/constantes'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MainUiState, hideMarginLeft, initialize } from '../features/mainUi'

function SideBar(params:{active:string}) {
  const dispatch = useAppDispatch();
  const uistate = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi);


  if(uistate.margin_left == "margin_left"){ return   (
   
    <div className='side-bar shadow bg-white'>
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
      <ShowMoreComponent active={params.active}  />
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
function ShowMoreComponent(params:{active:string}){
  const [showMore,setShowMore] = useState(false)

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
  const projects:string[] = ["m1","p2","s3"]

  return (
  <div className='border-start-0 border-end-0 border mt-3 '>
  <div className='  side-bar-section d-flex flex-row justify-content-between px-2  py-2'
  onClick={(e)=>{
    setShowProject(!showProject);
  }}>
      <span>PROJETS</span>
      <span>
      {!showProject &&   (<FontAwesomeIcon color='#999999' size={"sm"}  icon={faGreaterThan}/>)}
       {showProject &&  (<AiOutlineDown /> )}
        
        
        </span>

  </div>
   {showProject && (<div className='my-2'>

  <div className='d-flex flex-row'>
  <Button className='btn-grey btn  mx-4 w-100 fs-6 text-secondary '>
       <FontAwesomeIcon icon={faAdd} /> Nouveau projet
  </Button>

  </div>
  <div className='ps-3'>

    {projects.length > 0 && projects.map((project) =>(<ProjectComponent name={project} />))}
  </div>
  </div>)}

  
  </div>)
}
function ProjectComponent(param:{name:string}){
  return (
  <div className= {"ps-3 side-bar-item py-1 my-1"}>
  <Link  to={"/project/"+param.name}  >
   <img src={  `https://ui-avatars.com/api/?background=${randomColor()}&color=ffffff&name=${param.name.charAt(0)}`} />  &nbsp; {param.name}
  </Link>
</div>)
}
function DocumentsComponent(){
  const [showDoc,setshowDoc] = useState(false)
  const documents:string[] = ["m1","p2","s3"]

  return (
  <div className='border-start-0 border-end-0 border '>
  <div className='  side-bar-section d-flex flex-row justify-content-between px-2  py-2'
  onClick={(e)=>{
    setshowDoc(!showDoc);
  }}>
      <span>DOCUMENTS</span>
      <span>
      {!showDoc &&   (<FontAwesomeIcon color='#999999' size={"sm"}  icon={faGreaterThan}/>)}
       {showDoc &&  (<AiOutlineDown /> )}
        
        
        </span>

  </div>
   {showDoc && (<div className='my-2'>

  <div className='d-flex flex-row'>
  <Button className='btn-grey btn  mx-4 w-100 fs-6 text-secondary '>
       <FontAwesomeIcon icon={faAdd} /> Nouveau document
  </Button>

  </div>
  <div className='ps-3'>

    {documents.length > 0 && documents.map((document) =>(<DocumentComponent name={document} />))}
  </div>
  </div>)}

  
  </div>)
}
function DocumentComponent(param:{name:string}){
  return (
  <div className= {"ps-3 side-bar-item py-1 my-1"}>
  <Link  to={"/document/"+param.name}  >
   <img src={  `https://ui-avatars.com/api/?background=${randomColor()}&color=ffffff&name=${param.name.charAt(0)}`} />  &nbsp; {param.name}
  </Link>
</div>)
}
export default SideBar
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { MainUiState, showModalSeach } from "../../../features/mainUi";
import { useSearchQuery } from "../../../features/task/task";
import { FormControl, InputGroup, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faFileAlt, faPeopleGroup, faProjectDiagram, faSearch } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader";
import { TaskComponent } from "../../views/Home";
import { Link } from "react-router-dom";
import CustomImage from "../Image";
import { backend_server, randomColor } from "../../constantes/constantes";

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
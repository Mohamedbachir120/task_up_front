import { faAdd, faGreaterThan, faParagraph, faSearch, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormLabel, InputGroup, Modal, Toast, ToastContainer } from "react-bootstrap";
import { AiOutlineDown } from "react-icons/ai";
import Loader from "../Loader";
import { Departement } from "../../models/Departement";
import { baseUrl } from "../../constantes/constantes";
import { Direction } from "../../models/Direction";
import axios from "axios";
import { BsEnvelope, BsPeople } from "react-icons/bs";
import { useAddCollaborationMutation, useFetchCollaborationsMutation } from "../../../features/collaboration/collaboration";
import { CollaborationComponent } from "./CollaborationComponent";
import { useParams } from "react-router-dom";
import { Collaboration } from "../../models/Collaboration";
import { useAppSelector } from "../../hooks";
import { MainUiState } from "../../../features/mainUi";
import { Step } from "../../models/Step";

export function CollaborationsComponent(){
  const [showCollaboration,setShowCollaboration] = useState(false)
  const [screen,setScreen] = useState('intial');
  const [topic,setTopic] = useState('')
  const [keyword,setKeyword] = useState('')
  const [description,setDescription] = useState('')
  const [departements,setDepartements] = useState<Departement[]>([])
  const [error,showError] = useState(false)
  const [CollaborationModal,showCollaborationModal] = useState(false);
  const [getCollaboration] = useFetchCollaborationsMutation();
  const [addCollaboration] = useAddCollaborationMutation();
  const {id} = useParams();
  const rebuild  = useAppSelector((state:{mainUi:MainUiState})=> state.mainUi.refetchInvitations)
  const [collaborations,setCollaborations] = useState<Collaboration[]>([]);
  useEffect(  () => {
    async function fetchData(){
        try {
            await axios.get(baseUrl + "departements").then((response: { data: any[]; })=>{
             setDepartements(response.data.map(
                (e:any) => new Departement(e.id,e.name,new Direction(e.direction.id,e.direction.name))))   
           })    
           const collab = await getCollaboration({}).unwrap(); 
           setCollaborations(collab);

        } catch (error) {
        }
       
    }
    fetchData()
  }, [rebuild]);
  return (
      <div className='border-start-0 border-end-0 border-top-0 border  '>
      <div className='  side-bar-section d-flex flex-row justify-content-between px-2  py-2'
      onClick={async (e)=>{
        setShowCollaboration(!showCollaboration);
      }}>
         <span>COLLABORATIONS</span>
        <span>
        {!showCollaboration &&   (<FontAwesomeIcon color='#999999' size={"sm"}  icon={faGreaterThan}/>)}
        {showCollaboration &&  (<AiOutlineDown /> )}
          
          </span>
        </div>
        {showCollaboration && (
          <div>

        <div className="d-flex flex-row">
          <Button className='btn-grey btn  mx-4 w-100 fs-6 text-secondary my-2' onClick={()=>{
            showCollaborationModal(true)
          }}>
          <FontAwesomeIcon icon={faAdd} /> Nouvelle collaboration
            
          </Button>
        </div>
        {collaborations.map((collab)=> (
          <CollaborationComponent collaboration={collab}  active={parseInt(id ?? "0") == collab.id}   key={collab.id} />
        )
        )
        }
        </div>
        
        )}
        <Modal show={CollaborationModal} onHide={()=>{showCollaborationModal(false)}}>
          <Modal.Header closeButton >
            <Modal.Title className='text-violet'>Création d'une nouvelle collaboration </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {screen == "success" && <div className=''>
          <div className='d-flex flex-row justify-content-center'>
  
                  <h1 className='bg-success text-light p-4 rounded-circle'>
                    <FontAwesomeIcon icon={faThumbsUp}  size='2x'/>
                  </h1>

                  </div>
                  <h1 className='text-center text-success'> Collaboration créée avec succès</h1>


            </div>}
          {screen == "loading" && <div className=''>
            <h5 className='text-center'> création en cours veuillez patientez </h5>
            <div className='d-flex flex-row justify-content-center'>
            <Loader />
  
            </div>
            </div>}
            {screen == 'intial' && (<div>
  
  <label className="my-2"> Veuillez choisir un sujet </label>
   <InputGroup className='col-3'>
  <InputGroup.Text className='bg-white text-secondary'>

  <FontAwesomeIcon icon={faParagraph}  />

  </InputGroup.Text>

  
<FormControl className='border-start-0' type='text' 
value={topic} 
placeholder='Sujet de collaboration' 
  
  onChange={ (e) => {
    setTopic(e.target.value);
   
  }}
  /> 
 
</InputGroup>
<label className="my-2"> Decription {"(facultatif)"}</label>
<textarea className="form-control" placeholder=""></textarea>
<div className='my-2'>
<Form.Group className='mt-3 mb-3'>
      <FormLabel><BsPeople /> Départements</FormLabel>
        <InputGroup >
          <InputGroup.Text className='bg-white '>
          <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          
      <FormControl className='border-start-0' type='email' placeholder='Recherche ' value={keyword} 
        onChange={e => setKeyword(e.target.value)}
        /> 
      </InputGroup>

</Form.Group> 
<div className="card" style={{"maxHeight":"20vh","overflowY":"auto","overflowX":"hidden"}}>
{(departements.filter((dep)=>  dep.name.includes(keyword)).map((dep)=> (
<div className="p-2" key={dep.id}>
<input  type="checkbox" id={dep.id.toString()}  value={dep.id}  />
&nbsp; {dep.name}
</div>)))}

</div>

</div>



  </div>)}
          </Modal.Body>
            <Modal.Footer>
            <Button className='btn-light' onClick={()=>{
             showCollaborationModal(false)
            }}>
              Annuler
            </Button>
            <Button className={'main-btn'} onClick={async ()=>{
              var checked = document.querySelectorAll('input:checked');
              let data: number[] = [];
              checked.forEach((e)=>{
                data.push(parseInt(e.getAttribute("id") ?? "0"));
              })
              if(data.length == 0 || topic.trim().length == 0){
             showCollaborationModal(false)

                  showError(true);
                  setTimeout(() => {
                  showError(false);
                    
                  }, 2000);
              }else{
                try {
                  setScreen("loading");
                  
                  const {success, message} = await addCollaboration({
                    topic: topic,
                    description:description,
                    members:data
                  }).unwrap();
                  setScreen("success");

                  setTimeout(() => {
                    setScreen('intial');
                    setTopic('')
                    setDescription('')
                    showCollaborationModal(false)

                  }, 2000);
                } catch (error) {
                  showCollaborationModal(false)

                    alert("Error")
                }
                

              }
              
            }}>
              valider
            </Button>
            
            </Modal.Footer>
            </Modal>
            <ToastContainer position="bottom-end">
            <Toast show={error} onClose={()=>showError(false)} >
                  <Toast.Header className="bg-danger text-white">
                    <img
                      src="holder.js/20x20?text=%20"
                      className="rounded me-2"
                      alt=""
                    />
                    <strong className="me-auto">Erreur</strong>
                    <small>Maintenant</small>
                  </Toast.Header>
                  <Toast.Body> Vous devez choisir un sujet , et cocher au moins un département</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    
    
    )
  }
 
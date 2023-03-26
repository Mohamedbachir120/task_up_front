import { useState } from "react";
import { AuthState } from "../../../features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { MainUiState, setRapportSideBar, triggerRefetchKeywordDoc } from "../../../features/mainUi";
import { useFetchRapportsMutation, useGenerateDepartementReportMutation, useGenerateReportMutation } from "../../../features/task/task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faCalendar, faDownload, faGreaterThan, faRedo } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineDown } from "react-icons/ai";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import { DocumentComponent } from "./DocumentComponent";
import Loader from "../Loader";
import { backend_server } from "../../constantes/constantes";

export function DocumentsComponent(){
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
    <div className='border-start-0 border-end-0 border-top-0 border '>
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
  
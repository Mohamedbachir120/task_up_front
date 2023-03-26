import { Link } from "react-router-dom";
import { useDeleteDocumentMutation } from "../../../features/task/document";
import { useFetchRapportsMutation } from "../../../features/task/task";
import { useAppDispatch } from "../../hooks";
import { Rapport } from "../../models/Document";
import { backend_server, randomColor } from "../../constantes/constantes";
import { setRapportSideBar } from "../../../features/mainUi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export function DocumentComponent(param:{doc:Rapport}){
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
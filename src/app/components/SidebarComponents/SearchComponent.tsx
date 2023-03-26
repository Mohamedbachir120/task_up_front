import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showModalSeach } from "../../../features/mainUi";
import { useAppDispatch } from "../../hooks";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
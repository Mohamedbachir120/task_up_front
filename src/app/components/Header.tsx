import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import {AiOutlineDoubleRight} from "react-icons/ai";
import { useAppDispatch, useAppSelector } from '../hooks'
import { MainUiState, hideMarginLeft, initialize } from '../../features/mainUi'
import { useLogoutMutation } from '../../features/auth/login';
import { AuthState, signOut } from '../../features/auth/auth-slice';
import { SearchComponent } from './SidebarComponents/SearchComponent';

function Header() {
  const uistate = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi);
  const auth = useAppSelector((state:{auth:AuthState}) => state.auth);
  const dispatch =useAppDispatch()
  const [logout,{isLoading}] = useLogoutMutation();

  return (
    <div className={`${uistate.margin_left} p-2 header_main d-flex flex-row justify-content-between align-items-center`}>
      {uistate.margin_left !="margin_left" && ( <button className='btn text-light' onClick={()=>{
        dispatch(initialize());
       }}>
        <AiOutlineDoubleRight />
       </button>)}
        <div className='d-flex flex-row ms-5'>

        <img   src={`https://ui-avatars.com/api/?background=ffffff&color=666666&name=${auth.username.charAt(0)}`} />
        <p className='text-light pt-3 ms-3'>
            Bonjour , {auth.username}
        </p>
        </div>
        <div className='col-3'>
        <SearchComponent />

        </div>
        <Button variant='light' className='me-3 text-secondary ' onClick={()=>{
            logout("");
            dispatch(signOut());
        }}>
            <FontAwesomeIcon icon={faSignOutAlt} />
        </Button>
    </div>
  )
}

export default Header
import { useState } from "react"
import { useUpdatePasswordMutation } from "../../features/auth/profil"
import Header from "../components/Header"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Form, FormGroup, Spinner } from "react-bootstrap"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import NotificationAlert from "../components/Notification"
import SideBar from "../components/SideBar"
import { useAppSelector } from "../hooks"
import { MainUiState } from "../../features/mainUi"

const Profil = () => {

    const [password,setPassword] = useState("")
    const [oldpassword,setOldPassword] = useState("")
    const [success,setSuccess] = useState(false)
    const [error,setError] = useState(false)
    const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
    
    const [updatePassword,{isLoading}] = useUpdatePasswordMutation();
 
  
  return (
    <div    className='bg-white' style={{"minHeight":"100vh"}}>
    <NotificationAlert />
   <SideBar active="" isOpened={false} /> 
    <Header />
   <div  className={` ${mainUi.margin_left} `}>
        <div className=" justify-content-around me-4 my-2">
                <h5 className="text-violet m-4"><FontAwesomeIcon icon={faLock} /> Modifier mot de passe  </h5>
            <div className="m-5">
                
        <FormGroup className='col-4 my-1 d-flex flex-column align-items-start my-4'>
            <Form.Label className='fw-bold text-secondary'>
            Ancien Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={oldpassword} 
              onChange={e => setOldPassword(e.target.value)}
              />
        </FormGroup>  
        <FormGroup className='col-4 my-4 d-flex flex-column align-items-start'>
            <Form.Label className='fw-bold text-secondary'>
               mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password} 
              onChange={e => setPassword(e.target.value)}
              />
        </FormGroup>
            
           <div className="d-flex flex-row justify-content-start my-2">

        {
          !isLoading? (
            <Button  className='col-4 ' variant={(password.trim().length > 7 && oldpassword.trim().length > 7) ? "success" : "secondary"} onClick={
                (password.trim().length > 7 && oldpassword.trim().length > 7) ?
                async () => {
          
          
              try {
                
                const  {message}   = await updatePassword({password:password,oldpassword:oldpassword}).unwrap();
              
                setSuccess(true); 
                setPassword("")
                setOldPassword("")
                setTimeout(() => {
                    setSuccess(false); 
               }, 1500);
              } catch (error) {
                setError(true); 
                setTimeout(() => {
                 setError(false); 
               }, 1500);
                
              }
            
           }:()=>{} }>
             Valider
           </Button>
          ) :(
            <div className="d-flex flex-row justify-content-center col-4">

                <Spinner animation="border" variant='primary' />
            </div>
          )
        }
       
    
        </div>
        {success ? 
        <div className="col-4  text-center rounded p-2" style={{
            "background":"#E1EFE4",
            "color":"#50A060",
            "border":"1px solid #50A060"
        }}>
         Updated successfully
        </div> :<></>}
        {error ? 
       <div className="col-4  text-center rounded p-2" style={{
        "background":"#EFE1E4",
        "color":"#A05060",
        "border":"1px solid #A05060"
     }}>            Old password incorrecte
        </div>
         :<></>}

            </div> 


        </div>
      </div>
      
    </div>
  )
}

export default Profil
import logo from "../../assets/logo.png"
import { Button ,Form, FormControl, FormLabel, InputGroup, Spinner, ToastContainer} from 'react-bootstrap'
import { BsEnvelope } from 'react-icons/bs'
import {BiLockAlt} from "react-icons/bi";
import { useState } from "react";
import { loginParams, useLoginMutation } from "../../features/auth/login";
import { useAppDispatch } from "../hooks";
import { AuthState, setCredentials } from "../../features/auth/auth-slice";
import Loader from "../components/Loader";
import Toast from 'react-bootstrap/Toast';

function LoginPage() {
  function displayError(message:String){
    setMessage(message)
    setError(true); 
    setTimeout(() => {
     setError(false); 
   }, 1500);
  }
  const [error,setError] = useState(false);
  const [loginp,setLoginparams] = useState(new loginParams("",""))
    const [login,{isLoading}] = useLoginMutation();
    const dispatch = useAppDispatch();
    const [message,setMessage] = useState<String>("Veuillez remplir tous les champs")

  return (
    <div className='main-login' >

    <div className=' mx-3 my-3 d-flex flex-row justify-content-between header algin-items-center'>
        <div className='d-flex flex-row align-items-center justify-content-start'>
        <img  src={logo}/> 
        <h3 className='fw-bold '>TaskUp</h3>
        </div>
        <div className='d-flex flex-row justify-content-end align-items-center'>
              <a className='d-none d-lg-block text-decoration-none text-dark' href="/register">Vous n'avez pas de compte ?</a>  
              <Button className='main-btn mx-3' onClick={()=>{
                window.location.replace("/register");
              }}>S'inscrire</Button>
        </div>


        
    </div>
    <ToastContainer position="bottom-end">
    <Toast show={error} onClose={()=>setError(false)} >
          <Toast.Header className="bg-danger text-white">
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Erreur</strong>
            <small>Maintenant</small>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
    </ToastContainer>

    <div className='d-flex flex-row justify-content-center mt-5 py-4'>

    <div className="rounded card shadow py-4 px-5 ">
        <h2 className='text-center px-5 '>Bienvenue à nouveau !</h2>
       <Form className='px-3'>
        <Form.Group className='mt-3 mb-3'>
            <FormLabel>E-mail</FormLabel>
             <InputGroup >
                <InputGroup.Text className='bg-white '>
                <BsEnvelope />
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='email' placeholder='votre email' value={loginp.email} 
              onChange={e => setLoginparams(loginp => ({...loginp, email: e.target.value }))}
              /> 
            </InputGroup>

        </Form.Group>
        <Form.Group className='my-3'>
            <FormLabel>Mot de passe</FormLabel>
             <InputGroup>
                <InputGroup.Text className='bg-white '>

                <BiLockAlt />

                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='password' placeholder='votre mot de passe' 
                value={loginp.password} 
                onChange={e => setLoginparams(loginp => ({...loginp, password: e.target.value}))}
            
            /> 
            </InputGroup>

        </Form.Group>
        {
          !isLoading? (
        <Button className='w-100 main-btn py-3 my-3' onClick={async () => {
          
            if(loginp.email.trim().length < 5 || loginp.password.trim().length < 4){
              displayError("Veuillez remplir tous les champs")
              return;
            }
            try {
              
              const  {id,name,token,role}   = await login(loginp).unwrap();
              dispatch(setCredentials(new AuthState(true,token,name,id,role)));
            } catch (error) {
              displayError("Email ou mot de passse incorrecte");

              
              
            }
          
         }} >Se connecter</Button>):
        <div className="d-flex flex-row justify-content-center">
          <Loader /> 
          </div>

        }
        <div className='d-flex flex-row justify-content-center'>

        <a href="/forget_password"  className='text-purple text-decoration-none text-center'>Mot de passe oublié ?</a>
        </div>


        </Form>  
    </div>
    </div>
    <div className='z_index text-white d-flex flex-row justify-content-center my-5'>
        <span className='card bg-transparent border-0 d-flex flex-row'>

        vous n'avez pas de compte ?&nbsp; <a className='d-inline text-light' href="/register">S'inscrire</a>   
        </span>
    </div>
  

    <div className='bg'>

        </div>
    </div>

  )
}

export default LoginPage

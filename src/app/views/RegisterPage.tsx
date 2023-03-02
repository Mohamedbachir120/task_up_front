import logo from "../../assets/logo.png"
import { Button ,Form, FormControl, FormLabel, InputGroup, Toast, ToastContainer} from 'react-bootstrap'

import {MdOutlinePerson} from 'react-icons/md';
import { BsEnvelope } from 'react-icons/bs'
import {BiLockAlt} from "react-icons/bi";
import { useEffect, useState } from "react"
import { Direction, default_direction } from "../models/Direction"
import { baseUrl } from "../constantes/constantes";
import { Departement } from "../models/Departement";
import axios from "axios";
import { User, useLoginMutation, useRegisterMutation } from "../../features/auth/login";
import { useAppDispatch } from "../hooks";
import { AuthState, setCredentials } from "../../features/auth/auth-slice";
import Loader from "../components/Loader";

function RegisterPage() {
    const [departements,setDepartements] = useState<Departement[]>([])
    const [departement,setDepartement] = useState(1)
    const [user,setUser] = useState(new User("","","",1))
    const [register,{isLoading}] = useRegisterMutation();
    const dispatch = useAppDispatch();
     const [error,setError] = useState(false);
     const [message,setMessage] = useState<String>("Veuillez remplir tous les champs")

     function displayError(message:String){
      setMessage(message)
      setError(true); 
      setTimeout(() => {
       setError(false); 
     }, 1500);
    }

  useEffect(  () => {
    async function fetchData(){
        try {
            await axios.get(baseUrl + "departements").then((response)=>{
             setDepartements(response.data.map(
                (e:any) => new Departement(e.id,e.name,new Direction(e.direction.id,e.direction.name))))   
           })     
        } catch (error) {
        }
       
    }
    fetchData()
  }, []);
    const [screen,setScreen]=useState("specialite")
  return (
    <div className='main-login'>

    <div className=' mx-3 my-3 d-flex flex-row justify-content-between header algin-items-center'>
        <div className='d-flex flex-row align-items-center justify-content-start'>
        <img  src={logo}/> 
        <h3 className='fw-bold '>TaskUp</h3>
        </div>
        <div className='d-flex flex-row justify-content-end align-items-center'>
              <a className='d-none d-lg-block text-decoration-none text-dark' href="/login">Vous avez un compte ?</a>  
              <Button className='main-btn mx-3'  onClick={()=>{
                window.location.replace("/login");
              }}>Se connecter</Button>
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
    <div className='d-flex flex-row justify-content-center mt-3 py-4'>
      {  screen != "specialite"  ?     
   ( <div className="rounded card shadow py-4 px-5 my-5">
        <h2 className='text-center px-5 '>Allons-y !</h2>
       <Form className='px-3'>
       <Form.Group className='mt-3 mb-3'>
            <FormLabel>Nom complet</FormLabel>
             <InputGroup >
                <InputGroup.Text className='bg-white' >
               
                <MdOutlinePerson size={20} />
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='email' placeholder='votre nom' onChange={(e:any)=>{
                    setUser({...user,name: e.target.value})
                }}/> 
            </InputGroup>

        </Form.Group>
        <Form.Group className='mt-3 mb-3'>
            <FormLabel>E-mail</FormLabel>
             <InputGroup >
                <InputGroup.Text className='bg-white ' >
                 <BsEnvelope size={18} />                  
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='email' placeholder='votre email' onChange={(e:any)=>{
                    setUser({...user,email: e.target.value})
                }}/> 
            </InputGroup>

        </Form.Group>
        <Form.Group className='my-3'>
            <FormLabel>Mot de passe</FormLabel>
             <InputGroup>
                <InputGroup.Text className='bg-white ' >

                <BiLockAlt size={18} />
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='password' placeholder='votre mot de passe' onChange={(e:any)=>{
                   
                   setUser({...user,password: e.target.value})
               }}/> 
            </InputGroup>

        </Form.Group>
         {!isLoading?(<Button className='w-100 main-btn py-3 my-3' onClick={async ()=>{
             try {
              if(user.email.trim().length < 4 || user.password.trim().length < 4 || user.password.trim().length < 4){
                displayError("Veuillez remplir tous les champs");
                return;
              }
                const  {id,name,token,role}   = await register(user).unwrap();
                dispatch(setCredentials(new AuthState(true,token,name,id,role)));
              } catch (error) {
                displayError("Veuillez entrer une adresse email unique");
                
              }

        }}>S'inscrire</Button>):
        <div className="d-flex flex-row justify-content-center">

          <Loader />
          
        </div>
          }
        
       


        </Form>  
    </div>) : (
    <div className="rounded card shadow py-4 px-5 mb-5">
    <h2 className='text-center px-5 '>Allons-y !</h2>
    <Form.Group className='mt-3 mb-3'>
    <FormLabel> Département</FormLabel>
    <Form.Select onChange={(e)=>{
       setDepartement(parseInt(e.target.value))
    }}>
        {departements.map((dep:Departement) => (<option value={dep.id} key={dep.id}>{dep.designation}</option>))}
    </Form.Select>

    </Form.Group>
    <Button className='w-100 main-btn py-3 my-3' onClick={()=>{
            setScreen("register");        
    }}>Suivant</Button>

    </div>)
    }
    </div>
    <div className='z_index text-white d-flex flex-row justify-content-center mt-5 '>
        <span className='card bg-transparent border-0 d-flex flex-row mt-5 '>

        vous avez un compte ?&nbsp; <a className='d-inline text-light' href="/login">Se connecter</a>   
        </span>
    </div>
    <div className='bg'>

        </div>
    </div>

  )
}

export default RegisterPage

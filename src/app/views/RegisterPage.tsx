import logo from "../../assets/logo.png"
import { Button ,Form, FormControl, FormLabel, InputGroup} from 'react-bootstrap'

import {MdOutlinePerson} from 'react-icons/md';
import { BsEnvelope } from 'react-icons/bs'
import {BiLockAlt} from "react-icons/bi";
import { useState } from "react"
import { Departement } from "../models/Departement"
import { default_direction } from "../models/Direction"
function RegisterPage() {
    const departements = [
        new Departement(1,"Adminstration des bases de données",default_direction),
        new Departement(2,"Sécurité et conformité",default_direction),
        new Departement(3,"Système et data center",default_direction),
        new Departement(3,"Administration Réseaux",default_direction),
    ]
    const [departement,setDepartement] = useState(1)
    
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
    <div className='d-flex flex-row justify-content-center mt-3 py-4'>
      {  screen != "specialite"  ?     
   ( <div className="rounded card shadow py-4 px-5 ">
        <h2 className='text-center px-5 '>Allons-y !</h2>
       <Form className='px-3'>
       <Form.Group className='mt-3 mb-3'>
            <FormLabel>Nom complet</FormLabel>
             <InputGroup >
                <InputGroup.Text className='bg-white '>
               
                <MdOutlinePerson size={20} />
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='email' placeholder='votre nom' /> 
            </InputGroup>

        </Form.Group>
        <Form.Group className='mt-3 mb-3'>
            <FormLabel>E-mail</FormLabel>
             <InputGroup >
                <InputGroup.Text className='bg-white '>
                 <BsEnvelope size={18} />                  
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='text' placeholder='votre email' /> 
            </InputGroup>

        </Form.Group>
        <Form.Group className='my-3'>
            <FormLabel>Mot de passe</FormLabel>
             <InputGroup>
                <InputGroup.Text className='bg-white '>

                <BiLockAlt size={18} />
                </InputGroup.Text>
                
            <FormControl className='border-start-0' type='password' placeholder='votre mot de passe' /> 
            </InputGroup>

        </Form.Group>
        <Button className='w-100 main-btn py-3 my-3' >S'inscrire</Button>
       


        </Form>  
    </div>) : (
    <div className="rounded card shadow py-4 px-5 ">
    <h2 className='text-center px-5 '>Allons-y !</h2>
    <Form.Group className='mt-3 mb-3'>
    <FormLabel> Département</FormLabel>
    <Form.Select onChange={(e)=>{
       setDepartement(parseInt(e.target.value))
    }}>
        {departements.map((departement)=> (<option value={departement.id} key={departement.id}>
            {departement.designation} </option>))}
    </Form.Select>

    </Form.Group>
    <Button className='w-100 main-btn py-3 my-3' onClick={()=>{
            setScreen("register");        
    }}>Suivant</Button>

    </div>)
    }
    </div>
    <div className='z_index text-white d-flex flex-row justify-content-center'>
        <span className='card bg-transparent border-0 d-flex flex-row'>

        vous avez un compte ?&nbsp; <a className='d-inline text-light' href="/login">Se connecter</a>   
        </span>
    </div>
    <div className='bg'>

        </div>
    </div>

  )
}

export default RegisterPage

import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import { useGetObjectifsQuery, useSetObjectifMutation } from '../../features/objectif/objectif'
import { useAppSelector } from '../hooks'
import { AuthState } from '../../features/auth/auth-slice'
import { MainUiState } from '../../features/mainUi'
import { BsTrophy } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEdit, faJournalWhills, faTasks, faTasksAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

function ObjectifPage() {
    const  [keyword,setKeyword] =  useState('')
    const {data,isLoading,refetch} = useGetObjectifsQuery({keyword:""})
    const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
    const mainUi = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi)
    const [Mensuel,setMensuel] = useState(10)
    const [setObjectif]  = useSetObjectifMutation()
    const [screen,setScreen] = useState('view')
    const [Annuel,setAnnuel] = useState(100)
  return (
    <div className='bg-light' style={{"minHeight":"100vh"}}>
      
        <SideBar active="objectifs" isOpened={true} /> 
         <Header />
             { data?.objectifs?.length && screen == "view"     && (
            <div className={`${mainUi.margin_left}  `}>

                     <h2 className='ms-4 mt-2'><BsTrophy /> Objectifs</h2>
                    

                <div className='d-flex flex-row '>

               
                <div className='card col-5 m-4 p-3'>
                <div className='d-flex flex-row justify-content-between my-2 mb-4'>

                <h3>
               <BsTrophy />   &nbsp;  Vos objectifs pour l'année {data.objectifs[0].year}</h3>
               <div>
                        <button className='btn btn-success' title='modifier' onClick={()=>{
                            setScreen('edit')
                        }}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                </div>
                </div>


                <div className='d-flex flex-row justify-content-center'>
                    <div className="col-5 d-flex flex-column align-items-center card  py-3 px-2 m-2">
                        <h5><FontAwesomeIcon icon={faTasks} size='xl' /></h5>
                        <h5>{data.objectifs[0].yearly} Annuel</h5>

                    </div>
                    <div className='col-5 d-flex flex-column align-items-center card py-3 px-2 m-2'>
                        <h5><FontAwesomeIcon icon={faTasks} size='xl' /></h5>

                         <h5>  {data.objectifs[0].monthly} Mensuel</h5>

                    </div>
                </div>

                </div>
                </div>
            </div>)

         }
         { 
           screen == "edit" &&  (<div className={` ${mainUi.margin_left}`}>
            <h3 className='ms-4 m-3'>Modifier vos objectifs :</h3>
             <div className='d-flex flex-column align-items-center ms-4 card col-5 p-4 mt-4'>  

             <label htmlFor="" className='fw-bold'>Mensuel </label>
             <div>

             10  <input type='range' min={10} max={100} className='my-1' defaultValue={10} onChange={(e)=>{
             setMensuel(parseInt(e.target.value));
         }} /> 100
             </div>
         <br />
          <label htmlFor="" className='fw-bold'>Annuel </label> 
          <div>

             100  <input type='range' min={100} max={1000} className='my-1' defaultValue={10} onChange={(e)=>{
             setAnnuel(parseInt(e.target.value));
         }} /> 1000
          </div>
          <Button className='main-btn  my-3' onClick={async ()=>{
             const {message,success} = await setObjectif({
               yearly:Annuel,
               monthly:Mensuel
             }).unwrap();

             refetch() 
             setScreen("view");

            }}>
         <FontAwesomeIcon icon={faCheck} />  Valider 
         </Button>
         </div>
           </div>)
         }
         {!isLoading && !data?.objectifs?.length     && (
            <div className={`${mainUi.margin_left}  `}>
                <h2 className='ms-4 mt-2'><BsTrophy /> Objectifs</h2>

                <div className='d-flex flex-row '>

              
                <div className='card col-5 m-4 p-3'>
                    <h3>Vous n'avez pas encore fixer vos objectifs </h3>
                    <div className="d-flex flex-row justify-content-center">
                    <Link className='main-btn btn text-light col-4 my-3' to={'/home'} >
                     Commencer 
                     </Link>

                    </div>
                </div>
            </div>
            </div>)

         }
   </div>
  )
}

export default ObjectifPage
import React, { useEffect, useState } from 'react'
import logo from "../../assets/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faGear } from '@fortawesome/free-solid-svg-icons'
import { VscHome,VscBell,  } from "react-icons/vsc";
import {BsPeople} from 'react-icons/bs';
import {AiOutlineDoubleLeft, AiOutlineUsergroupAdd} from "react-icons/ai"
import { useAppDispatch, useAppSelector } from '../hooks'
import { MainUiState, hideMarginLeft,  showNotification } from '../../features/mainUi'

import { AuthState } from '../../features/auth/auth-slice'
import { io } from 'socket.io-client'
import { CollaborationsComponent } from './SidebarComponents/CollaborationsComponent'
import { ModalSearchComponent } from './SidebarComponents/SearchApprofondi'
import { SearchComponent } from './SidebarComponents/SearchComponent'
import { SideBarItem } from './SidebarComponents/SideBarItem'
import { ShowMoreComponent } from './SidebarComponents/ShowMoreComponent'
import { ProjectsComponent } from './SidebarComponents/ProjectsComponent'
import { DocumentsComponent } from './SidebarComponents/DocumentsComponent'

const socket = io("http://localhost:3000");

function SideBar(params:{active:string,isOpened:boolean}) {
  const dispatch = useAppDispatch();
  const uistate = useAppSelector((state:{mainUi:MainUiState}) => state.mainUi);
  const auth = useAppSelector((state:{auth:AuthState}) => state.auth)
  useEffect(() => {
    socket.on("receiveNotificationToUser"+auth.id.toString(),(obj)=>{
      
      dispatch(showNotification({title:obj.title,body:obj.message}))
    })
  }, []);
  if(uistate.margin_left == "margin_left"){ return   (
   
    <div className='side-bar border-end  bg-white'>
      <div className="d-flex flex-row justify-content-between align-items-center m-2">
      <div className='d-flex flex-row align-items-center'>

        <img  src={logo}/> 
        <h5 className='fw-bold'>TaskUp</h5>
      </div>
      <div className="d-flex flex-row justify-content-end">

      <button className='btn text-secondary' title='settings' onClick={()=>{
        window.location.replace('/settings');
      }}>
        <FontAwesomeIcon  icon={faGear} />
      </button> 
      <button className='btn text-violet' onClick={()=>{
       dispatch(hideMarginLeft());
      }}>
      <AiOutlineDoubleLeft />
      </button>
      </div>
      </div>
      <SearchComponent />
      <SideBarItem icon={VscHome} title='Accueil' active={params.active == "home" }  link='/home'/>
      {auth. role == "Chef de département" && (<SideBarItem icon={BsPeople} title='Département' active={params.active == "département" }  link='/departement'/>) }
      {auth. role == "Chef de département" && (<SideBarItem icon={AiOutlineUsergroupAdd} title='Invitations' active={params.active == "invitation" }  link='/invitation'/>) }
     
      {auth. role == "Directeur" && (<SideBarItem icon={BsPeople} title='Direction' active={params.active == "direction" }  link='/direction'/>) }

     <SideBarItem icon={VscBell} title='Notifications' active={params.active == "notifications" }  link='/notifications'/>
      
      <ShowMoreComponent active={params.active} isOpened={params.isOpened}  />
      <ProjectsComponent />

     {auth.role != "Directeur" && (<CollaborationsComponent />)} 
      <DocumentsComponent />
      <ModalSearchComponent/>
       </div>
  )}
  return (<></>)
}



export default SideBar
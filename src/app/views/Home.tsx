import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
import io from 'socket.io-client';
import { Button } from 'react-bootstrap';
import { AuthState } from '../../features/auth/auth-slice';
import { useAppSelector } from '../hooks';

const socket = io("http://localhost:3000");

function Home() {
  
  const authState = useAppSelector((state:{auth:AuthState})=>state.auth)
  
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string|null>(null);
  useEffect(() => {
    socket.on("receiveNotificationToUser"+authState.id.toString(),(obj)=>{
      console.log(obj)
      alert(obj.message)
    })
    
  }, []);
  return (
    <div>
      
        <SideBar active="home" /> 
         <Header />
        <AddTask  />
        
    </div>
  )
}

export default Home
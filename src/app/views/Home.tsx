import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
import io from 'socket.io-client';
import { Button } from 'react-bootstrap';

const socket = io("http://localhost:3000");

function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string|null>(null);
  useEffect(() => {
    socket.on("receiveNotificationToUser",(message)=>{
      console.log(message)
      alert(message)
    })
    
  }, []);
  return (
    <div>
      
        <SideBar active="home" /> 
         <Header />
        <AddTask  />
        <Button style={{"position":"fixed","marginLeft":"20%"}} onClick={()=>{
          socket.emit('sendNotificationToUser',{user:"test",message:"hello world"})
        }}>
          Test
        </Button>
    </div>
  )
}

export default Home
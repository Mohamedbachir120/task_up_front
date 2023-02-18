import React from 'react'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import AddTask from '../components/AddTask'

function Home() {

  return (
    <div>
      
        <SideBar active="home" />
        <Header />
        <AddTask  />
    </div>
  )
}

export default Home
import React from 'react'
import "./../../../annimation.css";

const  TaskSkeleton:React.FC = () => {
  const tab = Array(3).fill(0)
    
    const row = (
       <div>        
        <div className='skeleton py-2 col-3 mx-3 my-3 rounded' style={{"minHeight":"10vh","minWidth":"20vw"}}> </div>
        {
          tab.map((row,index)=>{return (<div className='skeleton py-2 col-3 mx-3 my-3 rounded' key={index} style={{"minHeight":"20vh","minWidth":"20vw"}}> </div>)} )
        }
        </div>

   
   );
  return (
    <div className='d-flex flex-row '>
       {row}
       {row}
       {row}
    </div>

  )
}

export default TaskSkeleton

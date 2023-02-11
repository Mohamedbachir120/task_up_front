import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function AddTask() {
  return (
    <button className='btn text-light main-btn add_task'><FontAwesomeIcon icon={faAdd} /> Tâche</button>
  )
}

export default AddTask
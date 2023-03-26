import { Link } from "react-router-dom";
import { Project } from "../../models/Project";
import { randomColor } from "../../constantes/constantes";

export function ProjectComponent(param:{project:Project,active:boolean}){
    const {project,active} = param; 
    return (
    <div className= {active ? "active ps-3 side-bar-item py-1 my-1" : "ps-3 side-bar-item py-1 my-1"}>
    <Link  to={"/project/"+project.id}  >
     <img src={  `https://ui-avatars.com/api/?background=${randomColor(project.id)}&color=ffffff&name=${project.name.charAt(0)}`} />  &nbsp; {project.name}
    </Link>
  </div>)
  }
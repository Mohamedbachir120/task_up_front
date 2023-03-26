import { Link } from "react-router-dom";
import { randomColor } from "../../constantes/constantes";

export function CollaborationComponent(param:{collaboration:Collaboration,active:boolean}){
    const {collaboration,active} = param; 
    return (
    <div className= {active ? "active ps-3 side-bar-item py-1 my-1" : "ps-3 side-bar-item py-1 my-1"}>
    <Link  to={"/collaboration/"+collaboration.id}  >
     <img src={  `https://ui-avatars.com/api/?background=${randomColor(collaboration.id)}&color=ffffff&name=${collaboration.topic.charAt(0)}`} />  &nbsp; {collaboration.topic}
    </Link>
  </div>)
  }
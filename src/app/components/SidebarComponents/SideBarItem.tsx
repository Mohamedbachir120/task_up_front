import { IconType } from "react-icons";
import { Link } from "react-router-dom";

export  function SideBarItem(params:{title:string,active:boolean,link:string,icon:IconType}){

    return (
      <div className= {params.active ? 'active ps-3 side-bar-item py-1 my-1':"ps-3 side-bar-item py-1 my-1"}>
        <Link  to={params.link}  >
         <params.icon size={18} />  &nbsp; {params.title}
        </Link>
      </div>
    )
  }
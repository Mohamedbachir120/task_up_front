import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SideBarItem } from "./SideBarItem";
import { VscGraphLine } from "react-icons/vsc";
import { BsTrophy } from "react-icons/bs";

export function ShowMoreComponent(params:{active:string,isOpened:boolean}){
    const [showMore,setShowMore] = useState(params.isOpened)
  
    return(
      <div>
     { !showMore ?
        <div className= {"ps-3 side-bar-item py-1 my-1"}>
        <Link  to={"#"}  onClick={(e)=>{
          e.preventDefault();
          setShowMore(true);
        }}>
         <FontAwesomeIcon  icon={faArrowDown} />  &nbsp; Afficher plus
        </Link>
        </div>  : (<></>) }
      { showMore ?
       <div>
        <SideBarItem icon={VscGraphLine} title='Performances' active={params.active == "performances" }  link='/performances'/>
        <SideBarItem icon={BsTrophy} title='Objectifs' active={params.active == "objectifs" }  link='/objectifs'/>
        <div className= {"ps-3 side-bar-item py-1 my-1"}>
        <Link  to={"#"}  onClick={(e)=>{
          e.preventDefault();
          setShowMore(false);
        }}>
         <FontAwesomeIcon  icon={faArrowUp} />  &nbsp; Afficher moins
        </Link>
        </div>  
      </div>:(<></>)}</div>
      )
    
  }
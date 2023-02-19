import { SubTask } from "./SubTask";

export class Task extends SubTask{
    constructor(id=0,title:string,status="À FAIRE"){
        super(title,status);
        this.id = id;
    }
    id:number
   

}
import { SubTask } from "./SubTask";
import {Project} from './Project'
import { User } from "./User";
export class Task extends SubTask{
    constructor(id=0,title:string,status="À FAIRE"){
        super(title,status);
        this.id = id;
    }
    id:number
   

}

export class FullTask extends Task {
    constructor(id=0,title:string,status="À FAIRE",end_date:string,project:Project,users:User[],sub_tasks:Task[]){
        super(id,title,status);
        this.project = project;
        this.users = users;
        this.sub_tasks = sub_tasks;
        this.end_date = end_date;
    }
    project:Project
    users:User[]
    sub_tasks:Task[]
    end_date:string


}
import { SubTask } from "./SubTask";
import {Project} from './Project'
import { User } from "./User";
export class Task extends SubTask{
    constructor(id=0,title:string,status="À FAIRE"){
        super(id,title,status);
    }
   

}

export class FullTask extends Task {
    constructor(id=0,title:string,status="À FAIRE",end_date:string,project:Project,users:User[],priority:number){
        super(id,title,status);
        this.project = project;
        this.users = users;
        this.end_date = end_date;
        this.priority = priority;
    }
    project:Project
    users:User[]
    end_date:string
    priority:number


}
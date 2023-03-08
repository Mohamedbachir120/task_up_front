import { SubTask } from "./SubTask";
import {Project} from './Project'
import { User } from "./User";
export class Task extends SubTask{
    constructor(id=0,title:string,status="À FAIRE",end_date=""){
        super(id,title,status);
        this.end_date=end_date;
    }
    end_date:string
   

}

export class FullTask extends Task {
    constructor(id=0,title:string,status="À FAIRE",end_date:string,project:Project,users:User[],priority:number){
        super(id,title,status,end_date);
        this.project = project;
        this.users = users;
        this.priority = priority;
    }
    project:Project
    users:User[]
    priority:number


}
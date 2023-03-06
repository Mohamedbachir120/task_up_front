export class SubTask{
    constructor(id=0,title:string,status="À FAIRE"){
        this.id = id;
        this.title = title;
        this.status = status;    

    }
    id:number;
    title:string;
    status:string;


}
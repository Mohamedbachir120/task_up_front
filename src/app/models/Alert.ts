export class Alert{
    constructor(id=0,title:string,message:string,created_at:string){
        this.id = id;
        this.title = title;
        this.message = message;
        this.created_at = created_at;
    }
    id:number
    title:string
    message:string
    created_at:string
}
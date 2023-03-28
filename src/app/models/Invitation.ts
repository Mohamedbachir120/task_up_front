import { FullCollaboration } from "./FullCollaboration";

export class Invitation {
    constructor(
       public id:number,
       public status:string,
       public created_at:string,
       public collaboration:FullCollaboration
       
    ){}
}
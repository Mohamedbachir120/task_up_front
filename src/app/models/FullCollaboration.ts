import { Collaboration } from "./Collaboration";
import { User } from "./User";

export class FullCollaboration extends Collaboration {
    constructor(
       public id:number,
       public topic:string,
       public description:string,
       public created_by:User
    ){
        super(id, topic, description);
    }
}
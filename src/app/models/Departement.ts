import { Direction } from "./Direction";

export class Departement{
    constructor(id=0,name:string,direction:Direction) {
        this.id = id;
        this.name=name;
        this.direction=direction;

    }

    id:number;
    name:string ;
    direction:Direction;

}
import { Direction } from "./Direction";

export class Departement{
    constructor(id=0,designation:string,direction:Direction) {
        this.id = id;
        this.designation=designation;
        this.direction=direction;

    }

    id:number;
    designation:string ;
    direction:Direction;

}
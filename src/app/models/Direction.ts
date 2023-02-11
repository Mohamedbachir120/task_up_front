export class Direction{
    constructor(id=0,designation:string){
        this.id = id;
        this.designation=designation;

    }

    id:number;
    designation:string ;

}
export const default_direction = new Direction(0,"Direction infrastructure");
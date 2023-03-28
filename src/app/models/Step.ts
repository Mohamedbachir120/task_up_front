import { Departement } from "./Departement";

export class Step{
    constructor(
        public id:number,
        public title:string,
        public description:string,
        public status:string,
        public order:number,
        public due_date:string
    ){}
} 

export class FullStep extends Step {
    constructor(
        public id:number,
        public title:string,
        public description:string,
        public status:string,
        public order:number,
        public due_date:string,
        public departement:Departement,
    ){
        super(
            id,title,description,status,order,due_date
        );
    }
}
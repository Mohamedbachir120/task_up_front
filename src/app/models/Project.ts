export class Project{
    constructor(id=0,name:string,departement_id=0){
        this.id = id;
        this.name = name;
        this.departement_id = departement_id;
    }

    id:number;
    name:string;
    departement_id:number;
}
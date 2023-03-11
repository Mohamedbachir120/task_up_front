import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { SubTask } from "../../app/models/SubTask";
import { User } from "../../app/models/User";
import { Task } from "../../app/models/Task";

export class AddTaskUiState{
    constructor (showTaskModal:boolean,showDependanceModal:boolean,subTasks:[],users:[],dependanceTask:Task)  {
           this.showTaskModal = showTaskModal;
           this.showDependanceModal = showDependanceModal;
           this.subTasks = subTasks;
           this.end_date="";
           this.selectedUsers = users;
           this.dependanceTask = dependanceTask;
    }
   
   showTaskModal:boolean;
   showDependanceModal:boolean;
   subTasks:SubTask[];
   end_date:string;
   selectedUsers:User[];
   dependanceTask:Task|undefined;
}

 const initialState:AddTaskUiState = {
     showTaskModal: false,
     showDependanceModal: false,
     subTasks: [],
     end_date: "",
     selectedUsers:[] ,
     dependanceTask:undefined,

 };

const addTaskUiSlice = createSlice({
    name: "addTaskUi",
    initialState,
    reducers: {
        initialize (state)  {
            alert("hhhhh")
            state = {...state,showTaskModal:false,showDependanceModal:false,subTasks: [],end_date: "",selectedUsers:[],dependanceTask:undefined};
           
        },
        resetToInitial(state){
            return initialState

        },
        
        showTaskModal(state){
            state.showTaskModal = true

        },
        showDependanceModal(state){
            state.showDependanceModal = true

        },
        hideTaskModal(state){
            state.showTaskModal = false

        },
        hideDependanceModal(state){
            state.showDependanceModal = false

        },
        add(state){
            return {...state, subTasks:[...state.subTasks,new SubTask(0,"   ","   ")]}
        },
        addUser(state,actions){
            return {...state, selectedUsers:[...state.selectedUsers,actions.payload]}
        },
        unSelectUser(state,actions){
            return {...state,selectedUsers:state.selectedUsers.filter((user) =>  actions.payload != user.id)} 

        },
        remove(state,actions){
           return {...state,subTasks:state.subTasks.filter((e,i) =>  actions.payload != i)} 

        },
        change(state,actions){

            return {...state,subTasks:state.subTasks.map((e:SubTask,i:number) =>{
                if(i == actions.payload.index) return new SubTask(actions.payload.value," ");
                return e; 
          
              })} 
 
         },
         setDependanceTask(state,actions){
            state.dependanceTask = actions.payload;
         },
         setEndDate(state,actions){
            return {...state,end_date:actions.payload}
         }


        
    }
})

export const { resetToInitial,setDependanceTask,addUser,unSelectUser ,initialize,setEndDate,showDependanceModal,add,showTaskModal,hideDependanceModal,hideTaskModal,remove,change } = addTaskUiSlice.actions;
export default addTaskUiSlice.reducer;



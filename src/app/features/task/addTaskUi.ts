import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { SubTask } from "../../models/SubTask";

export class AddTaskUiState{
    constructor (showTaskModal:boolean,showDependanceModal:boolean,subTasks:[])  {
           this.showTaskModal = showTaskModal;
           this.showDependanceModal = showDependanceModal;
           this.subTasks = subTasks;
           this.end_date="";
    }
   
   showTaskModal:boolean;
   showDependanceModal:boolean;
   subTasks:SubTask[];
   end_date:string;
}

 const initialState:AddTaskUiState = {
     showTaskModal: false,
     showDependanceModal: false,
     subTasks: [],
     end_date: "",
 };

const addTaskUiSlice = createSlice({
    name: "addTaskUi",
    initialState,
    reducers: {
        initialize (state)  {
            
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
            return {...state, subTasks:[...state.subTasks,new SubTask("   ")]}
        },
        remove(state,actions){
           return {...state,subTasks:state.subTasks.filter((e,i) =>  actions.payload != i)} 

        },
        change(state,actions){

            return {...state,subTasks:state.subTasks.map((e:SubTask,i:number) =>{
                if(i == actions.payload.index) return new SubTask(actions.payload.value);
                return e; 
          
              })} 
 
         },
         setEndDate(state,actions){
            return {...state,end_date:actions.payload}
         }


        
    }
})

export const {  initialize,setEndDate,showDependanceModal,add,showTaskModal,hideDependanceModal,hideTaskModal,remove,change } = addTaskUiSlice.actions;
export default addTaskUiSlice.reducer;



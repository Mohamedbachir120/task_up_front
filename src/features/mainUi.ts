import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export class MainUiState{
    constructor (margin_left:string,refetchKeyword:string)  {
           this.margin_left = margin_left
           this.refetchKeyword = refetchKeyword
    }
   
   margin_left:string;
   refetchKeyword:string; 
}

 const initialState:MainUiState = {
    margin_left:"margin_left",
    refetchKeyword:""

    

   
  
};

const mainUiSlice = createSlice({
    name: "mainUi",
    initialState,
    reducers: {
        initialize (state)  {
            
                return initialState
           
        },
        
        hideMarginLeft(state){
            state.margin_left ="";

        },
        triggerRefetch(state,actions){
            state.refetchKeyword = actions.payload;
        }
        
        
    }
})

export const {  initialize,hideMarginLeft,triggerRefetch } = mainUiSlice.actions;
export default mainUiSlice.reducer;



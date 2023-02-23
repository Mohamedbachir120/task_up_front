import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export class MainUiState{
    constructor (margin_left:string)  {
           this.margin_left = margin_left
    }
   
   margin_left:string;
  
}

 const initialState:MainUiState = {
    margin_left:"margin_left"

    

   
  
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
        
        
    }
})

export const {  initialize,hideMarginLeft } = mainUiSlice.actions;
export default mainUiSlice.reducer;



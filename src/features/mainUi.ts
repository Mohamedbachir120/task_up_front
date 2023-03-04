import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export class MainUiState{
    constructor (margin_left:string,refetchKeyword:string,mainActiveTab:string)  {
           this.margin_left = margin_left
           this.refetchKeyword = refetchKeyword
           this.mainActiveTab = mainActiveTab
    }
   
   margin_left:string;
   refetchKeyword:string; 
   mainActiveTab:string;

}

 const initialState:MainUiState = {
    margin_left:"margin_left",
    refetchKeyword:"",
    mainActiveTab:"tableau"

    

   
  
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
        },
        setMainActiveTab(state,actions){
            state.mainActiveTab = actions.payload;
        }
     
        
        
    }
})

export const {  initialize,hideMarginLeft,triggerRefetch , setMainActiveTab  } = mainUiSlice.actions;
export default mainUiSlice.reducer;



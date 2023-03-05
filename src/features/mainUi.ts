import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export class MainUiState{
    constructor (margin_left:string,refetchKeyword:string,mainActiveTab:string,refetchKeywordDoc:string)  {
           this.margin_left = margin_left
           this.refetchKeyword = refetchKeyword
           this.mainActiveTab = mainActiveTab
           this.refetchKeywordDoc = refetchKeywordDoc
    }
   
   margin_left:string;
   refetchKeyword:string; 
   mainActiveTab:string;
   refetchKeywordDoc:string;

}

 const initialState:MainUiState = {
    margin_left:"margin_left",
    refetchKeyword:"",
    mainActiveTab:"tableau",
    refetchKeywordDoc:""

    

   
  
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
        },
        triggerRefetchKeywordDoc(state,actions){
            state.refetchKeywordDoc = actions.payload;
        },

     
        
        
    }
})

export const {  initialize,hideMarginLeft,triggerRefetch , setMainActiveTab , triggerRefetchKeywordDoc } = mainUiSlice.actions;
export default mainUiSlice.reducer;



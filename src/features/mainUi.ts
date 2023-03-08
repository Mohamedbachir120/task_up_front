import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Rapport } from "../app/models/Document";

export class MainUiState{
    constructor (margin_left:string,refetchKeyword:string,mainActiveTab:string,refetchKeywordDoc:string,rapportSideBar:Rapport[],welcomeModal:boolean,actifCalendarComponent:string,notificationTitle:string,notificationBody:string,notificationShown:boolean)  {
           this.margin_left = margin_left
           this.refetchKeyword = refetchKeyword
           this.mainActiveTab = mainActiveTab
           this.refetchKeywordDoc = refetchKeywordDoc
           this.rapportSideBar = rapportSideBar
           this.welcomeModal = welcomeModal
           this.actifCalendarComponent = actifCalendarComponent
           this.notificationBody = notificationBody
           this.notificaionShown = notificationShown
           this.notificationTitle = notificationTitle

    }
   
   margin_left:string;
   refetchKeyword:string; 
   mainActiveTab:string;
   refetchKeywordDoc:string;
   rapportSideBar:Rapport[];
   welcomeModal:boolean
   actifCalendarComponent:string
   notificationTitle:string
    notificationBody:string
    notificaionShown:boolean


}

 const initialState:MainUiState = {
    margin_left:"margin_left",
    refetchKeyword:"",
    mainActiveTab:"tableau",
    refetchKeywordDoc:"",
    rapportSideBar:[],
    welcomeModal:false,
    actifCalendarComponent:"day",
    notificationTitle:"",
    notificationBody:"",
    notificaionShown:false


    

   
  
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
        setRapportSideBar(state,actions){
            state.rapportSideBar = actions.payload;
        },
        showWelcomeModal(state,actions){
            state.welcomeModal = actions.payload;
        },
        setActifCalendarComponent(state,actions){
            state.actifCalendarComponent = actions.payload;

        },
        showNotification(state,actions){
            state.notificationTitle = actions.payload.title
            state.notificationBody = actions.payload.body
            state.notificaionShown = true            
        },
        hideNotification(state){
            state.notificationTitle = ""
            state.notificationBody = ""
            state.notificaionShown = false            
        }

        
        
        
    }
})

export const { setRapportSideBar,showNotification,hideNotification , setActifCalendarComponent ,showWelcomeModal,initialize,hideMarginLeft,triggerRefetch , setMainActiveTab , triggerRefetchKeywordDoc } = mainUiSlice.actions;
export default mainUiSlice.reducer;



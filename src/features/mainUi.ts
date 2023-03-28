import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Rapport } from "../app/models/Document";

export class MainUiState{
    constructor (margin_left:string,refetchKeyword:string,mainActiveTab:string,refetchKeywordDoc:string,rapportSideBar:Rapport[],welcomeModal:boolean,actifCalendarComponent:string,notificationTitle:string,notificationBody:string,notificationShown:boolean,modalSearch:boolean,refetchInitialAddTask:string,refetchInvitations:string)  {
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
           this.modalSearch  = modalSearch
           this.refetchInitialAddTask = refetchInitialAddTask 
           this.refetchInvitations = refetchInvitations
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
    modalSearch:boolean
    refetchInitialAddTask:string
    refetchInvitations:string


}

 const initialState:MainUiState = {
    margin_left:"margin_left",
    refetchKeyword:"",
    mainActiveTab:"tableau",
    refetchKeywordDoc:"",
    rapportSideBar:[],
    welcomeModal:false,
    actifCalendarComponent:"month",
    notificationTitle:"",
    notificationBody:"",
    notificaionShown:false,
    modalSearch:false,
    refetchInitialAddTask:"",
    refetchInvitations:""
    

    

   
  
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
        },
        showModalSeach(state,actions){
            state.modalSearch = actions.payload
        },
        setRefetchInitialAddTask(state,actions){
            state.refetchInitialAddTask = actions.payload
        },
        setRefetchInvitation(state,actions){
            state.refetchInvitations = actions.payload
        }


        
        
        
    }
})

export const { setRefetchInvitation ,setRapportSideBar, setRefetchInitialAddTask,showModalSeach,showNotification,hideNotification , setActifCalendarComponent ,showWelcomeModal,initialize,hideMarginLeft,triggerRefetch , setMainActiveTab , triggerRefetchKeywordDoc } = mainUiSlice.actions;
export default mainUiSlice.reducer;



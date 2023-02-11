import { configureStore } from "@reduxjs/toolkit";
import mainUiReducer from "./features/mainUi";
export const store = configureStore({
    reducer:{
        mainUi:mainUiReducer
    },
    
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware({serializableCheck:false}).concat()

    }
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
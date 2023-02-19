import { configureStore } from "@reduxjs/toolkit";
import mainUiReducer from "./features/mainUi";

import addTaskUiReducer from "./features/task/addTaskUi";

import authReducer from "./features/auth/auth-slice";
import { apiSlice } from "./features/auth/login";

export const store = configureStore({
    reducer:{
        mainUi:mainUiReducer,
        auth: authReducer,
        addTaskUi:addTaskUiReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,

    },
    
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware({serializableCheck:false}).concat(
            apiSlice.middleware,
        )

    }
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
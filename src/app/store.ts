import { configureStore } from "@reduxjs/toolkit";
import mainUiReducer from "./features/mainUi";

import addTaskUiReducer from "./features/task/addTaskUi";

import authReducer from "./features/auth/auth-slice";
import { apiSlice } from "./features/auth/login";
import { projectSlice } from "./features/projects/project";

export const store = configureStore({
    reducer:{
        mainUi:mainUiReducer,
        auth: authReducer,
        addTaskUi:addTaskUiReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
        [projectSlice.reducerPath]:projectSlice.reducer

    },
    
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware({serializableCheck:false}).concat(
            apiSlice.middleware,
            projectSlice.middleware
        )

    }
})
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
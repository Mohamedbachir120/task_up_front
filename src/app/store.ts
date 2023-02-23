import { configureStore ,getDefaultMiddleware} from "@reduxjs/toolkit";
import { apiSlice } from "./../features/auth/login";
import authReducer from "./../features/auth/auth-slice";

import mainUiReducer from "./../features/mainUi";
import addTaskUiReducer from "./../features/task/addTaskUi";
import { projectSlice } from "./../features/projects/project";
import { taskSlice } from "../features/task/task";

export const store = configureStore({
    reducer:{
        mainUi:mainUiReducer,
        auth: authReducer,
        addTaskUi:addTaskUiReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
        [projectSlice.reducerPath]:projectSlice.reducer,
        [taskSlice.reducerPath]:taskSlice.reducer

    },
    
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware({serializableCheck:false}).concat(
            apiSlice.middleware,
            projectSlice.middleware,
            taskSlice.middleware
        );

    }
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
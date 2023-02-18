import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import {store } from './../../store';
export class AuthState{
    constructor (isAuthenticated:boolean,token:string,username:string,id:number,role:string)  {
        this.isAuthenticated = isAuthenticated;
        this.token = token;
        this.username = username;
        this.id = id;
        this.role = role;
    }
   
    isAuthenticated:boolean;
    token:string;
    username:string;
    id:number;
    role:string;
}

const initialState:AuthState = {
    isAuthenticated: localStorage.getItem("token") != null ,
    token: localStorage.getItem("token") ?? "",
    username: localStorage.getItem("username") ?? "",
    role:localStorage.getItem("role") ?? "cadre",
    id: localStorage.getItem("id") != null ? parseInt(localStorage.getItem("id")!) : 0,
  
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials (state, action: PayloadAction<AuthState>)  {
            
            
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('username', action.payload.username);
            localStorage.setItem('id', action.payload.id.toString());
            localStorage.setItem('role', action.payload.role);

            return action.payload;
        },
        signOut (state)  {
            
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('id');
            localStorage.removeItem("role");
         
            return new AuthState(false,"","",0,"");
         
        },
        
    }
})

export const { setCredentials , signOut } = authSlice.actions;
export default authSlice.reducer;



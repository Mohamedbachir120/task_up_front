import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../../app/services/baseQuery";
import { Invitation } from "../../app/models/Invitation";
import { StandarResponse } from "../../app/services/standardResponse";

export const invitationSlice = createApi({
    reducerPath:"invitation",
    baseQuery:baseQueryWithReauth,
    endpoints:(builder)=>({
        fetchInvitation:builder.query<Invitation[],{keyword:string}>({
            query:(params)=>({
                url:"/invitation",
                method:"GET"
            })
        }),
        changeStatus:builder.mutation<StandarResponse,{status:string,id:number}>({
            query:(params)=>({
                url:"/change_invitation_status/"+params.id.toString(),
                method:"POST",
                body:{
                    status:params.status
                }
            })
        })
    })
})

export const {useFetchInvitationQuery,useChangeStatusMutation} = invitationSlice
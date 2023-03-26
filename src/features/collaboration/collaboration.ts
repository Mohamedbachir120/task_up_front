import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { StandarResponse } from '../../app/services/standardResponse';


export const collaborationSlice = createApi({
    reducerPath:"collaboration",
    baseQuery:baseQueryWithReauth,
    endpoints:(builder)=>({

        addCollaboration:builder.mutation<StandarResponse,{topic:string,description:string|undefined,members:number[]}>({
          query:(params)=>({
             url:"/collaboration",
             method:"POST",
             body:{
                topic:params.topic,
                description:params.description,
                members:params.members
             }      
          })  
        }),
        fetchCollaborations:builder.mutation<Collaboration[],{}>({
          query:(params) => ({
            url:"/collaboration",
            method:"GET"
          })
        })
    })

})

export const {useAddCollaborationMutation,useFetchCollaborationsMutation} = collaborationSlice

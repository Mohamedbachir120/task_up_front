import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { StandarResponse } from '../../app/services/standardResponse';
import { Collaboration } from '../../app/models/Collaboration';
import { Departement } from '../../app/models/Departement';
import { FullStep, Step } from '../../app/models/Step';


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
        }),
        detailsCollaboration:builder.query<{
          collaboration:Collaboration,
          departements:Departement[],
          steps:Step[]

        },{id:number}>({
          query:(params) => ({
            url:"/collaboration/"+params.id.toString(),
            method:"GET"

          })
        }),
        addStep:builder.mutation<StandarResponse,{
          title:string,
          description:string|undefined,
          due_date:string,
          collaboration:number,
          departement:number|undefined,
          dependance:number|undefined}>({
            query:({title,collaboration,departement,dependance,description,due_date})=> ({

              method:"POST",
              url:"/step",
              body:{
                title:title,
                description:description,
                due_date:due_date,
                collaboration:collaboration,
                departement:departement,
                dependance:dependance

              }
            })
        }),
        fetchInitialDataStep:builder.query<{
          steps:Step[],
          departements:Departement[],
        },{id:number}>({
          query:({id})=>({
            url:'/initial_data_step/'+id.toString(),
            method: 'GET'
          })
        })  
    })

})

export const {useFetchInitialDataStepQuery,useAddStepMutation,useAddCollaborationMutation,useFetchCollaborationsMutation,useDetailsCollaborationQuery} = collaborationSlice

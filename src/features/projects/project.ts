import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { Project } from '../../app/models/Project';
import { StandarResponse } from '../../app/services/standardResponse';




export interface ListResponse<Project> {
   
    data: Project[]
  }



export const projectSlice = createApi({
    reducerPath: 'project',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

        fetchDepartementProjects: builder.mutation<ListResponse<Project>,{keyword:string}>({
            query: (params) => ({
                url:`/department_projects`,
            method: 'GET'}),

        }),
        storeProject:builder.mutation<StandarResponse,{name:string,is_fixed:number}>({
            query: (params) => ({
                url:"/project",
                method:"POST",
                body:{
                    name:params.name,
                    is_fixed:params.is_fixed
                }
            })
        })
   
      

    })

})
export const {
    useFetchDepartementProjectsMutation, useStoreProjectMutation } = projectSlice;

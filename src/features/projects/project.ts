import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { Project } from '../../app/models/Project';
import { StandarResponse } from '../../app/services/standardResponse';
import { Departement } from '../../app/models/Departement';




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
        fetchStructureDepartements:builder.query<Departement[],{}>({
            query: (params) => ({
                url:`/direction_departements`,
            method: 'GET'}),
        }),
        storeProject:builder.mutation<StandarResponse,{name:string,is_fixed:number,departement:number|undefined}>({
            query: (params) => ({
                url:"/project",
                method:"POST",
                body:{
                    name:params.name,
                    is_fixed:params.is_fixed,
                    departement:params.departement
                }
            })
        })
   
      

    })

})
export const {
    useFetchDepartementProjectsMutation, useFetchStructureDepartementsQuery,useStoreProjectMutation } = projectSlice;

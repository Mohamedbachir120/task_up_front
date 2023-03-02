import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { Project } from '../../app/models/Project';




export interface ListResponse<Project> {
   
    data: Project[]
  }



export const projectSlice = createApi({
    reducerPath: 'project',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

        fetchDepartementProjects: builder.query<ListResponse<Project>,{keyword:string}>({
            query: (params) => {return `/department_projects`;},

        }),
   
      

    })

})
export const {
    useFetchDepartementProjectsQuery } = projectSlice;

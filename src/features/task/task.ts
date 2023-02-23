import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { Project } from '../../app/models/Project';
import { User } from '../auth/login';
import { Task } from '../../app/models/Task';




export interface ListResponse<Project> {
   
    projects: Project[],
    users:User[],
    tasks:Task[]
  }



export const taskSlice = createApi({
    reducerPath: 'task',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

        fetchInitialData: builder.query<ListResponse<Project>,{keyword:string}>({
            query: (params) => {return `/fetch_initial_data`;},

        }),
   
      

    })

})
export const {
    useFetchInitialDataQuery } = taskSlice;

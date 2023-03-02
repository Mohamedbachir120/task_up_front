import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { Project } from '../../app/models/Project';
import { User } from '../../app/models/User';
import { FullTask, Task } from '../../app/models/Task';
import { StandarResponse } from '../../app/services/standardResponse';




export interface ListResponse<Project> {
   
    projects: Project[],
    users:User[],
    tasks:Task[]
  }

export interface TasksResponse {
    finished:FullTask [],
    todo:FullTask[],
    late:FullTask[]
}

export const taskSlice = createApi({
    reducerPath: 'task',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

        fetchInitialData: builder.query<ListResponse<Project>,{keyword:string}>({
            query: (params) => {return `/fetch_initial_data`;},

        }),
        fetchTasks:builder.query<TasksResponse,{keyword:string}>({
            query: (params) => {return `/tasks`;}
        }),

        addTask:builder.mutation<StandarResponse,
        {   users:number[],
            title:string,
            description:string,
            dependance_id:number|undefined,
            project_id:number|undefined,
            sub_tasks:string[],
            end_date:string,
        }>({
            query:(params) => ({
               url:"task",
               method: "POST",
               body:{
                sub_tasks:params.sub_tasks,
                dependance_id:params.dependance_id,
                title:params.title,
                description:params.description,
                project_id:params.project_id,
                end_date:params.end_date,
                users:params.users,
                 

               }
            })
        }),

   
      

    })

})
export const {
    useFetchInitialDataQuery , useFetchTasksQuery,useAddTaskMutation} = taskSlice;

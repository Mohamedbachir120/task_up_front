import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { Project } from '../../app/models/Project';
import { User } from '../../app/models/User';
import { FullTask, Task } from '../../app/models/Task';
import { StandarResponse } from '../../app/services/standardResponse';
import { Rapport } from '../../app/models/Document';
import { SubTask } from '../../app/models/SubTask';




export interface ListResponse<Project> {
   
    projects: Project[],
    users:User[],
    tasks:Task[]
  }

export interface SubTaskResponse { 
    subTasks:SubTask[]
} 

export interface TasksResponse {
    finished:FullTask [],
    todo:FullTask[],
    late:FullTask[]
}
export interface DayTaskResponse{
    tasks:FullTask[]
}
export interface TaskDateResponse {
    date:string
}
export interface FileResponse {
    url:string
}
export interface ListRapport {
    rapports : Rapport[]
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
        fetchDayTasks:builder.query<DayTaskResponse,{date:string}>({
            query: (params) => {return `/get_day_tasks?date=${params.date}`;}
        }),
        fetchDateTask:builder.query<TaskDateResponse,{keyword:string}>({
            query: (params) => {return `/get_task_date?keyword=${params.keyword}`;}
        }),
        generateReport:builder.mutation<FileResponse,{date:string}>({
            query:(params) => ({

                url:`/generate_report`,
                method:'POST',
                body : {
                    date:params.date
                }
            })
        }),

        fetchRapports: builder.mutation<ListRapport,{keyword:string}>({
            query:(params) => ({
                url:`/rapports`,
                method:'GET'})
        }),

        getSubTasks:builder.mutation<SubTaskResponse,{id:number}>({
            query:(params) => ({
                url: `/sub_tasks/${params.id}`,
                method: 'GET',

            })
        }),
        assignSubTask:builder.mutation<StandarResponse,{title:string,id:number}>({
            query:(params) => ({
                url:`/assign_sub_task/${params.id}`,
                method: 'POST',
                body:{
                    title:params.title,
                }
            })
        }),
        markAsFinished:builder.mutation<StandarResponse,{id:number}>({
            query:(params) => ({
                url:`/mark_as_finished/${params.id}`,
                method: 'POST',
            
            })
        }),
        delete:builder.mutation<StandarResponse,{id:number}>({
            query:(params) => ({
                url:`/task/${params.id}`,
                method: 'DELETE',
               
            })
        }),
        
        addTask:builder.mutation<StandarResponse,
        {   users:number[],
            title:string,
            priority:number,
            description:string,
            dependance_id:number|undefined,
            project_id:number|undefined,
            sub_tasks:string[],
            end_date:string,}>({
            query:(params) => ({
               url:"task",
               method: "POST",
               body:{
                sub_tasks:params.sub_tasks,
                dependance_id:params.dependance_id,
                title:params.title,
                description:params.description,
                project_id:params.project_id,
                priority:params.priority,
                end_date:params.end_date,
                users:params.users,
                 

               }
            })
        }),

   
      

    })

})
export const {
    useFetchInitialDataQuery ,useGetSubTasksMutation, useFetchRapportsMutation,useGenerateReportMutation,useFetchDateTaskQuery,useFetchDayTasksQuery, useMarkAsFinishedMutation,useDeleteMutation,useAssignSubTaskMutation,useFetchTasksQuery,useAddTaskMutation} = taskSlice;

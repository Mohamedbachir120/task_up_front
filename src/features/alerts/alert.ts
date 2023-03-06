import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { Project } from '../../app/models/Project';
import { StandarResponse } from '../../app/services/standardResponse';
import { Alert } from '../../app/models/Alert';




export interface ListResponse {
   
    alerts: Alert[]
  }



export const alertSlice = createApi({
    reducerPath: 'alert',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

        fetchAlert: builder.query<ListResponse,{keyword:string}>({
            query: (params) => ({
                url:`/alert`,
                method: 'GET'}),

        }),
     
      

    })

})
export const {
    useFetchAlertQuery } = alertSlice;

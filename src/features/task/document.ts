import { baseQueryWithReauth } from "../../app/services/baseQuery";
import {  createApi } from '@reduxjs/toolkit/query/react';
import { StandarResponse } from "../../app/services/standardResponse";

export const documentSlice = createApi({
    reducerPath: 'document',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        deleteDocument:builder.mutation<StandarResponse,{id:number}>({
            query:(params)=> ({
                url:`/document/${params.id}`,
                method: 'DELETE'
            })
        })
    })})

 export const {useDeleteDocumentMutation} = documentSlice   
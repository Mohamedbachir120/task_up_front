import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/services/baseQuery';
import { StandarResponse } from '../../app/services/standardResponse';
import { Objectif } from '../../app/models/Objectif';


export interface ListObjectifs{

    objectifs:Objectif[]
}




export const objectifSlice = createApi({
    reducerPath: 'objectif',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

        fetchObjectifs:builder.mutation<ListObjectifs,{}>({
          query:(params) =>({
            url:'/objectifs',
            method: 'GET'

          })
        }),
        getObjectifs:builder.query<ListObjectifs,{}>({
            query:(params) =>({
              url:'/objectifs',
              method: 'GET'
  
            })
          }),
        setObjectif: builder.mutation<StandarResponse,{yearly:number,monthly:number}>({
            query: (params) => ({
                url:`/objectif`,
                method: 'POST',
                body:{
                    yearly:params.yearly,
                    monthly:params.monthly
                }}),

        }),
     
      

    })

})
export const {
    useSetObjectifMutation,useGetObjectifsQuery,useFetchObjectifsMutation } = objectifSlice;

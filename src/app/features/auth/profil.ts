import {  createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../services/baseQuery';
import { StandarResponse } from '../../services/standardResponse';




export const profilSlice = createApi({
    reducerPath: 'profil',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

        updatePassword: builder.mutation<StandarResponse, {password:string,oldpassword:string}>({
            query: (profil) => ({
                url: `update_password`,
                method: 'POST',
                body: {
                    password: profil.password,
                    oldpassword: profil.oldpassword,

                  
                },
            }),

        }),
      

    })

})
export const {
    useUpdatePasswordMutation} = profilSlice;


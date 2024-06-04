import envConfig from '@/config'
import { LoginBodyType, RegisterBodyType } from '@/schemaValidations/auth.shema'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT }),
  reducerPath: 'authApi',
  tagTypes: ['Register', 'Login'],
  endpoints: (build) => ({
    register: build.mutation({
      query: ({ name, email, password, confirmPassword }: RegisterBodyType) => ({
        url: `/auth/register`,
        method: 'POST',
        body: { name, email, password, confirmPassword }
      }),
      invalidatesTags: ['Register']
    }),
    login: build.mutation({
      query: ({ email, password }: LoginBodyType) => ({
        url: `/auth/login`,
        method: 'POST',
        body: { email, password }
      }),
      invalidatesTags: ['Login']
    })
  })
})

export const { useRegisterMutation, useLoginMutation } = authApi

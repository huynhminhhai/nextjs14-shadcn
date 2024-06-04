import envConfig from '@/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT }),
  reducerPath: 'authApi',
  tagTypes: ['Register'],
  endpoints: (build) => ({
    register: build.mutation({
      query: ({
        name,
        email,
        password,
        confirmPassword
      }: {
        name: string
        email: string
        password: string
        confirmPassword: string
      }) => ({
        url: `/auth/register`,
        method: 'POST',
        body: { name, email, password, confirmPassword }
      }),
      invalidatesTags: ['Register']
    })
  })
})

export const { useRegisterMutation } = authApi

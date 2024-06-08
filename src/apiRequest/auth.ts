import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType
} from '@/schemaValidations/auth.shema'
import { MessageResType } from '@/schemaValidations/common.schema'

const authApiRequest = {
  login: (body: LoginBodyType) => {
    return http.post<LoginResType>('/auth/login', body)
  },
  register: (body: RegisterBodyType) => {
    return http.post<RegisterResType>('/auth/register', body)
  },
  auth: (body: { sessionToken: string; expiresAt: string }) => {
    return http.post('/api/auth', body, {
      baseUrl: ''
    })
  },
  logoutFromNextServerToServer: (sessionToken: string) => {
    return http.post<MessageResType>(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }
    )
  },
  logoutFromNextClientToNextServer: (force?: boolean | undefined) => {
    {
      return http.post<MessageResType>(
        '/api/auth/logout',
        { force },
        {
          baseUrl: ''
        }
      )
    }
  },
  slideSessionFromClientToNextServer: () => {
    return http.post<SlideSessionResType>('/api/auth/slide-session', {}, { baseUrl: '' })
  },
  slideSessionFromNextServerToServer: (sessionToken: string) => {
    return http.post<SlideSessionResType>(
      '/auth/slide-session',
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }
    )
  }
}

export default authApiRequest

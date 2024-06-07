import envConfig from '@/config'
import { normalizePath } from '@/lib/utils'
import { LoginResType } from '@/schemaValidations/auth.shema'
import { redirect } from 'next/navigation'

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

class ClientSessionToken {
  private token = ''

  get value() {
    return this.token
  }

  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === 'undefined') {
      throw new Error('Cannot set token on server side')
    }

    this.token = token
  }
}

export const clientSessionToken = new ClientSessionToken()

type CustomOptions = Omit<RequestInit, 'method'> & { baseUrl?: string | undefined }

// HTTP ERROR
export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }

  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

// ENTITY ERROR
type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class EntityError extends HttpError {
  status: number
  payload: EntityErrorPayload

  constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

const request = async <IResType>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options?.body) : undefined

  const baseHeaders = {
    'Content-Type': 'application/json',
    Authorization: clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : ''
  }

  // Nếu không truyền baseUrl (hoặc baseUrl === undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì <=> gọi API đến Next.js Server
  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl

  // Người dùng truyền vào url nào cũng hợp lệ
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body,
    method
  })

  const payload: IResType = await res.json()

  const data = {
    status: res.status,
    payload
  }

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      console.log('url-error: ', url)
      console.log('error-entity: ', data)
      throw new EntityError(data as { status: 422; payload: EntityErrorPayload })
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== 'undefined') {
        await fetch('/api/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ force: true }),
          headers: {
            ...baseHeaders
          }
        })
        clientSessionToken.value = ''
        location.href = '/login'
      } else {
        const sessionToken = (options?.headers as any).Authorization.split('Bearer ')[1]
        redirect(`/logout?sessionToken=${sessionToken}`)
      }
    } else {
      console.log('url-error: ', url)
      console.log('error-http: ', data)
      throw new HttpError(data)
    }
  }

  if (typeof window !== 'undefined') {
    if (['auth/login', 'auth/register'].some((item) => item === normalizePath(url))) {
      clientSessionToken.value = (payload as LoginResType).data.token
    } else if (['auth/logout', 'api/auth/logout'].some((item) => item === normalizePath(url))) {
      clientSessionToken.value = ''
    }
  }

  return data
}

const http = {
  get<IResType>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<IResType>('GET', url, options)
  },
  post<IResType>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<IResType>('POST', url, { ...options, body })
  },
  put<IResType>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<IResType>('PUT', url, { ...options, body })
  },
  delete<IResType>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<IResType>('DELETE', url, { ...options, body })
  }
}

export default http

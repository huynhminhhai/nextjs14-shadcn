import envConfig from '@/config'
import { LoginResType } from '@/schemaValidations/auth.shema'

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
class HttpError extends Error {
  status: number
  payload: any

  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
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
    throw new HttpError(data)
  }

  if (['/auth/loign', '/auth/register'].includes(url)) {
    clientSessionToken.value = (payload as LoginResType).data.token
  } else if (['/auth/logout'].includes(url)) {
    clientSessionToken.value = ''
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

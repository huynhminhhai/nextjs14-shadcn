import authApiRequest from '@/apiRequest/auth'
import { HttpError } from '@/lib/http'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('sessionToken')?.value

  if (!token) {
    return Response.json(
      { message: 'Can not recive token' },
      {
        status: 401
      }
    )
  }

  try {
    const res = await authApiRequest.slideSessionFromNextServerToServer(token)
    const newExpiresDate = new Date(res.payload.data.expiresAt as string).toUTCString()

    return Response.json(res.payload, {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=${token}; Path=/; HttpOnly; Expires=${newExpiresDate}`
      }
    })
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Unkonw error'
        },
        {
          status: 500
        }
      )
    }
  }
}

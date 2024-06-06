import authApiRequest from '@/apiRequest/auth'
import { HttpError } from '@/lib/http'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('sessionToken')

  if (!token) {
    return Response.json(
      { message: 'Can not recive token' },
      {
        status: 400
      }
    )
  }

  try {
    const res = await authApiRequest.logoutFromNextServerToServer(token.value)

    return Response.json(res.payload, {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0`
      }
    })
  } catch (error) {
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

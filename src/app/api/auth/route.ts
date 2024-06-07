import { decodeJWT } from '@/lib/utils'

type JwtType = {
  iat: number
  exp: number
  tokenType: string
  userId: number
}

export async function POST(request: Request) {
  const res = await request.json()

  const token = res.sessionToken

  if (!token) {
    return Response.json(
      { message: 'Can not recive token' },
      {
        status: 400
      }
    )
  }

  const payloadJWT = decodeJWT<JwtType>(token)
  const expiredJWT = new Date(payloadJWT.exp * 1000).toUTCString()

  return Response.json(res, {
    status: 200,
    headers: {
      'Set-Cookie': `sessionToken=${token}; Path=/; HttpOnly; Expires=${expiredJWT}`
    }
  })
}

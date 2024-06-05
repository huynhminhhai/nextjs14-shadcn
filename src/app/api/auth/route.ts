import { LoginResType } from '@/schemaValidations/auth.shema'

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

  return Response.json(res, {
    status: 200,
    headers: {
      'Set-Cookie': `sessionToken=${token}; Path=/; HttpOnly`
    }
  })
}

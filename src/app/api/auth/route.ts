import { LoginResType } from '@/schemaValidations/auth.shema'

export async function POST(request: Request) {
  const res = (await request.json()) as LoginResType

  const token = res?.data?.token

  if (!token) {
    return Response.json(
      { message: 'Can not recive token' },
      {
        status: 400
      }
    )
  }

  return Response.json(
    {
      message: 'Set-cookie success',
      data: res.data
    },
    {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=${token}; Path=/; HttpOnly`
      }
    }
  )
}

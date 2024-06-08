export async function POST(request: Request) {
  const res = await request.json()

  const token = res.sessionToken
  const expiresAt = res.expiresAt as string

  if (!token) {
    return Response.json(
      { message: 'Can not recive token' },
      {
        status: 400
      }
    )
  }

  const expiredJWT = new Date(expiresAt).toUTCString()

  return Response.json(res, {
    status: 200,
    headers: {
      'Set-Cookie': `sessionToken=${token}; Path=/; HttpOnly; Expires=${expiredJWT}`
    }
  })
}

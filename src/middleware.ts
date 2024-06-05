import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken')?.value
  const pathname = request.nextUrl.pathname

  if (privatePath.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (authPath.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL('/me', request.url))
  }

  return NextResponse.next()
}

const privatePath = ['/me']
const authPath = ['/login', '/register']

// See "Matching Paths" below to learn more
export const config = {
  matcher: [...privatePath, ...authPath]
}

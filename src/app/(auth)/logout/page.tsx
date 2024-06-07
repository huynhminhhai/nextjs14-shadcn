'use client'
import authApiRequest from '@/apiRequest/auth'
import { clientSessionToken } from '@/lib/http'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const LogoutPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sessionToken = searchParams.get('sessionToken')

  useEffect(() => {
    if (sessionToken === clientSessionToken.value) {
      authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
        router.push(`/login?redirectFrom=${pathname}`)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken])

  return <div>LogoutPage</div>
}

export default LogoutPage

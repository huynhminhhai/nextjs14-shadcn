'use client'

import authApiRequest from '@/apiRequest/auth'
import { clientSessionToken } from '@/lib/http'
import { useEffect } from 'react'
import { differenceInHours } from 'date-fns'

const SlideSession = () => {
  useEffect(() => {
    const interval = setInterval(
      async () => {
        const now = new Date()
        const expiresAt = new Date(clientSessionToken.expiresAt)

        if (differenceInHours(now, expiresAt) < 1) {
          const res = await authApiRequest.slideSessionFromClientToNextServer()
          clientSessionToken.expiresAt = res.payload.data.expiresAt
        }
      },
      1000 * 60 * 60
    )
    return () => clearInterval(interval)
  }, [])

  return null
}

export default SlideSession

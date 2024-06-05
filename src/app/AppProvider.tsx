'use client'
import { sessionToken } from '@/lib/http'
import { useState } from 'react'

export default function AppProvider({
  children,
  initialSessionToken = ''
}: {
  children: React.ReactNode
  initialSessionToken?: string
}) {
  useState(() => {
    sessionToken.value = initialSessionToken
  })

  return <>{children}</>
}

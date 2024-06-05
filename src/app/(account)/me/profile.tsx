'use client'
import accountApiRequest from '@/apiRequest/account'
import React, { useEffect, useState } from 'react'

const MePageClient = () => {
  const [user, setUser] = useState<any>(undefined)

  useEffect(() => {
    fetchMeApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchMeApi = async () => {
    const res = await accountApiRequest.meClient()

    setUser(res)
  }

  return <div>Welcome to client, {user?.payload?.data?.name}</div>
}

export default MePageClient

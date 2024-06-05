'use client'
import accountApiRequest from '@/apiRequest/account'
import { useAppContext } from '@/app/AppProvider'
import { AccountResType } from '@/schemaValidations/account.schema'
import React, { useEffect, useState } from 'react'

const MePageClient = () => {
  const { sessionToken } = useAppContext()
  const [user, setUser] = useState<any>(undefined)

  useEffect(() => {
    fetchMeApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken])

  const fetchMeApi = async () => {
    const res = await accountApiRequest.me(sessionToken)

    setUser(res)
  }

  return <div>Welcome to client, {user?.payload?.data?.name}</div>
}

export default MePageClient

'use client'
import { useAppContext } from '@/app/AppProvider'
import envConfig from '@/config'
import { AccountResType } from '@/schemaValidations/account.schema'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const MePageClient = () => {
  const { sessionToken } = useAppContext()
  const [user, setUser] = useState<AccountResType | undefined>(undefined)

  useEffect(() => {
    fetchMeApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken])

  const fetchMeApi = async () => {
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }).then(async (res) => {
      if (!res.ok) {
        return redirect('/login')
      }

      const result: AccountResType = await res.json()

      return result
    })

    setUser(res)
  }

  return <div>Welcome to client, {user?.data.name}</div>
}

export default MePageClient

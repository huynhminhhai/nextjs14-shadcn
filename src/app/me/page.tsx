import MePageClient from '@/app/me/profile'
import envConfig from '@/config'
import { AccountResType } from '@/schemaValidations/account.schema'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const MePage = async () => {
  const token = cookies().get('sessionToken')

  const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
    headers: {
      Authorization: `Bearer ${token?.value}`
    }
  }).then(async (res) => {
    if (!res.ok) {
      return redirect('/login')
    }

    const result: AccountResType = await res.json()

    return result
  })

  return (
    <div>
      Wellcome, {res.data.name}
      <MePageClient />
    </div>
  )
}

export default MePage

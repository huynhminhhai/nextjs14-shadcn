import accountApiRequest from '@/apiRequest/account'
import MePageClient from '@/app/(account)/me/profile'
import { cookies } from 'next/headers'
import React from 'react'

const MePage = async () => {
  const token = cookies().get('sessionToken')

  const res = await accountApiRequest.me(token?.value || '')

  return (
    <div>
      Wellcome, {res.payload.data.name}
      <MePageClient />
    </div>
  )
}

export default MePage

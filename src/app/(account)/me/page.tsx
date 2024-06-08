import accountApiRequest from '@/apiRequest/account'
import MePageClient from '@/app/(account)/me/profile'
import ProfileForm from '@/app/(account)/me/profile-form'
import { cookies } from 'next/headers'
import React from 'react'

const MePage = async () => {
  const token = cookies().get('sessionToken')

  const res = await accountApiRequest.me(token?.value || '')

  return (
    <div>
      <ProfileForm profile={res.payload.data} />
    </div>
  )
}

export default MePage

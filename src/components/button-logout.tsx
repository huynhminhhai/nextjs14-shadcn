'use client'
import authApiRequest from '@/apiRequest/auth'
import { clientSessionToken } from '@/lib/http'
import { handleErrorApi } from '@/lib/utils'
import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer()

      // Chờ cho tới khi sessionToken được xóa
      await new Promise((resolve) => setTimeout(resolve, 1200))

      router.push('/login')
      router.refresh()
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <div onClick={() => handleLogout()} className='flex items-center gap-2 cursor-pointer'>
      Logout <LogOutIcon size={16} />
    </div>
  )
}

export default LogoutButton

import AvatarProfile from '@/components/avatar'
import { ModeToggle } from '@/components/toggle-theme'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center px-12 py-6'>
      <ul className='flex items-center gap-6'>
        <li>
          <Link href={'/login'}>Login</Link>
        </li>
        <li>
          <Link href={'/register'}>Register</Link>
        </li>
      </ul>
      <ul className='flex items-center gap-6'>
        <li>
          <ModeToggle />
        </li>
        <li>
          <AvatarProfile />
        </li>
      </ul>
    </div>
  )
}

export default Header

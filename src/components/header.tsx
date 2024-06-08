import MenuUser from '@/components/menu-user'
import { ModeToggle } from '@/components/toggle-theme'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center px-12 py-6'>
      <ul className='flex items-center gap-4'>
        <li>
          <Link href={'/products'}>Products</Link>
        </li>
      </ul>
      <ul className='flex items-center gap-4'>
        <li>
          <ModeToggle />
        </li>
        <li>
          <MenuUser />
        </li>
      </ul>
    </div>
  )
}

export default Header

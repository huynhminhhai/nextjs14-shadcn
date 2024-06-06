import MenuUser from '@/components/menu-user'
import { ModeToggle } from '@/components/toggle-theme'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center px-12 py-6'>
      <ul className='flex items-center gap-4'></ul>
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

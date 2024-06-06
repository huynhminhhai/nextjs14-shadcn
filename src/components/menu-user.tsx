'use client'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import LogoutButton from '@/components/button-logout'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { clientSessionToken } from '@/lib/http'

const MenuUser = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {!clientSessionToken.value ? (
          <>
            <DropdownMenuItem>
              <Link href={'/login'} className='w-[100%]'>
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={'/register'} className='w-[100%]'>
                Register
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <Link href={'/me'} className='w-[100%]'>
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MenuUser

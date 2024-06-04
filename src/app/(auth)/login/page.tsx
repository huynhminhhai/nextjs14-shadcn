import LoginForm from '@/app/(auth)/login/login-form'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1>Login Form</h1>
      <LoginForm />
    </div>
  )
}

export default LoginPage

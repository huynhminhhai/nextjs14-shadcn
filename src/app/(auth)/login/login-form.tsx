'use client'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginBodyType, LoginBody } from '@/schemaValidations/auth.shema'
import { useToast } from '@/components/ui/use-toast'
import authApiRequest from '@/apiRequest/auth'
import { useRouter } from 'next/navigation'
import { handleErrorApi } from '@/lib/utils'

const initalLoginBody = {
  email: '',
  password: ''
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: initalLoginBody
  })

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    setIsLoading(true)
    try {
      const res = await authApiRequest.login(values)

      form.reset()

      toast({
        title: res.payload.message
      })

      await authApiRequest.auth({ sessionToken: res.payload.data.token })

      router.push('/me')
      router.refresh()
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
        titleToast: 'Login Failed'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 w-[400px] flex flex-col '>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button style={{ marginTop: '1.5rem' }} type='submit' disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm

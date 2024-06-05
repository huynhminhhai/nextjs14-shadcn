'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginBodyType, LoginBody } from '@/schemaValidations/auth.shema'
import { useToast } from '@/components/ui/use-toast'
import { useAppContext } from '@/app/AppProvider'
import authApiRequest from '@/apiRequest/auth'
import { useRouter } from 'next/navigation'

const initalLoginBody = {
  email: '',
  password: ''
}

const LoginForm = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { setSessionToken } = useAppContext()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: initalLoginBody
  })

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    try {
      const res = await authApiRequest.login(values)

      form.reset()

      toast({
        title: res.payload.message
      })

      await authApiRequest.auth({ sessionToken: res.payload.data.token })

      setSessionToken(res.payload.data.token)

      router.push('/me')
    } catch (error: any) {
      const errors = error.payload.errors as { field: string; message: string }[]

      const status = error.status as number

      if (status === 422) {
        errors.forEach((err) => {
          form.setError(err.field as any, {
            type: 'server',
            message: err.message
          })
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error.payload.message
        })
      }
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
        <Button style={{ marginTop: '1.5rem' }} type='submit'>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm

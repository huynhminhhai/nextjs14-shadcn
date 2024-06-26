'use client'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.shema'
import { useToast } from '@/components/ui/use-toast'
import authApiRequest from '@/apiRequest/auth'
import { useRouter } from 'next/navigation'
import { handleErrorApi } from '@/lib/utils'

const initalRegisterBody = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const RegisterForm = () => {
  const [isloading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: initalRegisterBody
  })

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    setIsLoading(true)
    try {
      const res = await authApiRequest.register(values)

      form.reset()

      toast({
        title: res.payload.message
      })

      await authApiRequest.auth({ sessionToken: res.payload.data.token, expiresAt: res.payload.data.expiresAt })

      router.push('/me')
      router.refresh()
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
        titleToast: 'Register Failed'
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button style={{ marginTop: '1.5rem' }} type='submit' disabled={isloading}>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default RegisterForm

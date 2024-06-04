'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterBody, RegisterBodyType, RegisterResType } from '@/schemaValidations/auth.shema'
import { useToast } from '@/components/ui/use-toast'
import envConfig from '@/config'

const initalRegisterBody = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const RegisterForm = () => {
  const { toast } = useToast()

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: initalRegisterBody
  })

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    try {
      const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })

      if (!res.ok) {
        throw await res.json()
      }

      const result: RegisterResType = await res.json()

      form.reset()

      toast({
        title: result.message
      })
    } catch (error: any) {
      const errors = error.errors as { field: string; message: string }[]

      const status = error.statusCode as number

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
          title: 'Register failed',
          description: error.data.message
        })
      }
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
        <Button style={{ marginTop: '1.5rem' }} type='submit'>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default RegisterForm

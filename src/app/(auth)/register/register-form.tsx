'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.shema'
import envConfig from '@/config'
import { useToast } from '@/components/ui/use-toast'

const RegisterForm = () => {
  const { toast } = useToast()

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    try {
      const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then((res) => res.json())

      if (result.statusCode === 422 || result.errors) {
        toast({
          variant: 'destructive',
          title: 'Register failed',
          description: result.errors[0].message
        })
      } else {
        form.reset()
        toast({
          title: 'Register success',
          description: result.message
        })
      }
    } catch (error) {
      console.log('Error: ', error)
      toast({
        variant: 'destructive',
        title: 'Register failed'
      })
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
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}

export default RegisterForm

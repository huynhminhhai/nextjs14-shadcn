'use client'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { handleErrorApi } from '@/lib/utils'
import { AccountResType, UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import accountApiRequest from '@/apiRequest/account'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type ProfileType = AccountResType['data']

const ProfileForm = ({ profile }: { profile: ProfileType }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: profile.name
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: UpdateMeBodyType) {
    setIsLoading(true)
    try {
      const res = await accountApiRequest.updateMeClient(values)

      toast({
        title: res.payload.message
      })

      router.refresh()
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
        titleToast: 'Update profile failed'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='grid grid-cols-12 min-h-[70vh]'>
      <div className='col-span-3 border-r-2'>
        <Avatar className='w-[200px] h-[200px] mx-auto'>
          <AvatarImage src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9yvLuzYJaYx84BoOKxiAoJns8UqyeyGGTJQ&s' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className='col-span-9'>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 w-[400px] flex flex-col ml-12'>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input readOnly value={profile.email} />
            </FormControl>
            <FormMessage />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
      </div>
    </div>
  )
}

export default ProfileForm

'use client'
import React, { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { handleErrorApi } from '@/lib/utils'
import { CreateProductBody, CreateProductBodyType } from '@/schemaValidations/product.schema'
import productApiRequest from '@/apiRequest/product'
import { Textarea } from '@/components/ui/textarea'
import { error } from 'console'
import Image from 'next/image'

const initalCreateProductBody = {
  name: '',
  price: 0,
  description: '',
  image: ''
}

const AddProductForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: initalCreateProductBody
  })

  // 2. Define a submit handler.
  async function onSubmit(values: CreateProductBodyType) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file as Blob)

      const uploadRes = await productApiRequest.uploadImage(formData)

      const imageUrl = uploadRes.payload.data

      const res = await productApiRequest.create({ ...values, image: imageUrl })

      form.reset()

      toast({
        title: res.payload.message
      })

      router.push('/products')
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
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log(error)
          console.log(form.getValues('image'))
        })}
        className='space-y-2 w-[400px] flex flex-col '
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  ref={inputRef}
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.value = ''
                    }
                  }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]

                    if (file) {
                      setFile(file)
                      field.onChange('http://localhost:3000/' + file.name)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {file && (
          <div className='relative w-fit'>
            <Image src={URL.createObjectURL(file)} width={120} height={120} alt='preview' className='object-cover' />
            <Button
              className='absolute top-[-5px] right-[-5px]'
              variant={'destructive'}
              size={'sm'}
              onClick={() => {
                setFile(null)
                form.setValue('image', '')
                if (inputRef.current) {
                  inputRef.current.value = ''
                }
              }}
            >
              X
            </Button>
          </div>
        )}
        <Button style={{ marginTop: '1.5rem' }} type='submit' disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default AddProductForm

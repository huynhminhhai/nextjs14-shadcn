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
import { CreateProductBody, CreateProductBodyType, ProductResType } from '@/schemaValidations/product.schema'
import productApiRequest from '@/apiRequest/product'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

type ProductType = ProductResType['data']

const AddProductForm = ({ product }: { product?: ProductType }) => {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const initalCreateProductBody = {
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    image: product?.image || ''
  }

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: initalCreateProductBody
  })

  const image = form.watch('image')

  const createProduct = async (values: CreateProductBodyType) => {
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

  const updateProduct = async (_values: CreateProductBodyType) => {
    setIsLoading(true)
    let values = _values
    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file as Blob)

        const uploadRes = await productApiRequest.uploadImage(formData)

        const imageUrl = uploadRes.payload.data

        values = { ...values, image: imageUrl }
      }

      const res = await productApiRequest.update(product?.id!, values)

      router.refresh()

      toast({
        title: res.payload.message
      })
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

  // 2. Define a submit handler.
  async function onSubmit(values: CreateProductBodyType) {
    console.log(values)
    if (product) {
      await updateProduct(values)
    } else {
      await createProduct(values)
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
        {(file || image) && (
          <div className='relative w-fit'>
            <Image
              src={file ? URL.createObjectURL(file) : image}
              width={120}
              height={120}
              alt='preview'
              className='object-cover'
            />
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

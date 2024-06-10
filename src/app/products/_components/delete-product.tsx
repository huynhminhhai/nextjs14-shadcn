'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { ProductResType } from '@/schemaValidations/product.schema'
import productApiRequest from '@/apiRequest/product'
import { handleErrorApi } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const DeleteProduct = ({ product }: { product: ProductResType['data'] }) => {
  const { toast } = useToast()
  const router = useRouter()
  const handleDeleteProduct = async () => {
    try {
      await productApiRequest.delete(product.id)

      toast({
        title: `Delete product ${product.name} success`
      })

      router.refresh()
    } catch (error) {
      handleErrorApi({ error, titleToast: 'Delete product failed' })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete &quot;{product.name}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteProduct}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteProduct

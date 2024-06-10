import productApiRequest from '@/apiRequest/product'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductListPage = async () => {
  const { payload } = await productApiRequest.getList()
  const productList = payload.data

  return (
    <div>
      <div className='flex justify-end'>
        <Button>
          <Link href={'/products/add'}>Add</Link>
        </Button>
      </div>
      <div className='flex flex-col gap-6 mt-12'>
        {productList.map((product) => (
          <div key={product.id} className='flex gap-6'>
            <Image src={product.image} alt='product' height={200} width={200} className='w-32 h-32 object-cover' />
            <div>
              <h5>Name: {product.name}</h5>
              <div>Price: {product.price}</div>
              <div>Desc: {product.description}</div>
            </div>
            <div className='flex flex-col gap-6'>
              <Button variant='destructive'>Delete</Button>
              <Button variant='outline'>Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductListPage

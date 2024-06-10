import productApiRequest from '@/apiRequest/product'
import AddProductForm from '@/app/products/_components/add-form'
import React from 'react'

const ProductEditPage = async ({ params }: { params: { id: string } }) => {
  let product = null

  try {
    const { payload } = await productApiRequest.getDetail(Number(params.id))
    product = payload.data
  } catch (error: any) {}

  return (
    <div>
      {!product && <>Can not find product</>}
      {product && <AddProductForm product={product} />}
    </div>
  )
}

export default ProductEditPage

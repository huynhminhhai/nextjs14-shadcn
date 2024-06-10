import productApiRequest from '@/apiRequest/product'
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
      {product && (
        <div>
          <div>{product.name}</div>
        </div>
      )}
    </div>
  )
}

export default ProductEditPage

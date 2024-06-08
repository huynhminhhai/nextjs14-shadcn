import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const ProductListPage = () => {
  return (
    <div>
      <Button>
        <Link href={'/products/add'}>Add</Link>
      </Button>
    </div>
  )
}

export default ProductListPage

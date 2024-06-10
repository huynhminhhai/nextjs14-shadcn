import http from '@/lib/http'
import { MessageResType } from '@/schemaValidations/common.schema'
import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType,
  UpdateProductBodyType
} from '@/schemaValidations/product.schema'

const productApiRequest = {
  getList: () => {
    return http.get<ProductListResType>('/products', { cache: 'no-store' })
  },
  getDetail: (id: number) => {
    return http.get<ProductResType>(`/products/${id}`, { cache: 'no-store' })
  },
  create: (body: CreateProductBodyType) => {
    return http.post<ProductResType>('/products', body)
  },
  update: (id: number, body: UpdateProductBodyType) => {
    return http.put<ProductResType>(`/products/${id}`, body)
  },
  delete: (id: number) => {
    return http.delete<MessageResType>(`/products/${id}`)
  },
  uploadImage: (body: FormData) => {
    return http.post<{ message: string; data: string }>('/media/upload', body)
  }
}

export default productApiRequest

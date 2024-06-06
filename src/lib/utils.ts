import { toast } from '@/components/ui/use-toast'
import { EntityError, HttpError } from '@/lib/http'
import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const compareObject = (object1: { [key: string]: any }, object2: { [key: string]: any }) => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false
    }
  }

  return true
}

export const handleErrorApi = ({
  error,
  setError,
  titleToast
}: {
  error: any
  setError: UseFormSetError<any>
  titleToast: string
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast({
      variant: 'destructive',
      title: titleToast,
      description: error.payload.message || 'Unknown error'
    })
  }
}

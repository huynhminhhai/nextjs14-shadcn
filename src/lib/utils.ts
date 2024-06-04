import { type ClassValue, clsx } from 'clsx'
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

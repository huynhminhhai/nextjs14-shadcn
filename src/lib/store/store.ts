import { authApi } from '@/lib/store/services/api/auth.api'
import { globalReducer } from '@/lib/store/slices/globalSlice'
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'

export const store: any = configureStore({
  reducer: { global: globalReducer, [authApi.reducerPath]: authApi.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(authApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

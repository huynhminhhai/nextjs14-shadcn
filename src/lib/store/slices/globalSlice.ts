import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface IGlobalState {
  test: string
}

const initialState: IGlobalState = {
  test: '123'
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // setAuthState: (state, action: PayloadAction<boolean>) => {
    //   state.authState = action.payload
    // }
  }
})

export const {} = globalSlice.actions
export const globalReducer = globalSlice.reducer

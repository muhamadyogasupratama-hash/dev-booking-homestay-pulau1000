import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import homestaysReducer from '../features/homestays/homestaysSlice'

export const store = configureStore({ reducer: { auth: authReducer, homestays: homestaysReducer } })

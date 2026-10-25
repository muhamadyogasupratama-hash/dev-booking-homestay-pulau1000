import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

export const registerUser = createAsyncThunk('auth/register', async (form, { rejectWithValue }) => {
  try { return (await axiosInstance.post('/users/register', form)).data }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Registrasi gagal.') }
})

export const loginUser = createAsyncThunk('auth/login', async (form, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/users/login', form)
    localStorage.setItem('access_token', data.access_token)
    const current = await axiosInstance.get('/users/me')
    return { token: data.access_token, user: current.data.data }
  } catch (error) {
    localStorage.removeItem('access_token')
    return rejectWithValue(error.response?.data?.message || 'Login gagal.')
  }
})

export const loadCurrentUser = createAsyncThunk('auth/currentUser', async (_, { rejectWithValue }) => {
  try { return (await axiosInstance.get('/users/me')).data.data }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Sesi berakhir.') }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await axiosInstance.post('/users/logout') }
  finally { localStorage.removeItem('access_token') }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem('access_token'), user: null, loading: Boolean(localStorage.getItem('access_token')), error: null },
  reducers: { clearAuthError(state) { state.error = null } },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; state.user = action.payload.user })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.token = null; state.user = null; state.error = action.payload })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(loadCurrentUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload })
      .addCase(loadCurrentUser.rejected, (state) => { state.loading = false; state.token = null; state.user = null; localStorage.removeItem('access_token') })
      .addMatcher(logoutUser.settled, (state) => { state.loading = false; state.token = null; state.user = null; state.error = null })
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer

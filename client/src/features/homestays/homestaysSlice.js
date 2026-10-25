import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

export const fetchHomestays = createAsyncThunk('homestays/fetchAll', async (_, { rejectWithValue }) => {
  try { return (await axiosInstance.get('/homestays')).data.data }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Gagal memuat homestay.') }
})

const homestaysSlice = createSlice({
  name: 'homestays',
  initialState: { data: [], loading: false, error: null },
  reducers: {
    removeHomestay(state, action) { state.data = state.data.filter((item) => item.id !== action.payload) },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchHomestays.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchHomestays.fulfilled, (state, action) => { state.loading = false; state.data = action.payload })
      .addCase(fetchHomestays.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { removeHomestay } = homestaysSlice.actions
export default homestaysSlice.reducer

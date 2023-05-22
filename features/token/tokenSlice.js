import { createSlice } from '@reduxjs/toolkit'

const initalState = {
  loading: false,
  token: null,
  error: null,
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState: initalState,
  reducers: {
    fetchingToken: (state) => {
      state.loading = true
      state.token = null
      state.error = null
    },
    fetchedToken: (state, action) => {
      state.loading = false
      state.token = action.payload
      state.error = null
    },
    failedFetchToken: (state, action) => {
      state.loading = false
      state.token = null
      state.error = action.payload
    },
    removeToken: (state) => {
      state.loading = false
      state.token = null
      state.error = null
    },
  },
})

export const { fetchingToken, fetchedToken, failedFetchToken, removeToken } =
  tokenSlice.actions

export default tokenSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const initalState = {
  loading: false,
  token: null,
  bolt: null,
  error: null,
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState: initalState,
  reducers: {
    fetchingToken: (state) => {
      state.loading = true
      state.token = null
      state.bolt = null
      state.error = null
    },
    fetchedToken: (state, { payload }) => {
      state.loading = false
      state.token = payload.token
      state.bolt = payload.bolt
      state.error = null
    },
    failedFetchToken: (state, action) => {
      state.loading = false
      state.token = null
      state.bolt = null
      state.error = action.payload
    },
    removeToken: (state) => {
      // state.loading = false
      state.token = null
      state.bolt = null
      state.error = null
    },
  },
})

export const { fetchingToken, fetchedToken, failedFetchToken, removeToken } =
  tokenSlice.actions

export default tokenSlice.reducer

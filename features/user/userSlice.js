import { createSlice } from '@reduxjs/toolkit'

const initalState = {
  loading: false,
  user: null,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initalState,
  reducers: {
    fetchingUser: (state) => {
      state.loading = true
      state.user = null
      state.error = null
    },
    fetchedUser: (state, action) => {
      state.loading = false
      state.user = action.payload
      state.error = null
    },
    failedFetchUser: (state, action) => {
      state.loading = false
      state.user = null
      state.error = action.payload
    },
    removeUser: (state) => {
      state.loading = false
      state.user = null
      state.error = null
    },
  },
})

export const { fetchingUser, fetchedUser, failedFetchUser, removeUser } =
  userSlice.actions

export default userSlice.reducer

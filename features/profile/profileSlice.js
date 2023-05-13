import { createSlice } from '@reduxjs/toolkit'

const initalState = {
  loading: false,
  profile: null,
  error: null,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initalState,
  reducers: {
    fetchingProfile: (state) => {
      state.loading = true
      state.profile = null
      state.error = null
    },
    fetchedProfile: (state, action) => {
      state.loading = false
      state.profile = action.payload
      state.error = null
    },
    failedFetchProfile: (state, action) => {
      state.loading = false
      state.profile = null
      state.error = action.payload
    },
    removeProfile: (state) => {
      state.loading = false
      state.profile = null
      state.error = null
    },
  },
})

export const {
  fetchingProfile,
  fetchedProfile,
  failedFetchProfile,
  removeProfile,
} = profileSlice.actions

export default profileSlice.reducer

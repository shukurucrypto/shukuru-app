import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from '../../apiURL'

const initalState = {
  loading: false,
  profile: null,
  error: null,
}

export const fetchProfile = async (dispatch, userId) => {
  dispatch(fetchingProfile())
  try {
    const result = await axios.get(`${API_URL}/user/${userId}`)

    if (result.data.success) {
      dispatch(fetchedProfile(result.data.data))
    }
  } catch (error) {
    dispatch(failedFetchProfile(error.message))
  }
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

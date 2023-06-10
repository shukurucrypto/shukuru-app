import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from '../../apiURL'

const initalState = {
  loading: false,
  reward: null,
  error: null,
}

export const fetchCheckreward = async (dispatch, token) => {
  dispatch(fetchingReward())
  try {
    const result = await axios.get(`${API_URL}/rewards/check/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (result.data.success) {
      dispatch(fetchedReward(result.data))
    }
  } catch (error) {
    dispatch(failedFetchReward(error.message))
  }
}

export const claimReward = async (token) => {
  try {
    const result = await axios.get(`${API_URL}/claim`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return result.data
  } catch (error) {
    return error.message
  }
}

export const rewardSlice = createSlice({
  name: 'reward',
  initialState: initalState,
  reducers: {
    fetchingReward: (state) => {
      state.loading = true
      state.reward = null
      state.error = null
    },
    fetchedReward: (state, action) => {
      state.loading = false
      state.reward = action.payload
      state.error = null
    },
    failedFetchReward: (state, action) => {
      state.loading = false
      state.reward = null
      state.error = action.payload
    },
    removeReward: (state) => {
      state.loading = false
      state.reward = null
      state.error = null
    },
  },
})

export const {
  fetchingReward,
  fetchedReward,
  failedFetchReward,
  removeReward,
} = rewardSlice.actions

export default rewardSlice.reducer

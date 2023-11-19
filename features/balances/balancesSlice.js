import { createSlice } from '@reduxjs/toolkit'
import { API_URL } from '../../apiURL'
import axios from 'axios'

const initalState = {
  loading: false,
  balances: null,
  error: '',
}

export const fetchBalance = async (dispatch, userId, token, bolt) => {
  dispatch(fetchingBalances())

  // Remove double quotes from bolt if they exist
  if (bolt.startsWith('"') && bolt.endsWith('"')) {
    bolt = bolt.slice(1, -1)
  }

  try {
    const result = await axios.get(`${API_URL}/wallet/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        bolt: bolt,
      },
    })

    if (result.data.success) {
      dispatch(fetchedBalances(result.data.data))
    }
  } catch (error) {
    console.log(error.message)
    dispatch(failedFetchBalances(error.message))
  }
}

export const balancesSlice = createSlice({
  name: 'balances',
  initialState: initalState,
  reducers: {
    fetchingBalances: (state) => {
      state.loading = true
    },
    fetchedBalances: (state, action) => {
      state.loading = false
      state.balances = action.payload
      state.error = null
    },
    failedFetchBalances: (state, action) => {
      state.loading = false
      state.balances = null
      state.error = action.payload
    },
  },
})

export const { fetchingBalances, fetchedBalances, failedFetchBalances } =
  balancesSlice.actions

export default balancesSlice.reducer

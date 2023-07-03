import { createSlice } from '@reduxjs/toolkit'
import { API_URL } from '../../apiURL'
import axios from 'axios'

const initalState = {
  loading: false,
  gas: null,
  error: '',
}

export const fetchUserGas = async (dispatch, userId, token) => {
  dispatch(fetchingGasBalance())

  try {
    const result = await axios.get(`${API_URL}/gas/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (result.data.success) {
      dispatch(fetchedGasBalance(result.data.balances))
    } else {
      dispatch(fetchedGasBalance(null))
    }
  } catch (error) {
    console.log(error.message)
    dispatch(failedFetchGasBalance(error.message))
  }
}

export const gasBalanceSlice = createSlice({
  name: 'gas',
  initialState: initalState,
  reducers: {
    fetchingGasBalance: (state) => {
      state.loading = true
    },
    fetchedGasBalance: (state, action) => {
      state.loading = false
      state.gas = action.payload
      state.error = null
    },
    failedFetchGasBalance: (state, action) => {
      state.loading = false
      state.gas = null
      state.error = action.payload
    },
  },
})

export const { fetchingGasBalance, fetchedGasBalance, failedFetchGasBalance } =
  gasBalanceSlice.actions

export default gasBalanceSlice.reducer

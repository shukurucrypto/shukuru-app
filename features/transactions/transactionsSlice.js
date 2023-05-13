import { createSlice } from '@reduxjs/toolkit'
import { API_URL } from '../../apiURL'
import axios from 'axios'

const initalState = {
  loading: false,
  transactions: [],
  error: '',
}

export const fetchTransactions = async (dispatch, userId) => {
  dispatch(fetchingTransactions())
  try {
    const result = await axios.get(`${API_URL}/txs/${userId}`)

    if (result.data.success) {
      dispatch(fetchedTransactions(result.data.data.transactions))
    }
  } catch (error) {
    console.log(error.message)
    dispatch(failedFetchTransactions(error.message))
  }
}

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: initalState,
  reducers: {
    fetchingTransactions: (state) => {
      state.loading = true
    },
    fetchedTransactions: (state, action) => {
      state.loading = false
      state.transactions = action.payload
      state.error = null
    },
    failedFetchTransactions: (state, action) => {
      state.loading = false
      state.transactions = null
      state.error = action.payload
    },
  },
})

export const {
  fetchingTransactions,
  fetchedTransactions,
  failedFetchTransactions,
} = transactionsSlice.actions

export default transactionsSlice.reducer

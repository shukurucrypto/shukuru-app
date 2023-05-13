import axios from 'axios'
import { API_URL } from './apiURL'

export const getTransactions = async (userId) => {
  const res = await axios.get(`${API_URL}/app/txs/${userId}`)
  console.log('====================================')
  console.log(res.data)
  console.log('====================================')
  return res.data
}

export const sendLightning = async (data) => {
  try {
    const result = await axios.post(`${API_URL}/send`, data, {
      headers: {
        Authorization: `Bearer ${userState.user.token}`,
      },
    })

    return result
  } catch (error) {
    return error
  }
}

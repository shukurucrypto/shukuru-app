import axios from 'axios'
import { API_URL } from '../apiURL'
import { useSelector } from 'react-redux'

const useSendPush = () => {
  const { token } = useSelector((state) => state.tokenState)
  const sendPush = async (data) => {
    try {
      const result = await axios.post(`${API_URL}/one-push/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return result.data
    } catch (error) {
      return error
    }
  }
  return { sendPush }
}

export default useSendPush

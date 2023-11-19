import axios from 'axios'
import { API_URL } from '../apiURL'
import { useSelector } from 'react-redux'

const useGetRequest = () => {
  const { token, bolt } = useSelector((state) => state.tokenState)

  let boltToken

  // Remove double quotes from bolt if they exist
  if (bolt && bolt.startsWith('"') && bolt.endsWith('"')) {
    boltToken = bolt.slice(1, -1)
  }

  const request = async (url) => {
    try {
      const result = await axios.get(`${API_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          bolt: boltToken,
        },
      })

      return result.data
    } catch (error) {
      return error
    }
  }

  return { request }
}

export default useGetRequest

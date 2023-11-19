import axios from 'axios'
import { API_URL } from '../apiURL'
import { useSelector } from 'react-redux'

const useGetPostRequest = () => {
  const { token, bolt } = useSelector((state) => state.tokenState)

  let boltToken

  // Remove double quotes from bolt if they exist
  if (bolt.startsWith('"') && bolt.endsWith('"')) {
    boltToken = bolt.slice(1, -1)
  }

  const request = async (data, url) => {
    try {
      const result = await axios.get(`${API_URL}${url}`, data, {
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

export default useGetPostRequest

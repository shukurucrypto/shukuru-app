import React, { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import Modal from 'react-native-modal'
import AppText from '../AppText'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { removeToken } from '../../features/token/tokenSlice'
import {
  failedFetchUser,
  fetchingUser,
  removeUser,
} from '../../features/user/userSlice'
import { removeProfile } from '../../features/profile/profileSlice'
import axios from 'axios'
import { API_URL } from '../../apiURL'

function ResetAccModal({ isModalVisible, setModalVisible }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await axios.delete(`${API_URL}/user/delete`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      logoutUser()

      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const logoutUser = async () => {
    try {
      await AsyncStorage.clear()
      dispatch(removeToken())
      dispatch(removeUser())
      dispatch(removeProfile())
      dispatch(fetchingUser())
    } catch (error) {
      console.log(error)
      dispatch(failedFetchUser())
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={isModalVisible}>
        {loading ? (
          <ActivityIndicator color="#FBC609" />
        ) : (
          <View className="flex items-center p-5 bg-white rounded-md justify-evenly ">
            <AppText classProps="text-2xl font-bold">Are your sure?</AppText>
            <AppText classProps="text-lg text-center font-meduim my-4">
              By Proceeding, you risk loosing all your funds
            </AppText>

            <AppText classProps="text-lg text-center font-meduim mb-3">
              Nobody, not even Shukuru, will be able to recover your account
            </AppText>

            <View className="flex flex-row items-center w-full py-4 justify-evenly">
              <Pressable onPress={() => setModalVisible(false)}>
                <Text className="text-lg font-bold text-neutral-600">
                  Cancel
                </Text>
              </Pressable>

              <Pressable onPress={handleDelete}>
                <Text className="text-lg font-bold text-red-400">Continue</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
    </View>
  )
}

export default ResetAccModal

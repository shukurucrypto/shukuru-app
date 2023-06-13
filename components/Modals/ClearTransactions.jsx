import React, { useState } from 'react'
import { ActivityIndicator, Button, Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import AppText from '../AppText'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { API_URL } from '../../apiURL'

function ClearTransactions({
  isModalVisible,
  setModalVisible,
  refresh,
  goBack,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { user } = useSelector((state) => state.user)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await axios.delete(`${API_URL}/tx/clear`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      setModalVisible(false)

      refresh()

      goBack()

      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  return (
    <Modal isVisible={isModalVisible}>
      {loading ? (
        <ActivityIndicator color="#FBC609" />
      ) : (
        <View className="flex items-center p-5 bg-white rounded-md justify-evenly ">
          <AppText classProps="text-2xl font-bold">Are your sure?</AppText>
          <AppText classProps="text-lg text-center font-meduim my-4">
            You're about to clear all your transactions history book
          </AppText>

          <View className="flex flex-row items-center w-full py-4 justify-evenly">
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-lg font-bold text-neutral-600">Cancel</Text>
            </Pressable>

            <Pressable onPress={handleDelete}>
              <Text className="text-lg font-bold text-red-400">Clear</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  )
}

export default ClearTransactions

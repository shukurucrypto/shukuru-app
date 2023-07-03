import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import React, { useEffect, useState } from 'react'
import ActionSheet from 'react-native-actions-sheet'

import AppText from '../AppText'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { API_URL } from '../../apiURL'

const FillUpGasSheet = ({
  filltopUpGasSheet,
  selected,
  refresh,
  closeSheet,
  token,
  userId,
}) => {
  const navigation = useNavigation()
  const height = useWindowDimensions().height

  const [loading, setLoading] = useState(false)

  const [success, setSuccess] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    try {
      const data = {
        asset: selected,
        userId: userId,
      }

      const res = await axios.post(`${API_URL}/gas/request`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.data.success) {
        setLoading(false)
        setSuccess(true)
      } else {
        setLoading(false)
      }

      setSuccess(false)
      // closeSheet()
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      setSuccess(false)
    }
  }

  const navigate = () => {
    closeSheet()
    if (selected === 'CELO') {
      navigation.navigate('ReceiveTerminal', {
        token: 'CELO',
        refresh: refresh,
        msg: 'Make sure your sending CELO to this address',
      })
    } else {
      navigation.navigate('ReceiveTerminal', {
        token: 'BNB',
        refresh: refresh,
        msg: 'Make sure your sending BNB to this address',
      })
    }
  }
  return (
    <ActionSheet
      ref={filltopUpGasSheet}
      containerStyle={{
        height: height / 3,
        padding: 20,
        position: 'relative',
      }}
    >
      <>
        {/* Sheet header */}
        <View className="flex flex-row items-center justify-between w-full mb-3">
          <AppText classProps="text-xl font-bold">
            How do you want to fill up {selected} gas?
          </AppText>
        </View>

        <View className="relative flex flex-col flex-1 gap-4 py-5">
          <Pressable
            onPress={navigate}
            className="flex flex-row items-center justify-between p-2 py-3 rounded-md bg-neutral-100"
          >
            <Text className="text-lg ">Let me top up myself</Text>
            <Feather name="arrow-right" size={22} />
          </Pressable>

          <Pressable
            onPress={handleSend}
            className="flex flex-row items-center justify-between p-2 py-3 rounded-md bg-neutral-100"
          >
            <Text className="text-lg ">Top up for me</Text>
            {loading ? (
              <ActivityIndicator size={22} color="black" />
            ) : (
              <Feather name="arrow-right" size={22} />
            )}
          </Pressable>

          {success && (
            <View className="absolute left-0 w-full p-2 bg-green-300 rounded-md bottom-6">
              <Text className="font-bold text-center text-green-700">
                Request sent!
              </Text>
            </View>
          )}
        </View>
      </>
    </ActionSheet>
  )
}

export default FillUpGasSheet

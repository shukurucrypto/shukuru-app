import { View, Text, Image, Pressable } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  failedFetchProfile,
  fetchedProfile,
  fetchingProfile,
} from '../features/profile/profileSlice'
import { API_URL } from '../apiURL'

const AppHeader = ({ refresh }) => {
  const dispatch = useDispatch()

  const profile = useSelector((state) => state.profile)
  const userState = useSelector((state) => state.user)

  const navigation = useNavigation()

  useEffect(() => {
    if (!profile.profile) {
      fetchProfile()
      return
    }
  }, [])

  const fetchProfile = async () => {
    dispatch(fetchingProfile())
    try {
      const result = await axios.get(`${API_URL}/user/${userState.user.userId}`)

      if (result.data.success) {
        dispatch(fetchedProfile(result.data.data))
      }
    } catch (error) {
      dispatch(failedFetchProfile(error.message))
    }
  }

  return (
    <View className="flex flex-row items-center justify-between w-full h-16 px-5 bg-neutral-50">
      <Pressable
        onPress={() => navigation.navigate('ProfileScreen')}
        className="flex items-center justify-center bg-blue-300 rounded-full h-9 w-9"
      >
        {profile.profile && (
          <Text className="text-lg font-bold text-white">
            {profile?.profile?.name?.slice(0, 2)}
          </Text>
        )}
      </Pressable>

      <Image
        source={require('../assets/logos/logo.png')}
        style={{
          width: 35,
          height: 35,
        }}
      />

      <Pressable
        onPress={() =>
          navigation.navigate('ScanQRScreen', { refresh: refresh })
        }
        // onPress={() => navigation.navigate('ReadInvoiceScreen')}
        className="flex items-start justify-center"
      >
        <MaterialCommunityIcons name="line-scan" size={22} color="black" />
      </Pressable>
    </View>
  )
}

export default AppHeader

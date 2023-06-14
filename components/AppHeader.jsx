import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import React, { useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  failedFetchProfile,
  fetchProfile,
  fetchedProfile,
  fetchingProfile,
} from '../features/profile/profileSlice'
import { API_URL } from '../apiURL'

const AppHeader = ({ refresh }) => {
  const dispatch = useDispatch()

  const profile = useSelector((state) => state.profile)
  const userState = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    if (!profile.profile) {
      fetchProfile(dispatch, userState.user.userId)
      return
    }
  }, [])

  const sendVerificationCode = async () => {
    setLoading(true)
    try {
      const data = {
        phoneNumber: profile.profile.phoneNumber,
      }

      const res = await axios.post(`${API_URL}/verify`, data, {
        headers: {
          Authorization: `Bearer ${userState.user.token}`,
        },
      })

      if (res.data.success) {
        setLoading(false)
        navigation.navigate('VerifyScreen', { automatic: false })
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      setError(error.message)
    }
  }

  if (!profile?.profile?.verified && !userState.loading && !profile.loading)
    return navigation.navigate('VerifyScreen', { automatic: true })

  return (
    <>
      <View className="flex flex-row items-center justify-between w-full h-16 px-5 bg-neutral-100">
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
      {!profile?.profile?.verified &&
        !userState.loading &&
        !profile.loading && (
          <Pressable
            onPress={sendVerificationCode}
            // onPress={handleCheck}
            // onPress={() => navigation.navigate('VerifyScreen')}
            disabled={loading}
            className="flex flex-row items-center justify-center w-full p-2 bg-orange-600"
          >
            {loading ? (
              <View className="flex flex-row items-center">
                <ActivityIndicator size={15} color="#fff" />

                <Text className="mx-2 text-white">
                  Sending code to +{profile.profile.phoneNumber}
                </Text>
              </View>
            ) : (
              <View className="flex flex-row items-center">
                <Entypo name="info-with-circle" color="white" size={15} />
                <Text className="mx-2 text-white">
                  Verify your phone number
                </Text>
              </View>
            )}
          </Pressable>
        )}
    </>
  )
}

export default AppHeader

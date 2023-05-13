import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppText from '../components/AppText'
import QRCODE from '../components/QRCode'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
  failedFetchUser,
  fetchingUser,
  removeUser,
} from '../features/user/userSlice'
import axios from 'axios'
import { API_URL } from '../apiURL'
import { removeProfile } from '../features/profile/profileSlice'

const ProfileScreen = () => {
  const dispatch = useDispatch()

  const { loading, profile, error } = useSelector((state) => state.profile)

  const navigation = useNavigation()

  const logoutUser = async () => {
    try {
      await AsyncStorage.clear()
      dispatch(removeUser())
      dispatch(removeProfile())
      dispatch(fetchingUser())
    } catch (error) {
      console.log(error)
      dispatch(failedFetchUser())
    }
  }

  return (
    <View className="flex flex-col flex-1 p-5">
      <View className="flex flex-row items-center justify-between w-full">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center"
        >
          <SimpleLineIcons name="arrow-left" size={22} color="black" />
          <AppText classProps="text-2xl font-bold mx-4">Profile</AppText>
        </Pressable>

        <AntDesign name="setting" size={22} color="black" />
      </View>

      {loading ? (
        <ActivityIndicator size={22} color="black" />
      ) : (
        <>
          {/*  */}
          <View className="flex items-center justify-center flex-1">
            <View className="bg-orange-400 rounded-full w-28 h-28" />

            <AppText classProps="text-xl my-4 font-bold">
              @{profile.name}
            </AppText>
            <AppText classProps="text-base font-light">{profile.email}</AppText>
            <Text className="text-sm text-primary">
              {profile?.address?.slice(0, 4)} .... {profile?.address?.slice(-4)}
            </Text>

            <TouchableOpacity onPress={() => {}}>
              <Text className="text-sm font-light text-red-500 ">
                Change currency{' '}
                <AppText classProps="font-bold">({profile.country})</AppText>
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex items-center flex-1 justify-evenly">
            <QRCODE />

            <Pressable onPress={logoutUser} className="p-5">
              <Text className="text-lg text-red-600">Signout</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  )
}

export default ProfileScreen

import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import React from 'react'
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
import { removeProfile } from '../features/profile/profileSlice'
import { removeToken } from '../features/token/tokenSlice'

const ProfileScreen = () => {
  const dispatch = useDispatch()

  const { loading, profile, error } = useSelector((state) => state.profile)

  const navigation = useNavigation()

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
    <View className="flex flex-col flex-1 p-5">
      <View className="flex flex-row items-center justify-between w-full">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center"
        >
          <SimpleLineIcons name="arrow-left" size={22} color="black" />
          <AppText classProps="text-xl font-bold mx-4">Profile</AppText>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('SettingsScreen')}>
          <AntDesign name="setting" size={22} color="black" />
        </Pressable>
      </View>

      {loading && !profile ? (
        <ActivityIndicator size={22} color="black" />
      ) : (
        <>
          {/*  */}
          <View className="flex items-center justify-center flex-1 p-5 ">
            <View className="w-20 h-20 rounded-full bg-neutral-200">
              <Image
                source={require('../assets/illustrations/Owl.png')}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>

            <AppText classProps="text-xl my-2 font-bold">
              @{profile?.name}
            </AppText>

            {profile?.email && (
              <View className="flex flex-row items-center justify-center p-2 px-8 my-4 rounded-full bg-neutral-100">
                <Feather name="link" size={14} />
                <AppText classProps=" ml-3 text-base font-light">
                  {profile?.email}
                </AppText>
              </View>
            )}
            {/* <Text className="my-2 text-sm text-purple-600">
              {profile?.address?.slice(0, 4)} .... {profile?.address?.slice(-4)}
            </Text> */}

            <TouchableOpacity onPress={() => {}}>
              <Text className="text-sm font-light text-red-500 ">
                Change currency{' '}
                <AppText classProps="font-bold">({profile?.country})</AppText>
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex items-center justify-center flex-1 p-6 ">
            <QRCODE data={profile?.address} />
          </View>

          <View className="flex items-center justify-evenly">
            <Pressable
              onPress={logoutUser}
              className="flex items-center justify-center w-full p-3 mt-4 rounded-full bg-neutral-100"
            >
              <Text className="text-lg text-red-600">Signout</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  )
}

export default ProfileScreen

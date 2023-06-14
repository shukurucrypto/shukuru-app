import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import React, { useCallback, useEffect, useState } from 'react'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import AppText from '../components/AppText'
import axios from 'axios'
import { API_URL } from '../apiURL'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCheckreward } from '../features/rewards/rewardsSlice'
import { fetchBalance } from '../features/balances/balancesSlice'
import { fetchTransactions } from '../features/transactions/transactionsSlice'
import {
  failedFetchProfile,
  fetchProfile,
  fetchedProfile,
  fetchingProfile,
} from '../features/profile/profileSlice'

const VerifyScreen = () => {
  const { user } = useSelector((state) => state.user)
  const { profile } = useSelector((state) => state.profile)

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(null)
  const [error, setError] = useState(null)

  const [loadCode, setLoadCode] = useState(false)

  const navigation = useNavigation()

  useEffect(() => {
    // if (automatic) {
    const send = async () => await sendVerificationCode()
    send()
    // }
  }, [])

  const handleSubmit = async () => {
    if (!code || code.length != 6) {
      return Alert.alert(
        'Invalid code length',
        'Make sure you enter a 6 digit code sent to your phone',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      )
    }
    setLoading(true)
    try {
      const data = {
        phoneNumber: user.phone,
        code: code,
      }

      const res = await axios.post(`${API_URL}/code`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (res.data.success) {
        setCode(null)

        fetchProfile(dispatch, user.userId)

        navigation.navigate('Home')
      }

      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      setError(error.message)
    }
  }

  const sendVerificationCode = async () => {
    // setLoading(true)
    setLoadCode(true)
    try {
      const data = {
        phoneNumber: user.phone,
      }

      const res = await axios.post(`${API_URL}/verify`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (res.data.success) {
        // setLoading(false)
        setLoadCode(false)
        // navigation.navigate('VerifyScreen')
      } else {
        // setLoading(false)
        setLoadCode(false)
      }
    } catch (error) {
      console.log(error.message)
      // setLoading(false)
      setLoadCode(false)
      setError(error.message)
    }
  }

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        e.preventDefault()

        if (!profile.verified) {
          return
        }

        // Prevent default behavior of leaving the screen
        // navigation.dispatch(e.data.action)
      }),
    [navigation, profile?.verified]
  )

  // if (loadCode)
  //   return (
  //     <View className="flex items-center justify-center flex-1 ">
  //       <AppText classProps="text-sm text-center">Sending code...</AppText>
  //     </View>
  //   )

  if (loading)
    return (
      <View className="flex items-center justify-center flex-1 ">
        <ActivityIndicator size={40} color="#FBC609" />
        <AppText classProps="text-sm text-center">Verifying phone</AppText>
        <AppText classProps="text-sm text-center">Please wait...</AppText>
      </View>
    )

  return (
    <ScrollView className="flex flex-1 ">
      <View className="flex flex-1">
        <View className="flex flex-row items-center justify-between w-full h-20 px-4"></View>

        {/*  */}
        <View className="flex items-center flex-1 py-8">
          <AppText classProps="text-2xl font-bold text-center">
            Enter the 6-digit code we texted to +
            {user?.phone?.slice(0, 3) + '-XXX-XXX-' + user?.phone?.slice(-2)}
          </AppText>

          <AppText classProps="my-8">
            This verifies human identity onchain using MASA-FI
          </AppText>

          <View className="flex items-center w-full px-4 py-5 justify-evenly bg-neutral-50 ">
            <View className="flex flex-row items-center justify-between flex-1">
              <View className="flex items-center justify-center">
                <SimpleLineIcons
                  name="screen-smartphone"
                  size={55}
                  color="#6b7280"
                />
              </View>
              <View className="flex flex-1 p-4">
                <Text className="font-bold text-gray-500">
                  Enter 6-code verification code:
                </Text>
                <TextInput
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={(e) => setCode(e)}
                  placeholder="6-digit Code"
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                  className="w-full p-2 px-3 text-black text-base bg-white border-[0.8px] border-neutral-200 my-2"
                />
              </View>
            </View>

            {loadCode ? (
              <View className="mb-5">
                <ActivityIndicator size={18} color="#FBC609" />
              </View>
            ) : (
              <Pressable onPress={sendVerificationCode} className="mb-5">
                <Text className="text-blue-500 ">
                  Did't see the code? Resend
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={loading || loadCode}
              className="flex items-center w-full p-4 rounded-md bg-primary"
            >
              <Text className="font-bold text-black">VERIFY</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default VerifyScreen

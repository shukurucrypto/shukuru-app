import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
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
import AsyncStorage from '@react-native-async-storage/async-storage'

const VerifyPhone = () => {
  const { user } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(null)
  const [error, setError] = useState(null)

  const router = useRoute()

  const { user: userData, token, phone } = router.params

  const navigation = useNavigation()

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

        storeToken(res.data.data.token)
      }

      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      setError(error.message)
    }
  }

  const storeToken = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@token', jsonValue)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  const onRefresh = () => {
    fetchProfile(dispatch, user.userId)
  }

  if (loading)
    return (
      <View className="flex items-center justify-center flex-1 ">
        <ActivityIndicator size={40} color="#FBC609" />
        <AppText classProps="text-sm text-center">Verifying phone</AppText>
        <AppText classProps="text-sm text-center">Please wait...</AppText>
      </View>
    )

  return (
    <SafeAreaView className="flex flex-1 ">
      <View className="flex flex-1">
        <View className="flex flex-row items-center justify-between w-full h-20 px-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <SimpleLineIcons name="arrow-left" size={22} color="black" />
            <Text className="mx-3 text-lg font-medium text-black">Back</Text>
          </Pressable>
        </View>

        {/*  */}
        <View className="flex items-center flex-1 py-8">
          <AppText classProps="text-2xl font-bold text-center">
            Enter the 6-digit code we texted to +
            {user?.phone?.slice(0, 3) + '-XXX-XXX-' + user?.phone?.slice(-2)}
          </AppText>

          <AppText classProps="my-8">
            This Verifies human identity onchain using MASA-FI
          </AppText>

          <View className="flex items-center w-full px-4 py-5 justify-evenly bg-neutral-50 h-1/3">
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
                  className="w-full p-4 text-black text-base bg-white border-[0.8px] border-neutral-200 my-2"
                />
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="flex items-center w-full p-4 rounded-md bg-primary"
            >
              <Text className="font-bold text-black">VERIFY</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default VerifyPhone

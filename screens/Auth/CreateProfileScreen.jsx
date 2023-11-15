import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppText from '../../components/AppText'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import { API_URL } from '../../apiURL'
import { useDispatch } from 'react-redux'
import {
  failedFetchUser,
  fetchedUser,
  fetchingUser,
} from '../../features/user/userSlice'

const CreateProfileScreen = () => {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState(null)
  const [email, setEmail] = useState(null)
  const [error, setError] = useState(null)

  const [country, setCountry] = useState({
    currency: 'UGX',
    code: '+256',
  })

  const route = useRoute()

  const navigation = useNavigation()

  const phoneRef = useRef(null)
  const emailRef = useRef(null)

  const dispatch = useDispatch()

  const { values, accountType } = route.params

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    dispatch(fetchingUser())
    try {
      if (!phone) {
        setError('Please connect your phone to continue')
        return
      }

      let phoneWithoutZero

      // Remove first "0" if it exists
      if (phone.charAt(0) === '0') {
        phoneWithoutZero = phoneNumber.slice(1)
      } else {
        phoneWithoutZero = phone
      }

      const userPhone = country.code + phoneWithoutZero
      const cleanedPhone = cleanPhoneNumber(userPhone)

      const data = {
        username: values.username.trim(),
        email: email,
        phone: cleanedPhone,
        password: values.password,
        accountType: accountType,
        country: country.currency,
      }
      const res = await axios.post(`${API_URL}/auth/signup`, data)

      if (res.data.success) {
        setPhone(null)
        setEmail(null)
        // console.log(res.data.data.token)
        storeToken(res.data.data.token, res.data.data.bolt)

        // storeToken(res.data.data.token)
        dispatch(fetchedUser(res.data.data))
      } else {
        // console.log(res.data.response)
        setError(res.data.response)
        dispatch(failedFetchUser(res.data.response))
      }
      setLoading(false)
    } catch (error) {
      dispatch(failedFetchUser('OOPs! Something went wrong'))
      console.log(error.message)
      setError('Something went wrong!')
      setLoading(false)
    }
  }

  function cleanPhoneNumber(phoneNumber) {
    // Remove "+" character
    phoneNumber = phoneNumber.replace(/\+/g, '')

    // Remove spaces
    phoneNumber = phoneNumber.replace(/\s/g, '')

    // Remove first "0" if it exists
    if (phoneNumber.charAt(0) === '0') {
      phoneNumber = phoneNumber.slice(1)
    }

    return phoneNumber
  }

  // const storeToken = async (value) => {
  //   try {
  //     const jsonValue = JSON.stringify(value)
  //     await AsyncStorage.setItem('@token', jsonValue)
  //   } catch (e) {
  //     // saving error
  //     console.log(e)
  //   }
  // }

  const storeToken = async (value, bolt) => {
    try {
      const jsonValue = JSON.stringify(value)
      const boltToken = JSON.stringify(bolt)

      await AsyncStorage.setItem('@token', jsonValue)
      await AsyncStorage.setItem('@bolt', boltToken)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  const handleNext = (nextInputRef) => {
    if (nextInputRef && nextInputRef.current) {
      nextInputRef.current.focus()
    }
  }

  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-col flex-1 p-5">
        <ScrollView className="flex flex-1">
          <View className="flex flex-col justify-between flex-1">
            {/* Header */}
            <View className="flex flex-col py-3 mb-8">
              <AppText classProps="text-2xl font-bold">
                Connect your phone
              </AppText>
              <AppText classProps="text-base">
                You can connect your email or phone to access Shukuru USSD
                services
              </AppText>
            </View>

            {error && <Text className="text-center text-red-600">{error}</Text>}

            <View className="flex flex-col flex-1">
              {/* Username */}
              <View className="flex flex-col py-3 mb-5">
                <AppText classProps="text-lg font-bold">Phone</AppText>

                <View className="flex flex-row items-center flex-1">
                  <Pressable
                    onPress={() =>
                      navigation.navigate('AuthSelectCountryScreen', {
                        setCountry,
                      })
                    }
                    className="flex items-center justify-center h-16 px-3 mt-3 "
                  >
                    <AppText classProps="text-lg font-bold">
                      {country.code}
                    </AppText>
                  </Pressable>
                  <TextInput
                    ref={phoneRef}
                    placeholder="xxxxxx"
                    className="border-[0.8px] mt-3 h-16 text-base rounded-lg p-4 border-neutral-300 w-full text-black"
                    disabled={loading}
                    autoCapitalize="none"
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                    returnKeyType="next"
                    onSubmitEditing={() => handleNext(emailRef)}
                  />
                </View>
              </View>

              {/* Email */}
              <View className="flex flex-col flex-1 py-3">
                <AppText classProps="text-lg font-bold">
                  Email (Optional)
                </AppText>

                <TextInput
                  ref={emailRef}
                  placeholder="example@mail.com"
                  keyboardType="email-address"
                  disabled={loading}
                  autoCapitalize="none"
                  className="border-[0.8px] mt-3 h-16 text-base rounded-lg p-4 border-neutral-300 relative text-black"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                />
              </View>
            </View>

            <AppText classProps="mt-5 font-light">
              By tapping "Agree" you agree to the{' '}
              <Text className="font-bold text-primary">Terms of service</Text>,
              and <Text className="font-bold text-primary">Privacy Notice</Text>
            </AppText>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="flex items-center p-5 mt-8 rounded-full bg-primary"
            >
              {loading ? (
                <ActivityIndicator size={18} color="#fff" />
              ) : (
                <AppText classProps="text-xl font-bold">Agree</AppText>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default CreateProfileScreen

import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import BackHeader from '../../components/Headers/BackHeader'
import AppText from '../../components/AppText'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { API_URL } from '../../apiURL'
import axios from 'axios'

const EnterOTPScreen = () => {
  const [loading, setLoading] = useState(false)
  const [otp, setOTP] = useState('')
  const [error, setError] = useState('')

  const { token } = useSelector((state) => state.tokenState)

  const navigation = useNavigation()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!otp) {
        setError('Please enter the OTP code')
        setLoading(false)
        return
      }

      const data = {
        code: otp,
      }

      const res = await axios.post(`${API_URL}/verify/otp`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.data.success) {
        setOTP('')
        setLoading(false)
        navigation.navigate('NewPassword', { code: otp })
        return
      } else {
        setLoading(false)
        setError('Invalid code entered')
      }
      // Perform validation and OTP verification here

      // If the OTP is valid, you can proceed to the next step

      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError('Bad Request. Check your code.')
    }
  }

  return (
    <View className="flex flex-1">
      <BackHeader />
      <View className="p-5">
        <AppText classProps="text-lg font-bold">Enter the 6-word OTP</AppText>
        <View className="my-4">
          <Text className="mt-4 font-light text-black">
            Please enter the OTP code you received in your email
          </Text>
          <TextInput
            placeholder="Enter OTP"
            className="p-4 my-2 rounded-md bg-neutral-100"
            placeholderTextColor="#d6d6d4"
            keyboardType="default"
            autoCapitalize="none"
            autoComplete="off"
            value={otp}
            onChangeText={(e) => setOTP(e)}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        </View>
        {error ? (
          <Text className="text-center text-red-500">{error}</Text>
        ) : null}
        <Pressable
          disabled={loading || otp.length !== 6}
          onPress={handleSubmit}
          className={`items-center p-4 my-4 rounded-md ${
            loading || otp.length !== 6 ? 'bg-neutral-100' : 'bg-primary'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#FBC609" />
          ) : (
            <Text
              className={`font-bold text-sm ${
                otp.length !== 6 ? 'text-neutral-300' : 'text-black'
              } `}
            >
              Confirm
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}

export default EnterOTPScreen

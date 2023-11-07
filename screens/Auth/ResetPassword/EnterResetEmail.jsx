import React, { useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import BackHeader from '../../../components/Headers/BackHeader'
import AppText from '../../../components/AppText'
import axios from 'axios'
import { API_URL } from '../../../apiURL'
import { useNavigation } from '@react-navigation/native'

const EnterResetEmailScreen = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const navigation = useNavigation()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      if (!email) {
        return
      }

      const data = {
        email,
      }

      const res = await axios.post(`${API_URL}/send/raw/otp`, data)

      if (res.data.success) {
        setEmail('')
        setLoading(false)
        navigation.navigate('ResetOTP', { email })
        return
      } else {
        setError(res.data.response)
      }
    } catch (error) {
      setLoading(false)
      setError('Bad Request. Check your email')
    }
  }

  return (
    <SafeAreaView className="flex flex-1">
      <BackHeader />

      <View className="p-5">
        <AppText classProps="text-lg font-bold">
          Send reset Code to my email
        </AppText>

        <View className="my-4">
          <Text className="mt-4 font-light text-black">
            Enter your email address
          </Text>

          <TextInput
            placeholder="example@gmail.com"
            className="p-4 my-2 rounded-md bg-neutral-100"
            keyboardType="email-address"
            value={email}
            onChangeText={(e) => setEmail(e)}
            onSubmitEditing={handleSubmit}
            autoCapitalize="none"
            returnKeyType="done"
          />
        </View>

        {error && (
          <Text className="text-xs text-center text-red-500">{error}</Text>
        )}

        <Pressable
          disabled={loading || email.length <= 3}
          onPress={handleSubmit}
          className={`items-center p-4 my-4 rounded-md ${
            loading || email.length <= 3 ? 'bg-neutral-100' : ' bg-primary'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#FBC609" />
          ) : (
            <Text
              className={`font-bold ${
                email.length <= 3 ? 'text-neutral-300' : 'text-black'
              } `}
            >
              Confirm
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default EnterResetEmailScreen

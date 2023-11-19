import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import BackHeader from '../../components/Headers/BackHeader'
import AppText from '../../components/AppText'
import axios from 'axios'
import { API_URL } from '../../apiURL'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import UnlockSheet from '../../components/Sheets/Lock/UnlockSheet'

const ChangePasswordScreen = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const { token } = useSelector((state) => state.tokenState)

  const navigation = useNavigation()

  const actionSheetRef = useRef(null)

  useEffect(() => {
    actionSheetRef?.current.show()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (!email) {
        return
      }

      const data = {
        email,
      }

      const res = await axios.post(`${API_URL}/send/otp`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.data.success) {
        setEmail('')
        setLoading(false)
        navigation.navigate('EnterOTP')
        return
      }
    } catch (error) {
      setLoading(false)
      setError('Something went very wrong')
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
            placeholderTextColor="#d6d6d4"
            className="p-4 my-2 rounded-md bg-neutral-100 "
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(e) => setEmail(e)}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        </View>

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
              className={`font-bold text-sm ${
                email.length <= 3 ? 'text-neutral-300' : 'text-black'
              } `}
            >
              Confirm
            </Text>
          )}
        </Pressable>
      </View>
      <UnlockSheet actionSheetRef={actionSheetRef} />
    </SafeAreaView>
  )
}

export default ChangePasswordScreen

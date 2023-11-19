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
import axios from 'axios'
import { API_URL } from '../../apiURL'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { removeToken } from '../../features/token/tokenSlice'
import {
  failedFetchUser,
  fetchingUser,
  removeUser,
} from '../../features/user/userSlice'
import { removeProfile } from '../../features/profile/profileSlice'

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
})

const NewPasswordScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { token } = useSelector((state) => state.tokenState)

  const dispatch = useDispatch()

  const { code } = route.params

  const handleSubmit = async (values) => {
    setLoading(true)

    try {
      const data = {
        code,
        password: values.password,
      }
      const res = await axios.post(`${API_URL}/reset/password`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.data.success) {
        setLoading(false)
        // navigation.navigate('Home')
        logoutUser()
      } else {
        setError('Password reset failed. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      setError('Password reset failed. Please try again.')
      setLoading(false)
    }
  }

  const logoutUser = async () => {
    try {
      await AsyncStorage.clear()
      dispatch(removeToken())
      dispatch(removeUser())
      dispatch(removeProfile())
      dispatch(fetchingUser())
    } catch (error) {
      dispatch(failedFetchUser())
    }
  }

  return (
    <View className="flex flex-1">
      <BackHeader />
      <View className="p-5">
        <AppText classProps="text-lg font-bold">Enter New Password</AppText>

        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            isValid,
            dirty,
            touched,
          }) => (
            <>
              <View className="my-4">
                <Text className="mt-4 font-light text-black">New Password</Text>
                <TextInput
                  placeholder="New Password"
                  placeholderTextColor="#d6d6d4"
                  secureTextEntry={true}
                  className="p-4 my-2 rounded-md bg-neutral-100"
                  value={values.password}
                  onChangeText={handleChange('password')}
                />
                {errors.password && touched.password && (
                  <Text className="text-xs text-red-600">
                    {errors.password}
                  </Text>
                )}
              </View>

              <View>
                <Text className="font-light text-black ">Confirm Password</Text>
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#d6d6d4"
                  secureTextEntry={true}
                  className="p-4 my-2 rounded-md bg-neutral-100"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text className="text-xs text-red-600">
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>

              {error ? (
                <Text className="text-xs text-center text-red-600">
                  {error}
                </Text>
              ) : null}

              <Pressable
                // disabled={!isValid || !dirty || loading}
                onPress={handleSubmit}
                className={`items-center p-4 my-4 rounded-md ${
                  loading ? 'bg-neutral-100' : 'bg-primary'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#FBC609" />
                ) : (
                  <Text
                    className={`font-bold text-sm ${
                      error ? 'text-red-600' : 'text-black'
                    }`}
                  >
                    Reset Password
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </Formik>
      </View>
    </View>
  )
}

export default NewPasswordScreen

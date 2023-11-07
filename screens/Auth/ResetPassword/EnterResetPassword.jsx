import axios from 'axios'
import { Formik } from 'formik'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import * as yup from 'yup'
import { API_URL } from '../../../apiURL'
import AppText from '../../../components/AppText'
import BackHeader from '../../../components/Headers/BackHeader'

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

const EnterResetPassword = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { code, email } = route.params

  const handleSubmit = async (values) => {
    setLoading(true)

    try {
      const data = {
        code,
        password: values.password,
        email,
      }
      const res = await axios.post(`${API_URL}/reset/raw/password`, data)

      if (res.data.success) {
        setLoading(false)
        navigation.navigate('LoginScreen')
      } else {
        setError('Password reset failed. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      setError('Password reset failed. Please try again.')
      setLoading(false)
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
                  secureTextEntry={true}
                  className="p-4 my-2 rounded-md bg-neutral-100"
                  value={values.password}
                  autoCapitalize="none"
                  autoComplete="off"
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
                  secureTextEntry={true}
                  className="p-4 my-2 rounded-md bg-neutral-100"
                  value={values.confirmPassword}
                  autoCapitalize="none"
                  autoComplete="off"
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
                className={`items-center p-4 my-5 rounded-md ${
                  loading ? 'bg-neutral-100' : 'bg-primary'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#FBC609" />
                ) : (
                  <Text
                    className={`font-bold ${
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

export default EnterResetPassword

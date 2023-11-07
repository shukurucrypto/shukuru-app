import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import React, { useRef, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import * as Yup from 'yup'

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { useDispatch } from 'react-redux'
import { API_URL } from '../../apiURL'
import AppText from '../../components/AppText'
import {
  failedFetchUser,
  fetchedUser,
  fetchingUser,
} from '../../features/user/userSlice'

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .matches(
      /^[a-zA-Z0-9_]*$/,
      'Username must not contain special characters or spaces'
    ),
  password: Yup.string().required('Password is required'),
})

const LoginScreen = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigation = useNavigation()

  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()

  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  const [show, setShow] = useState(true)

  const handleSubmit = async (values) => {
    setError(null)
    setLoading(true)

    dispatch(fetchingUser())
    try {
      const data = {
        username: values.username.trim(),
        password: values.password,
      }

      const res = await axios.post(`${API_URL}/auth/login`, data)

      if (res.data.success) {
        storeToken(res.data.data)
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

  const storeToken = async (value) => {
    try {
      const jsonValue = JSON.stringify(value.token)
      await AsyncStorage.setItem('@token', jsonValue)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  const goToEnterEmail = () => navigation.navigate('EnterResetEmail')

  const handleNext = (nextInputRef) => {
    if (nextInputRef && nextInputRef.current) {
      nextInputRef.current.focus()
    }
  }

  return (
    <ScrollView className="flex flex-1">
      <View className="flex flex-col flex-1 p-5">
        <View className="flex flex-row items-center w-full mb-4 ">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex flex-row items-center flex-1"
          >
            <SimpleLineIcons name="arrow-left" size={20} color="black" />
            <AppText classProps="text-base font-bold mx-3">Back</AppText>
          </Pressable>
        </View>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // console.log(values)
            handleSubmit(values)
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View className="flex flex-col justify-between flex-1">
                {/* Header */}
                <View className="flex flex-col items-center justify-center py-8">
                  <Image
                    source={require('../../assets/logos/logo.png')}
                    style={{
                      width: 80,
                      height: 80,
                    }}
                  />
                </View>

                {error && (
                  <Text className="text-center text-red-600">{error}</Text>
                )}
                <View className="flex flex-col flex-1 mt-5">
                  {/* Username */}
                  <View className="flex flex-col py-3">
                    <AppText classProps="text-sm font-bold">Username</AppText>

                    <TextInput
                      ref={usernameRef}
                      placeholder="Enter your username"
                      className="w-full p-2 mt-3 text-base text-black rounded-lg h-14 bg-neutral-100 "
                      autoCapitalize="none"
                      disabled={loading}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username}
                      onSubmitEditing={() => handleNext(passwordRef)}
                      returnKeyType="next"
                    />

                    {touched.username && errors.username && (
                      <Text className="text-red-600">{errors.username}</Text>
                    )}
                  </View>

                  {/* Password */}
                  <View className="flex flex-col py-3">
                    <AppText classProps="text-sm font-bold">Password</AppText>

                    <TextInput
                      ref={passwordRef}
                      placeholder="Enter your password"
                      secureTextEntry={show}
                      // autoCapitalize={false}
                      autoCapitalize="none"
                      // className="border-[0.8px] mt-3 h-16 text-base text-black rounded-lg p-4 border-neutral-300 relative"
                      className="w-full p-2 mt-3 text-base text-black rounded-lg h-14 bg-neutral-100 "
                      disabled={loading}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      onSubmitEditing={handleSubmit}
                      returnKeyType="done"
                    />

                    <Pressable
                      onPress={() => setShow(!show)}
                      className="absolute right-4 bottom-8"
                    >
                      <Entypo
                        name={!show ? `eye` : `eye-with-line`}
                        size={16}
                        color="black"
                      />
                    </Pressable>

                    {touched.password && errors.password && (
                      <Text className="text-red-600">{errors.password}</Text>
                    )}
                  </View>

                  <Pressable
                    onPress={handleSubmit}
                    disabled={loading}
                    className="flex items-center p-4 my-5 rounded-md bg-primary"
                  >
                    {loading ? (
                      <ActivityIndicator size={22} color="#fff" />
                    ) : (
                      <AppText classProps="text-base font-bold">
                        Sign In
                      </AppText>
                    )}
                  </Pressable>

                  <Pressable onPress={goToEnterEmail}>
                    <Text className="text-base font-bold text-center text-primary">
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  )
}

export default LoginScreen

import { View, Text, ScrollView, TextInput, Pressable } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import SelectDropdown from 'react-native-select-dropdown'
import React, { useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../../components/AppText'

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be at most 15 characters')
    .matches(
      /^[a-zA-Z0-9_]*$/,
      'Username must not contain special characters or spaces'
    ),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})

const SignupScreen = () => {
  const navigation = useNavigation()

  const accType = ['Personal', 'Business']

  const [accountType, setAccountType] = useState('Personal')

  const usernameRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  const [show, setShow] = useState(false)

  const handleNext = (nextInputRef) => {
    if (nextInputRef && nextInputRef.current) {
      nextInputRef.current.focus()
    }
  }

  return (
    <View className="flex flex-col flex-1 p-5">
      <ScrollView className="flex flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-center w-full mb-4 ">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex flex-row items-center flex-1"
          >
            <SimpleLineIcons name="arrow-left" size={20} color="black" />
            <AppText classProps="text-base font-bold mx-3">Back</AppText>
          </Pressable>
        </View>

        {/* Header */}
        <View className="flex flex-col py-3 mb-8">
          <AppText classProps="text-lg font-bold">Create your account</AppText>
          <AppText classProps="text-sm">
            Select an account type and secure it with a User and password
          </AppText>
        </View>

        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            navigation.navigate('CreateProfileScreen', {
              values,
              accountType,
            })
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
              {/* Forms */}
              <View className="flex flex-col">
                <AppText classProps="text-sm font-bold">Account type</AppText>
                <SelectDropdown
                  data={accType}
                  onSelect={(selectedItem, index) => {
                    // console.log(selectedItem, index)
                    setAccountType(selectedItem)
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                  }}
                  buttonStyle={{
                    borderRadius: 12,
                    width: '100%',
                    marginVertical: 12,
                  }}
                />
              </View>

              {/* Username */}
              <View className="flex flex-col py-3">
                <AppText classProps="text-sm font-bold">Username</AppText>

                <TextInput
                  ref={usernameRef}
                  placeholder="Enter username"
                  placeholderTextColor="#d6d6d4"
                  onChangeText={handleChange('username')}
                  autoCapitalize="none"
                  onBlur={handleBlur('username')}
                  value={values.username}
                  className="w-full p-2 mt-3 text-base text-black rounded-lg h-14 bg-neutral-100 "
                  returnKeyType="next"
                  onSubmitEditing={() => handleNext(passwordRef)}
                />

                {touched.username && errors.username && (
                  <Text className="text-red-500">{errors.username}</Text>
                )}
              </View>

              {/* Password */}
              <View className="flex flex-col py-3">
                <AppText classProps="text-sm font-bold">Password</AppText>

                <View className="flex flex-col ">
                  <TextInput
                    ref={passwordRef}
                    placeholderTextColor="#d6d6d4"
                    placeholder="Enter Password"
                    secureTextEntry={show}
                    onChangeText={handleChange('password')}
                    autoCapitalize="none"
                    onBlur={handleBlur('password')}
                    value={values.password}
                    className="w-full p-2 mt-3 text-base text-black rounded-lg h-14 bg-neutral-100 "
                    returnKeyType="next"
                    onSubmitEditing={() => handleNext(confirmPasswordRef)}
                  />

                  <Pressable
                    onPress={() => setShow(!show)}
                    className="absolute right-0 flex items-center justify-center h-full p-4 pt-6 "
                  >
                    <Entypo
                      name={show ? `eye` : `eye-with-line`}
                      size={16}
                      color="black"
                    />
                  </Pressable>
                </View>

                {touched.password && errors.password && (
                  <Text className="text-red-600">{errors.password}</Text>
                )}
              </View>

              {/* Confirm Password */}
              <View className="flex flex-col py-3">
                <AppText classProps="text-sm font-bold">
                  Confirm Password
                </AppText>

                <TextInput
                  ref={confirmPasswordRef}
                  placeholder="Confirm Password"
                  secureTextEntry={show}
                  placeholderTextColor="#d6d6d4"
                  autoCapitalize="none"
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  className="w-full p-2 mt-3 text-base text-black rounded-lg h-14 bg-neutral-100 "
                  returnKeyType="next"
                  onSubmitEditing={handleSubmit}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text className="text-red-600">{errors.confirmPassword}</Text>
                )}
              </View>

              <Pressable
                onPress={handleSubmit}
                className="flex items-center p-4 my-5 rounded-md bg-primary"
              >
                <AppText classProps="text-lg font-bold">Continue</AppText>
              </Pressable>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  )
}

export default SignupScreen

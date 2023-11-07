import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import CreateProfileScreen from '../screens/Auth/CreateProfileScreen'
import EnterResetEmailScreen from '../screens/Auth/ResetPassword/EnterResetEmail'
import LoginScreen from '../screens/Auth/LoginScreen'
import SignupScreen from '../screens/Auth/SignupScreen'
import StartScreen from '../screens/Auth/StartScreen'
import AuthSelectCountry from '../screens/AuthSelectCountry'
import ResetOTPScreen from '../screens/Auth/ResetPassword/ResetOTPScreen'
import EnterResetPassword from '../screens/Auth/ResetPassword/EnterResetPassword'

const Stack = createNativeStackNavigator()

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen
        name="CreateProfileScreen"
        component={CreateProfileScreen}
      />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="AuthSelectCountryScreen"
        component={AuthSelectCountry}
      />
      <Stack.Screen name="EnterResetEmail" component={EnterResetEmailScreen} />
      <Stack.Screen name="ResetOTP" component={ResetOTPScreen} />
      <Stack.Screen name="EnterResetPassword" component={EnterResetPassword} />
    </Stack.Navigator>
  )
}

export default AuthNavigator

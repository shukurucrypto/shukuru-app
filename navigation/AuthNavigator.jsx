import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ReceiveTerminalScreen from '../screens/Terminals/RecieveTerminalScreen'
import SendTerminalScreen from '../screens/Terminals/SendTerminalScreen'
import StartScreen from '../screens/Auth/StartScreen'
import SignupScreen from '../screens/Auth/SignupScreen'
import CreateProfileScreen from '../screens/Auth/CreateProfileScreen'
import LoginScreen from '../screens/Auth/LoginScreen'
import SelectCountyScreen from '../screens/SelectCounty'

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
      <Stack.Screen name="SelectCountryScreen" component={SelectCountyScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator

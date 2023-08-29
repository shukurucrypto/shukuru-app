import { View, Text, SafeAreaView, StatusBar, Pressable } from 'react-native'
import React from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppText from '../../components/AppText'
import { useNavigation } from '@react-navigation/native'

const SuccessScreen = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView className="flex flex-1 ">
      <StatusBar backgroundColor="#FBC609" translucent />

      <AppText classProps="text-center mt-4 text-lg font-medium">
        Success
      </AppText>

      <View className="flex items-center justify-center flex-1">
        <Ionicons name="checkmark-circle" size={55} color="#FBC609" />

        <AppText classProps="text-xl my-4 font-bold">
          Your funds are on their way!
        </AppText>

        <View className="px-8 py-3">
          <AppText classProps="text-center text-base">
            Your transaction request has been sent & your funds will arrive in
            less than 12 hours.
          </AppText>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Home')}
          // onPress={() => {}}
          className="p-4 mt-4 rounded-full bg-neutral-100 px-7"
        >
          <AppText classProps="font-bold text-base">Continue</AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default SuccessScreen

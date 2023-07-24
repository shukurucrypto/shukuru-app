import React from 'react'
import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import Lottie from 'lottie-react-native'
import AppText from '../../components/AppText'
import { useNavigation } from '@react-navigation/native'

const TransactionFailed = () => {
  const navigation = useNavigation()
  return (
    <View className="flex flex-col flex-1 p-5 bg-primary">
      <View className="flex flex-col items-center justify-center flex-1 ">
        <Lottie
          source={require('../../assets/animations/failed.json')}
          autoPlay
          loop
        />
      </View>

      <View className="flex flex-col pb-2">
        {/* <Text className="text-2xl font-bold text-black">$BTC</Text> */}
        <Text className="text-5xl font-extrabold text-red-600 shadow-md">
          PAYMENT
        </Text>
        <Text className="text-5xl font-extrabold text-red-600 shadow-md">
          FAILED!
        </Text>

        <Pressable
          onPress={() => {}}
          className="w-full border-[0.8px] border-white rounded-md my-4 p-3 flex-row bg-yellow-400 h-20"
        >
          <View className="w-16 h-full mr-3 bg-blue-500 rounded-md" />
          <View className="flex flex-col flex-1">
            <Text className="text-base font-bold text-black">
              Utilities are coming to Shukuru
            </Text>
            <Text className="text-xs font-light text-black">
              Buy digital products using Bitcoin
            </Text>
          </View>
        </Pressable>
      </View>

      <View className="flex flex-row w-full">
        <Pressable
          onPress={() => navigation.navigate('Home')}
          className="flex flex-row items-center justify-center flex-1 p-2 my-4 ml-2 bg-blue-500 rounded-md h-14"
        >
          <Text className="text-xl font-bold text-white">Done</Text>
        </Pressable>
      </View>
    </View>
  )
}
export default TransactionFailed

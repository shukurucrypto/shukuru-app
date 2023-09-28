import React from 'react'
import { View, Text, Pressable, StatusBar, Image } from 'react-native'
import Lottie from 'lottie-react-native'
import AppText from '../../components/AppText'
import { useNavigation } from '@react-navigation/native'

const TransactionDone = ({ refresh, token }) => {
  const navigation = useNavigation()
  return (
    <>
      <StatusBar backgroundColor="#FBC609" translucent />
      <View className="flex flex-col flex-1 p-5 bg-primary">
        <View className="flex flex-col items-center justify-center flex-1 ">
          <Lottie
            source={require('../../assets/animations/done.json')}
            autoPlay
            loop
            style={{
              width: 300,
              height: 300,
            }}
          />
        </View>

        <View className="flex flex-col pb-2">
          <Text className="text-2xl font-bold text-black">
            {token ? `$${token}` : 'TX done'}
          </Text>
          <Text className="text-5xl font-extrabold text-black shadow-md">
            PAYMENT
          </Text>
          <Text className="text-5xl font-extrabold text-black shadow-md">
            SUCCESSFUL
          </Text>

          <Pressable
            onPress={() => {}}
            className="w-full border-[0.8px] border-white rounded-md my-4 p-3 flex-row bg-yellow-400 h-20"
          >
            <View className="w-16 h-full mr-3 bg-blue-400 rounded-md">
              <Image
                source={require('../../assets/illustrations/Bull.png')}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
              />
            </View>
            <View className="flex flex-col flex-1">
              <Text className="text-base font-bold text-black">
                Utilities are available on Shukuru
              </Text>
              <Text className="text-xs font-light text-black">
                Buy digital products using Bitcoin & cUSD
              </Text>
            </View>
          </Pressable>
        </View>

        <View className="flex flex-row w-full">
          <Pressable
            onPress={() => {
              refresh()
              navigation.navigate('Home')
            }}
            className="flex flex-row items-center justify-center flex-1 p-2 my-4 mr-2 bg-white rounded-md h-14"
          >
            <AppText classProps="text-xl font-bold">View</AppText>
          </Pressable>

          <Pressable
            onPress={() => {
              refresh()
              navigation.navigate('Home')
            }}
            className="flex flex-row items-center justify-center flex-1 p-2 my-4 ml-2 bg-blue-500 rounded-md h-14"
          >
            <Text className="text-xl font-bold text-white">Done</Text>
          </Pressable>
        </View>
      </View>
    </>
  )
}
export default TransactionDone

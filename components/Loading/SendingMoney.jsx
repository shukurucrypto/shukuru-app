import { View, Text, SafeAreaView, StatusBar } from 'react-native'
import Lottie from 'lottie-react-native'
import React from 'react'

const SendingMoney = () => {
  return (
    <>
      <StatusBar backgroundColor="#FBC609" translucent />
      <View className="flex items-center justify-center flex-1 p-5 bg-primary">
        <Lottie
          source={require('../../assets/animations/blocks.json')}
          autoPlay
          loop
          style={{
            width: 400,
            height: 400,
          }}
        />

        <Text className="text-sm text-black">Processing....</Text>
      </View>
    </>
  )
}

export default SendingMoney

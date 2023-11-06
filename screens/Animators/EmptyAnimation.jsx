import { View, Text } from 'react-native'
import Lottie from 'lottie-react-native'
import React from 'react'

const EmptyAnimation = ({ msg }) => {
  return (
    <View className="flex items-center flex-1">
      <Lottie
        source={require('../../assets/animations/empty.json')}
        autoPlay
        loop
        style={{
          width: 250,
          height: 300,
        }}
      />
      <Text className="text-sm text-center text-black">{msg}</Text>
    </View>
  )
}

export default EmptyAnimation

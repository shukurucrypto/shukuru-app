import { View, Text } from 'react-native'
import Lottie from 'lottie-react-native'
import React from 'react'

const SearchLoading = () => {
  return (
    <View className="flex flex-1 my-4">
      <Lottie
        source={require('../../assets/animations/blocks.json')}
        autoPlay
        loop
      />
    </View>
  )
}

export default SearchLoading

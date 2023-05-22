import { View, Text, Image, StatusBar } from 'react-native'
import React from 'react'

const SplashScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="#FBC609" />
      <View className="flex items-center justify-center flex-1 bg-primary">
        <View className="w-24 h-24 border-2 border-white rounded-full ">
          <Image
            source={require('../assets/logos/logo.png')}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      </View>
    </>
  )
}

export default SplashScreen

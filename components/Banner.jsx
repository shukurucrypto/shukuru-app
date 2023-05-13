import { View, Text, Image } from 'react-native'
import React from 'react'
import AppText from './AppText'

const Banner = () => {
  return (
    <View className="flex flex-row flex-1 w-full h-48 p-4 my-3 bg-white ">
      <View className="flex justify-between flex-1">
        <AppText classProps="text-lg ">
          {/* Update to the latest app version to continue growing your crypto */}
          You can now change the default currency to what you're most
          comfortable with
        </AppText>

        <View className="flex flex-row items-center justify-between w-full">
          <Text className="font-bold text-primary ">Change now</Text>
          <AppText classProps="">Dismiss</AppText>
        </View>
      </View>

      <View className="flex items-center justify-center flex-1">
        <Image
          source={require('../assets/logos/logo.png')}
          style={{ width: 85, height: 85 }}
        />
      </View>
    </View>
  )
}

export default Banner

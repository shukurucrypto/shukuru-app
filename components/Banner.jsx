import { View, Text, Image } from 'react-native'
import React from 'react'
import AppText from './AppText'

const Banner = () => {
  return (
    <View className="flex flex-row flex-1 w-full h-48 p-4 px-6 my-3 bg-white ">
      <View className="flex justify-between flex-1 pr-3">
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

      <View className="relative flex items-center justify-center ml-4 ">
        <View className="relative flex overflow-hidden bg-black rounded-full w-28 h-28">
          <Image
            source={require('../assets/illustrations/Abacus.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  )
}

export default Banner

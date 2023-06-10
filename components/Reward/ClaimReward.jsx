import { View, Text, Image, useWindowDimensions, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import AppText from '../AppText'

const ClaimReward = ({ item }) => {
  const width = useWindowDimensions().width

  const navigation = useNavigation()

  return (
    <Pressable
      onPress={() => navigation.navigate('ClaimRewardsScreen', { item })}
      style={{ width: width - 25 }}
      className="flex flex-row h-full p-4 px-6 mx-3 bg-white rounded-md"
    >
      <View className="flex justify-between flex-1 pr-3">
        <View className="flex justify-center flex-1">
          <AppText classProps="text-lg ">
            🎁 Your rewards are ready, claim them NOW to super charge your
            account.
          </AppText>
        </View>

        <View className="flex flex-row items-center justify-between w-full">
          <Pressable
            onPress={() => navigation.navigate('ClaimRewardsScreen', { item })}
          >
            <Text className="font-bold text-primary ">Claim now</Text>
          </Pressable>
          <AppText classProps="">Dismiss</AppText>
        </View>
      </View>

      <View className="relative flex items-center justify-center ml-4 ">
        <View className="relative flex overflow-hidden rounded-full bg-neutral-200 w-28 h-28">
          <Image
            // source={imgURL.signedUrl}
            source={require('../../assets/logos/logo.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
      </View>
    </Pressable>
  )
}

export default ClaimReward

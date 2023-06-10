import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import AppText from '../AppText'

const RewardCard = ({ item, navigation }) => {
  return (
    <Pressable
      // onPress={() => navigation.navigate('TransactionDetail')}
      onPress={() => {}}
      className="flex flex-row items-center w-full h-16 my-2 "
    >
      {/* {renderIcon(item.asset)} */}
      <View className="relative flex items-center justify-center rounded-full w-11 h-11 ">
        <Image
          source={require('../../assets/logos/logo.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      <View className="flex flex-col flex-1 px-4">
        <AppText classProps="text-lg font-medium">Super charged</AppText>
        <AppText classProps="font-light">Weekly rewards</AppText>
      </View>

      <View className="flex flex-col px-4 ">
        <Text numberOfLines={1} className="text-lg text-green-600">
          + {item.amount}
        </Text>
        <AppText classProps="text-xs font-light self-end">{item.asset}</AppText>
      </View>
    </Pressable>
  )
}

export default RewardCard

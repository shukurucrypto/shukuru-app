import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import AppText from '../AppText'

import image from '../../assets/logos/oneramp.png'

const BackHeader = ({ title, subTitle, cancel }) => {
  const navigation = useNavigation()

  return (
    <View className="flex flex-row w-full p-4">
      <Pressable onPress={() => navigation.goBack()} className="flex flex-1">
        <AntDesign name="left" size={30} color="black" />
      </Pressable>

      <View className="flex items-center justify-center flex-1 w-full ">
        <AppText classProps="text-base font-bold">{title}</AppText>
        <View className="flex flex-row items-center">
          <Text className="text-xs text-black">{subTitle}</Text>
          <Image source={image} style={{ width: 60, height: 20 }} />
        </View>
      </View>

      <View className="flex items-end justify-center flex-1">
        {cancel && (
          <Pressable onPress={() => navigation.navigate('Home')}>
            <AppText classProps="text-base">Cancel</AppText>
          </Pressable>
        )}
      </View>
    </View>
  )
}

export default BackHeader

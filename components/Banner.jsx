import { View, Text, Image, useWindowDimensions, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from './AppText'
import { getBannerImgURL } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const Banner = ({ item, dismiss }) => {
  const [imgURL, setImgURL] = useState('')

  const width = useWindowDimensions().width

  const navigation = useNavigation()

  useEffect(() => {
    const getData = async () => {
      const res = await getBannerImgURL(item.image)

      setImgURL(res)
    }

    getData()
  }, [])

  return (
    <Pressable
      // onPress={() => navigation.navigate('ClaimRewardsScreen')}
      style={{ width: width - 25 }}
      className="flex flex-row h-full p-4 px-6 mx-3 bg-white rounded-md"
    >
      <View className="flex justify-between flex-1 pr-3">
        <View className="flex justify-center flex-1">
          <AppText classProps="text-lg ">{item.description}</AppText>
        </View>

        <View className="flex flex-row items-center justify-between w-full">
          {item.btn_title && (
            <Pressable onPress={() => navigation.navigate(item.btn_route)}>
              <Text className="font-bold text-primary ">{item.btn_title}</Text>
            </Pressable>
          )}

          <Pressable onPress={dismiss}>
            <AppText classProps="">Dismiss</AppText>
          </Pressable>
        </View>
      </View>

      <View className="relative flex items-center justify-center ml-4 ">
        <View className="relative flex overflow-hidden rounded-full bg-neutral-200 w-28 h-28">
          {imgURL && (
            <Image
              // source={imgURL.signedUrl}
              source={{
                uri: imgURL.signedUrl,
              }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
    </Pressable>
  )
}

export default Banner

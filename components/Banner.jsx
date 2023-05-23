import { View, Text, Image, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from './AppText'
import { getBannerImgURL } from '../lib/supabase'

const Banner = ({ item }) => {
  const [imgURL, setImgURL] = useState('')

  const width = useWindowDimensions().width

  useEffect(() => {
    const getData = async () => {
      const res = await getBannerImgURL(item.image)

      setImgURL(res)
    }

    getData()
  }, [])
  return (
    <View
      style={{ width: width - 25 }}
      className="flex flex-row h-full p-4 px-6 mx-3 bg-white rounded-md"
    >
      <View className="flex justify-between flex-1 pr-3">
        <View className="flex justify-center flex-1">
          <AppText classProps="text-lg ">{item.description}</AppText>
        </View>

        <View className="flex flex-row items-center justify-between w-full">
          {item.btn_title && (
            <Text className="font-bold text-primary ">{item.btn_title}</Text>
          )}
          <AppText classProps="">Dismiss</AppText>
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
    </View>
  )
}

export default Banner

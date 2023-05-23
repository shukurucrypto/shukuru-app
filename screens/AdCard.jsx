import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from '../components/AppText'
import { getBannerImgURL } from '../lib/supabase'

const AdCard = ({ item }) => {
  const [imgURL, setImgURL] = useState('')

  useEffect(() => {
    const getData = async () => {
      const res = await getBannerImgURL(item.image)

      setImgURL(res)
    }

    getData()
  }, [])
  return (
    <View className="flex flex-row items-center w-full p-3 rounded-md bg-neutral-200">
      <View className="mr-3 overflow-hidden bg-white rounded-full w-14 h-14">
        {imgURL && (
          <Image
            source={{
              uri: imgURL.signedUrl,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </View>
      <View className="flex flex-col flex-1">
        <AppText classProps="text-base font-bold">{item.title}</AppText>
        <AppText classProps="mt-1 font-light">{item.description}</AppText>
      </View>
    </View>
  )
}

export default AdCard

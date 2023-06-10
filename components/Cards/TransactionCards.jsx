import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import React, { useEffect, useState } from 'react'
import AppText from '../AppText'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { API_URL } from '../../apiURL'
import RewardCard from './RewardCard'

const TransactionCards = ({ item }) => {
  const { profile } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState(item.amount)

  const navigation = useNavigation()

  // useEffect(() => {
  // handleConvert()
  // }, [])

  const handleConvert = async () => {
    setLoading(true)
    try {
      if (item.currency != profile.country) {
        const data = {
          amount: item.amount,
          from: item.currency,
          to: profile.country,
        }

        const result = await axios.post(`${API_URL}/convert`, data)

        if (result.data.success) {
          setCurrency(result.data.data)
        }

        setLoading(false)
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const renderIcon = (asset) => {
    switch (asset) {
      case 'BUSD':
        return (
          <View className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
            <Image
              source={require('../../assets/tokens/busd.png')}
              style={{ width: 25, height: 25 }}
            />
          </View>
        )

      case 'cUSD':
        return (
          <View className="relative flex items-center justify-center w-10 h-10 rounded-full ">
            <Image
              source={require('../../assets/tokens/cusd.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        )
      case 'USDT':
        return (
          <View className="relative flex items-center justify-center w-12 h-12 rounded-full ">
            <Image
              source={require('../../assets/tokens/usdt.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        )
      default:
        return (
          <View className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full">
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={30}
              color="#fff"
            />
          </View>
        )
    }
  }

  if (item.txType === 'reward') {
    return <RewardCard item={item} navigation={navigation} />
  }

  if (item?.bolt11) {
    return (
      <Pressable
        onPress={() => navigation.navigate('TransactionDetail')}
        className="flex flex-row items-center w-full h-16 my-2 "
      >
        {renderIcon(item.asset)}
        {/* Info */}
        <View className="flex flex-col flex-1 px-4">
          <AppText classProps="text-lg">
            {item.amount.toString().startsWith('-')
              ? 'You paid'
              : 'You were paid'}
          </AppText>
          <AppText numberOfLines={1} classProps="font-light">
            {item.memo}
          </AppText>
        </View>

        {/* Funds */}
        <View className="flex flex-col px-4 ">
          <Text
            numberOfLines={1}
            className={`text-lg
         ${
           item.amount.toString().startsWith('-')
             ? 'text-red-600'
             : 'text-green-600'
         }
          `}
          >
            {currency
              ? currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : item.amount.toFixed(0)}
          </Text>
          <AppText classProps="text-xs font-light self-end">Apr 22</AppText>
        </View>
      </Pressable>
    )
  } else {
    return (
      <Pressable
        // onPress={() => navigation.navigate('TransactionDetail')}
        onPress={() => {}}
        className="flex flex-row items-center w-full h-16 my-2 "
      >
        {renderIcon(item.asset)}
        <View className="flex flex-col flex-1 px-4">
          {item.external ? (
            <Text className="text-lg text-orange-500">External Tx</Text>
          ) : (
            <>
              <AppText classProps="text-lg">
                +
                {item?.phoneNumber?.slice(0, 3) +
                  '...' +
                  item?.phoneNumber?.slice(-2)}
              </AppText>
            </>
          )}
          <AppText classProps="font-light">
            {item.asset} Payment {item.txType}
          </AppText>
        </View>

        <View className="flex flex-col px-4 ">
          <Text
            numberOfLines={1}
            className={`text-lg  ${
              item.txType === 'recieved' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {item.txType === 'recieved' ? '+' : '-'}
            {/* {currency
              ? currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : item.amount} */}
            {item.amount.toFixed(0)}
          </Text>
          <AppText classProps="text-xs font-light self-end">Apr 22</AppText>
        </View>
      </Pressable>
    )
  }
}

export default TransactionCards

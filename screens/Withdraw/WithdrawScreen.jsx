import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useSelector } from 'react-redux'
import AppText from '../../components/AppText'

const WithdrawScreen = () => {
  const navigation = useNavigation()
  const profileState = useSelector((state) => state.profile)
  const balancesState = useSelector((state) => state.balances)

  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-col flex-1">
        <View className="flex flex-row w-full p-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex flex-1"
          >
            <AntDesign name="close" size={30} color="black" />
          </Pressable>

          <View className="flex items-center justify-center flex-1 "></View>

          <View className="flex flex-1" />
        </View>

        {/* Body */}

        <View className="flex flex-1 px-5 py-5">
          <View className="flex flex-row items-center justify-between ">
            <View className="flex flex-col">
              <AppText classProps="text-sm font-medium ">Total balance</AppText>

              <View className="flex flex-row items-center mt-3">
                <View className="flex items-center justify-center overflow-hidden bg-green-500 rounded-full w-14 h-14">
                  <FontAwesome5 name="coins" size={24} color="#fff" />
                </View>

                {/* Amount */}
                <View className="flex flex-col ml-2">
                  <Text className="text-2xl font-bold text-neutral-700">
                    {profileState?.profile?.country +
                      balancesState?.balances?.total
                        ?.toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </Text>
                  <Text className="text-xs">BTC, cUSD & BUSD</Text>
                </View>
              </View>
            </View>

            {/*  */}
          </View>

          <Pressable
            onPress={() => navigation.navigate('SelectWithdrawAssetScreen')}
            className="flex flex-row items-center h-32 py-4 border-b border-neutral-200"
          >
            <View className="flex flex-col flex-1">
              <AppText classProps="text-lg font-bold">Withdraw Funds</AppText>
              <AppText classProps="mr-2">
                Get funds out of Shukuru into your mobile money account
                instantly
              </AppText>
            </View>

            {/* Arrow */}
            <AntDesign name="right" size={24} />
          </Pressable>
        </View>

        {/*  */}
      </View>
    </SafeAreaView>
  )
}

export default WithdrawScreen

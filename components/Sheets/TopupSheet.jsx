import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React, { useEffect, useState } from 'react'
import ActionSheet from 'react-native-actions-sheet'
import LinearGradient from 'react-native-linear-gradient'
import TypeWriter from 'react-native-typewriter'

import AppText from '../AppText'
import { useNavigation } from '@react-navigation/native'

const TopupSheet = ({ topupActionSheet }) => {
  const navigation = useNavigation()
  const height = useWindowDimensions().height

  return (
    <ActionSheet
      ref={topupActionSheet}
      containerStyle={{
        height: height / 2,
        padding: 15,
        position: 'relative',
      }}
    >
      <>
        {/* <View className="absolute top-0 bottom-0 left-0 right-0 z-30">
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(251,198,9,9)']}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: 40,
              paddingBottom: 50,
            }}
          >
            <TypeWriter
              className="text-2xl font-extrabold text-center text-black shadow-lg"
              typing={1}
            >
              Top-up crypto & utilities with MOMO coming soon..
            </TypeWriter>
          </LinearGradient>
        </View> */}

        {/* Sheet header */}
        <View className="flex flex-row items-center justify-between w-full mb-3">
          <AppText classProps="text-2xl font-bold">Topup Options</AppText>
        </View>
        <ScrollView
          className="flex flex-1"
          showsVerticalScrollIndicator={false}
        >
          {/* Utilities */}
          <Pressable
            onPress={() => {
              topupActionSheet.current?.hide()
              navigation.navigate('UtilitiesScreen')
            }}
            className="flex flex-row items-center w-full h-16 "
          >
            <View className="flex items-center justify-center w-10 h-10 overflow-hidden bg-orange-500 rounded-full">
              <Image
                source={require('../../assets/illustrations/utilities.png')}
                style={{ width: 40, height: 40 }}
              />
            </View>
            <AppText classProps="mx-4 text-xl font-medium ">
              Buy Utilities
            </AppText>
          </Pressable>

          {/* Gas */}
          <Pressable
            onPress={() => {
              topupActionSheet.current?.hide()
              navigation.navigate('TopUpGasScreen')
            }}
            className="flex flex-row items-center w-full h-16 "
          >
            <View className="flex items-center justify-center w-10 h-10 overflow-hidden bg-purple-600 rounded-full">
              <FontAwesome5 name="gas-pump" size={18} color="#fff" />
            </View>
            <AppText classProps="mx-4 text-xl font-medium ">
              Network Fees (Gas)
            </AppText>
          </Pressable>

          {/* Body */}
          <View className="flex flex-col items-center flex-1 ">
            <View className="flex flex-row items-center w-full h-16 ">
              <View className="flex items-center justify-center rounded-full bg-neutral-300 w-9 h-9">
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={30}
                  color="#fff"
                />
              </View>
              <Text className="mx-4 text-xl font-medium text-neutral-300">
                BTC Lightning
              </Text>
            </View>

            {/* BUSD  */}
            <Pressable
              // onPress={() => {
              //   receiveActionSheet.current?.hide()
              //   navigation.navigate('ReceiveTerminal', { token: 'BUSD' })
              // }}
              onPress={() => {}}
              className="flex flex-row items-center w-full h-16 "
            >
              <View className="flex items-center justify-center rounded-full bg-neutral-200 w-9 h-9">
                {/* <Image
                  source={require('../../assets/tokens/busd.png')}
                  style={{ width: 25, height: 25 }}
                /> */}
              </View>
              <Text className="mx-4 text-xl font-medium text-neutral-200">
                BUSD (Binance USD)
              </Text>
            </Pressable>

            {/* cUSD */}
            <View className="flex flex-row items-center w-full h-16 ">
              <View className="flex items-center justify-center rounded-full bg-neutral-200 w-9 h-9" />
              {/* <Image
                source={require('../../assets/tokens/cusd.png')}
                style={{ width: 40, height: 40 }}
              /> */}
              <Text className="mx-4 text-lg font-medium text-neutral-200">
                cUSD (Celo Dollar)
              </Text>
            </View>

            {/* USDT */}
            {/* <View className="flex flex-row items-center w-full h-16 ">
              <Image
                source={require('../../assets/tokens/usdt.png')}
                style={{ width: 40, height: 40 }}
              />
              <View className="flex flex-row">
                <AppText classProps="mx-4 text-xl font-medium ">
                  USDT (Tether)
                </AppText>
                <View className="flex flex-row">
                  <Image
                    source={require('../../assets/tokens/chain.png')}
                    style={{ width: 18, height: 18 }}
                  />
                  <AppText classProps="text-xs mx-1">BNB Chain</AppText>
                </View> 
             </View> 
             </View> */}
          </View>
        </ScrollView>
      </>
    </ActionSheet>
  )
}

export default TopupSheet

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
import AntDesign from 'react-native-vector-icons/AntDesign'
import React from 'react'
import ActionSheet from 'react-native-actions-sheet'
import AppText from '../AppText'

const TopupSheet = ({ topupActionSheet }) => {
  const height = useWindowDimensions().height
  return (
    <ActionSheet
      ref={topupActionSheet}
      containerStyle={{
        height: height / 2,
        padding: 15,
      }}
    >
      <>
        {/* Sheet header */}
        <View className="flex flex-row items-center justify-between w-full mb-3">
          <AppText classProps="text-2xl font-bold">Topup Options</AppText>

          <Pressable
            onPress={() => topupActionSheet.current?.hide()}
            className=""
          >
            <AntDesign name="close" size={30} color="black" />
          </Pressable>
        </View>
        <ScrollView
          className="flex flex-1"
          showsVerticalScrollIndicator={false}
        >
          {/* Body */}
          <View className="flex flex-col items-center flex-1 ">
            <View className="flex flex-row items-center w-full h-16 ">
              <View className="flex items-center justify-center bg-orange-500 rounded-full w-9 h-9">
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={30}
                  color="#fff"
                />
              </View>
              <AppText classProps="mx-4 text-xl font-medium ">
                BTC Lightning
              </AppText>
            </View>

            {/* BTC  */}
            {/* <View className="flex flex-row items-center w-full h-16 ">
          <MaterialCommunityIcons name="bitcoin" size={40} color="#fc7f03" />
          <AppText classProps="mx-4 text-xl font-medium ">
            BTC Onchain Address
          </AppText>
        </View> */}

            {/* BUSD  */}
            <Pressable
              // onPress={() => {
              //   receiveActionSheet.current?.hide()
              //   navigation.navigate('ReceiveTerminal', { token: 'BUSD' })
              // }}
              onPress={() => {}}
              className="flex flex-row items-center w-full h-16 "
            >
              <View className="flex items-center justify-center bg-black rounded-full w-9 h-9">
                <Image
                  source={require('../../assets/tokens/busd.png')}
                  style={{ width: 25, height: 25 }}
                />
              </View>
              <AppText classProps="mx-4 text-xl font-medium ">
                BUSD (Binance USD)
              </AppText>
            </Pressable>

            {/* cUSD */}
            <View className="flex flex-row items-center w-full h-16 ">
              <Image
                source={require('../../assets/tokens/cusd.png')}
                style={{ width: 40, height: 40 }}
              />
              <AppText classProps="mx-4 text-lg font-medium ">
                cUSD (Celo Dollar)
              </AppText>
            </View>

            {/* USDT */}
            <View className="flex flex-row items-center w-full h-16 ">
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
            </View>

            {/* Utilities */}
            <View className="flex flex-row items-center w-full h-16 ">
              <Image
                source={require('../../assets/tokens/usdt.png')}
                style={{ width: 40, height: 40 }}
              />
              <AppText classProps="mx-4 text-lg font-medium ">
                Buy Utilities
              </AppText>
            </View>
          </View>
        </ScrollView>
      </>
    </ActionSheet>
  )
}

export default TopupSheet

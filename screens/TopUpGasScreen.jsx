import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
} from 'react-native'
import React, { useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AppText from '../components/AppText'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserGas } from '../features/gas/gasSlice'
import FillUpGasSheet from '../components/Sheets/FillUpGasSheet'

const TopUpGasScreen = () => {
  const { gas } = useSelector((state) => state.gasState)
  const navigation = useNavigation()

  const { user } = useSelector((state) => state.user)
  const { token } = useSelector((state) => state.tokenState)

  const [selected, setSelected] = useState('CELO')

  const topUpGasSheet = useRef(null)

  const dispatch = useDispatch()

  const renderTab = (price) => {
    switch (price) {
      case price.celo <= 0:
        return (
          <Text className="text-base font-bold text-white">
            You're low on cUSD
          </Text>
        )

      case price.bnb <= 0:
        return (
          <Text className="text-base font-bold text-white">
            You're low on BUSD
          </Text>
        )

      case price.bnb <= 0 && price.celo <= 0:
        return (
          <Text className="text-base font-bold text-white">
            You're low on BUSD, cUSD
          </Text>
        )
      default:
        return (
          <Text className="text-base font-bold text-white">
            Boost your tx speed
          </Text>
        )
    }
  }

  const refresh = async () => {
    fetchUserGas(dispatch, user.userId, token)
  }

  const closeSheet = () => {
    topUpGasSheet.current?.hide()
  }

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex flex-1">
        <View className="flex flex-col flex-1">
          <View className="flex flex-row w-full p-4">
            <Pressable
              onPress={() => navigation.goBack()}
              className="flex flex-1"
            >
              <AntDesign name="close" size={30} />
            </Pressable>

            <View className="flex items-center justify-center flex-1 ">
              <AppText classProps="text-lg font-bold">Gas Analysis</AppText>
            </View>

            <View className="flex flex-1" />
          </View>
          <View className="flex flex-row items-center justify-between w-full p-2 px-4 bg-green-600">
            {renderTab(gas)}

            {/*  */}
            <Pressable
              onPress={() => {
                topUpGasSheet.current?.show()
                setSelected('CELO')
              }}
              className="flex flex-row items-center justify-center"
            >
              <Text className="mx-1 text-base font-bold text-white">
                Fill Up?
              </Text>
              <MaterialIcons name="open-in-new" color="white" size={18} />
            </Pressable>
          </View>

          {/* Celo */}
          <Pressable
            onPress={() => {
              topUpGasSheet.current?.show()
              setSelected('CELO')
            }}
            className="flex flex-row items-center w-full h-20 px-5 "
          >
            <View className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
              <Image
                source={require('../assets/tokens/cel.png')}
                style={{ width: 30, height: 30 }}
              />
            </View>

            <View className="flex flex-col flex-1 mx-4">
              <AppText classProps="text-lg font-bold">
                CELO <Text className="text-xs">(gas)</Text>
              </AppText>
              <Text>cUSD</Text>
            </View>

            <View className="flex flex-col">
              <AppText classProps="text-lg font-bold">
                {gas.celo?.toFixed(6)}
              </AppText>
              {gas.celo <= 0 ? (
                <Text className="text-xs font-bold text-red-600">LOW</Text>
              ) : (
                <Text className="text-xs font-bold text-green-600">
                  REFILL?
                </Text>
              )}
            </View>
          </Pressable>

          {/* Coin gas analysis */}
          <Pressable
            onPress={() => {
              topUpGasSheet.current?.show()
              setSelected('BNB')
            }}
            className="flex flex-row items-center w-full h-20 px-5 "
          >
            <View className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
              <Image
                source={require('../assets/tokens/bnb.png')}
                style={{ width: 30, height: 30 }}
              />
            </View>

            <View className="flex flex-col flex-1 mx-4">
              <AppText classProps="text-lg font-bold">
                BNB <Text className="text-xs">(gas)</Text>
              </AppText>
              <Text>BUSD</Text>
            </View>

            <View className="flex flex-col">
              <AppText classProps="text-lg font-bold">
                {Number(gas.bnb).toFixed(6)}
              </AppText>
              {gas.bnb <= 0 ? (
                <Text className="text-xs font-bold text-red-600">LOW</Text>
              ) : (
                <Text className="text-xs font-bold text-green-600">
                  REFILL?
                </Text>
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <FillUpGasSheet
        filltopUpGasSheet={topUpGasSheet}
        selected={selected}
        refresh={refresh}
        closeSheet={closeSheet}
        token={token}
        userId={user.userId}
      />
    </SafeAreaView>
  )
}

export default TopUpGasScreen

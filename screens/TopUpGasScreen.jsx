import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import AppText from '../components/AppText'
import FillUpGasSheet from '../components/Sheets/FillUpGasSheet'
import { fetchUserGas } from '../features/gas/gasSlice'

const TopUpGasScreen = () => {
  const { gas } = useSelector((state) => state.gasState)
  const navigation = useNavigation()

  const { user } = useSelector((state) => state.user)
  const { token } = useSelector((state) => state.tokenState)

  const [selected, setSelected] = useState('CELO')

  const topUpGasSheet = useRef(null)

  const dispatch = useDispatch()

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
              <AntDesign name="close" size={30} color="black" />
            </Pressable>

            <View className="flex items-center justify-center flex-1 ">
              <AppText classProps="text-lg font-bold">My Assets</AppText>
            </View>

            <View className="flex flex-1" />
          </View>
          <View className="flex flex-row items-center justify-between w-full p-2 px-4 bg-green-600">
            <Text className="text-base font-bold text-white">
              Boost your portfolio
            </Text>
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
                CELO
                {/* <Text className="text-xs">(gas)</Text> */}
              </AppText>
              <Text className="text-xs">CELO Chain</Text>
            </View>

            <View className="flex flex-col">
              <AppText classProps="text-lg font-bold">
                {gas.celo <= 0 ? '0.0' : gas.celo?.toFixed(6)}
              </AppText>
              {gas.celo <= 0 ? (
                <Text className="text-xs font-bold text-red-600">ADD</Text>
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

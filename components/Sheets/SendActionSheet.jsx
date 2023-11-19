import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
  ScrollView,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React from 'react'
import ActionSheet from 'react-native-actions-sheet'
import { useNavigation } from '@react-navigation/native'
import AppText from '../AppText'

const SendActionSheet = ({ sendActionSheet, refresh, balances }) => {
  const navigation = useNavigation()

  const height = useWindowDimensions().height

  return (
    <ActionSheet
      ref={sendActionSheet}
      containerStyle={{
        height: height / 3,
        padding: 15,
      }}
    >
      <ScrollView className="flex flex-1" showsVerticalScrollIndicator={false}>
        {/* Sheet header */}
        <View className="flex flex-row items-center justify-between w-full mb-3">
          <AppText classProps="text-2xl font-bold">Payment Options</AppText>

          <Pressable
            onPress={() => sendActionSheet.current?.hide()}
            className=""
          >
            <AntDesign name="close" size={30} color="black" />
          </Pressable>
        </View>

        {/* Body */}
        <View className="flex flex-col items-center flex-1 ">
          <Pressable
            onPress={() => {
              sendActionSheet.current?.hide()
              navigation.navigate('FindUser', {
                token: 'BTC-LT',
                refresh: refresh,
              })
            }}
            className="flex flex-row items-center w-full h-16 "
          >
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
          </Pressable>

          {/* cUSD */}
          <Pressable
            onPress={() => {
              sendActionSheet.current?.hide()
              navigation.navigate('FindUser', {
                token: 'cUSD',
                refresh: refresh,
              })
            }}
            className="flex flex-row items-center w-full h-16 "
          >
            <Image
              source={require('../../assets/tokens/cusd.png')}
              style={{ width: 35, height: 35 }}
            />
            <AppText classProps="mx-4 text-xl font-medium ">
              cUSD (Celo Dollar)
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </ActionSheet>
  )
}

export default SendActionSheet

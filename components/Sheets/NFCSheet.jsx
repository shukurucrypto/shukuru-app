import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Lottie from 'lottie-react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React from 'react'
import ActionSheet from 'react-native-actions-sheet'
import { useNavigation } from '@react-navigation/native'
import AppText from '../AppText'

const NFCSheet = ({ sendActionSheet, refresh }) => {
  const navigation = useNavigation()

  const height = useWindowDimensions().height

  return (
    <ActionSheet
      ref={sendActionSheet}
      containerStyle={{
        height: height / 2,
        padding: 15,
      }}
    >
      {/* Sheet header */}
      <View className="flex flex-row items-center justify-between w-full mb-3">
        <AppText classProps="text-2xl font-bold">Ready to scan</AppText>

        <Pressable onPress={() => sendActionSheet.current?.hide()} className="">
          <AntDesign name="close" size={30} color="black" />
        </Pressable>
      </View>

      <View className="flex flex-col items-center flex-1 ">
        {/* USDT */}

        <Lottie
          source={require('../../assets/animations/nfc.json')}
          autoPlay
          loop
        />
      </View>
    </ActionSheet>
  )
}

export default NFCSheet

import React, { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import Feather from 'react-native-vector-icons/Feather'

import Clipboard from '@react-native-clipboard/clipboard'
import { useNavigation } from '@react-navigation/native'
import AppText from '../AppText'
import { useSelector } from 'react-redux'

const FillUpGasSheet = ({
  filltopUpGasSheet,
  selected,
  refresh,
  closeSheet,
  token,
  userId,
}) => {
  const navigation = useNavigation()
  const height = useWindowDimensions().height

  const { profile, error } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(false)

  const [copiedInvoice, setCopiedInvoice] = useState(false)

  const copyToClipboard = () => {
    setCopiedInvoice(true)
    Clipboard.setString(profile.address)

    setTimeout(() => {
      setCopiedInvoice(false)
    }, 4000)
  }

  const navigate = () => {
    closeSheet()
    if (selected === 'CELO') {
      navigation.navigate('ReceiveTerminal', {
        token: 'CELO',
        refresh: refresh,
        msg: 'Make sure your sending CELO to this address',
      })
    } else {
      navigation.navigate('ReceiveTerminal', {
        token: 'BNB',
        refresh: refresh,
        msg: 'Make sure your sending BNB to this address',
      })
    }
  }
  return (
    <ActionSheet
      ref={filltopUpGasSheet}
      containerStyle={{
        height: height / 3,
        padding: 20,
        position: 'relative',
      }}
    >
      <>
        {/* Sheet header */}
        <View className="flex flex-row items-center justify-between w-full mb-3">
          <AppText classProps="text-xl font-bold">
            How do you want to fill up {selected}?
          </AppText>
        </View>

        <View className="relative flex flex-col flex-1 gap-4 py-5">
          <Pressable
            onPress={navigate}
            className="flex flex-row items-center justify-between p-2 py-3 rounded-md bg-neutral-100"
          >
            <Text className="text-lg text-black">Top up from account</Text>
            <Feather name="arrow-right" size={22} color="black" />
          </Pressable>

          <Pressable
            onPress={copyToClipboard}
            className="flex flex-row items-center justify-between p-2 py-3 rounded-md bg-neutral-100"
          >
            {copiedInvoice ? (
              <View className="flex flex-row items-center justify-between flex-1">
                <Text className="text-lg text-blue-500">Address Copied!</Text>
                <Feather name="copy" size={22} color="#3b82f6" />
              </View>
            ) : (
              <View className="flex flex-row items-center justify-between flex-1">
                <Text className="text-lg text-black">Copy my address</Text>
                <Feather name="copy" size={22} color="black" />
              </View>
            )}
          </Pressable>

          {/* {success && (
            <View className="absolute left-0 w-full p-2 bg-green-300 rounded-md bottom-6">
              <Text className="font-bold text-center text-green-700">
                Request sent!
              </Text>
            </View>
          )} */}
        </View>
      </>
    </ActionSheet>
  )
}

export default FillUpGasSheet

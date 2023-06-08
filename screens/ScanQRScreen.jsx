import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { useNavigation, useRoute } from '@react-navigation/native'

import AppText from '../components/AppText'

const ScanQRScreen = () => {
  const [error, setError] = useState('')

  const navigation = useNavigation()
  const router = useRoute()

  const { refresh } = router.params

  const onSuccess = (e) => {
    let invoice = e.data
    render(invoice)
  }
  const render = (invoice) => {
    switch (true) {
      case invoice.startsWith('lnbc'):
      case invoice.startsWith('lightning'):
      case invoice.startsWith('LNBC'):
        navigation.navigate('ReadInvoiceScreen', {
          data: invoice,
          refresh: refresh,
        })
        break
      case invoice.startsWith('ethereum') && invoice.includes('?value='):
      case invoice.includes('address') && invoice.includes('amount'):
        navigation.navigate('EVMConfirmTXScreen', { data: invoice })
        break
      case invoice.startsWith('0x') && invoice.length == 42:
        navigation.navigate('ExternalSendTerminal', {
          to: invoice,
        })
        break
      case invoice.startsWith('celo://') && invoice.includes('address'):
        const regex = /address=([^&]+)/
        const match = invoice.match(regex)
        const celoAddress = match ? match[1] : null

        navigation.navigate('ExternalSendTerminal', {
          to: celoAddress,
        })
        break
      case invoice.startsWith('ethereum'):
        const cleanedString = invoice.replace('ethereum:', '')

        // Split the string into parts using "?" as the delimiter
        const parts = cleanedString.split('?')

        // Extract the address and value from the parts
        const address = parts[0]
        navigation.navigate('ExternalSendTerminal', {
          to: address,
        })
        break
      default:
        setError('Invalid code')
        break
    }
  }

  return (
    <QRCodeScanner
      onRead={onSuccess}
      flashMode={RNCamera.Constants.FlashMode.off}
      showMarker={true}
      reactivate={true}
      markerStyle={{
        borderRadius: 16,
        borderColor: '#FBC609',
      }}
      topContent={
        <View className="flex flex-row items-center justify-between w-full ">
          <View />
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex flex-row items-center p-5 "
          >
            <Text className="text-lg text-red-500">Cancel</Text>
          </Pressable>
        </View>
      }
      bottomContent={
        <View className="flex flex-col items-center">
          {error && (
            <View className="flex w-full px-4 py-2 rounded-md bg-neutral-800">
              <Text className="text-base text-red-600">Invalid data</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.buttonTouchable}
          >
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})

export default ScanQRScreen

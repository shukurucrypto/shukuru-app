import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import QRCODE from '../components/QRCode'
import AppText from '../components/AppText'
import { useDispatch, useSelector } from 'react-redux'
import { API_URL, SOCKET_SERVER } from '../apiURL'
import { io } from 'socket.io-client'
import TransactionDone from './Animators/TransactionDone'
import NfcManager, { NfcTech } from 'react-native-nfc-manager'
import NFCSheet from '../components/Sheets/NFCSheet'
import TransactionFailed from './Animators/TransactionFailed'
import SendingMoney from '../components/Loading/SendingMoney'
import { fetchBalance } from '../features/balances/balancesSlice'
import { fetchTransactions } from '../features/transactions/transactionsSlice'

// Pre-step, call this before any NFC operations
NfcManager.start()

const socket = io(SOCKET_SERVER)

const PayTransactionScreen = () => {
  const profileState = useSelector((state) => state.profile)

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const [hasNfc, setHasNFC] = useState(false)

  const [loading, setLoading] = useState(false)

  const [loadSubmit, setLoadSubmit] = useState(false)
  const nfcActionSheet = useRef(null)

  const [done, setDone] = useState(false)

  const [failed, setFailed] = useState(false)
  const navigation = useNavigation()

  const route = useRoute()

  const { data, amount, request, refresh, token } = route.params

  useEffect(() => {
    // client-side
    socket.on('connect', () => {
      // console.log(socket.id) // x8WIv7-mJelg7on_ALbx
    })

    // socket.emit('join', { payhash: request })

    // return () => {
    //   socket.disconnect()
    // }
  }, [])

  useEffect(() => {
    // socket.on('status', (data) => {
    //   setDone(data.paid)
    // })
  }, [])

  useEffect(() => {
    // createActiveInvoice()
  }, [])

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported()

      setHasNFC(deviceIsSupported)

      if (deviceIsSupported) {
        await NfcManager.start()
      }
    }

    checkIsSupported()
  }, [])

  const refreshData = () => {
    fetchBalance(dispatch, user?.userId)
    fetchTransactions(dispatch, user?.userId)
  }

  const createActiveInvoice = async () => {
    try {
      const invoiceData = {
        user: user.userId,
        amount: amount,
        hash: request,
      }
      const res = await axios.post(
        `${API_URL}/invoice/active/create`,
        invoiceData
      )

      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const readNFC = async () => {
    nfcActionSheet.current?.show()
    try {
      // Register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef)

      // Get the tag object
      const tag = await NfcManager.getTag()

      // Get the NDEF message from the tag
      const ndef = tag.ndefMessage

      if (ndef && ndef.length > 0) {
        // Get the first record from the NDEF message
        const record = ndef[0]

        if (record && record.payload) {
          // Parse the string data from the payload
          const textData = record.payload
            .map((byte) => String.fromCharCode(byte))
            .join('')

          // Remove the 'en' prefix and get the exact string
          const exactStr = textData.substring(3)

          // Display the exact string
          // console.log('Exact string read from NFC tag:', exactStr)
          nfcActionSheet.current?.hide()
          handleNFCPay(exactStr)

          // await NfcManager.cancelTechnologyRequest()
        }
      } else {
        console.log('NDEF message not found on the tag')
        nfcActionSheet.current?.hide()
        // await NfcManager.cancelTechnologyRequest()
      }
    } catch (ex) {
      console.log('Oops!', ex)
      nfcActionSheet.current?.hide()
      await NfcManager.cancelTechnologyRequest()
    } finally {
      // stop the nfc scanning
      nfcActionSheet.current?.hide()
      await NfcManager.cancelTechnologyRequest()
    }
  }

  const handleNFCPay = async (tag) => {
    setLoadSubmit(true)
    try {
      const invoiceData = {
        tagNo: tag,
        invoice: data,
        to: user.userId,
        amount: amount,
        token: token,
      }

      const res = await axios.post(
        `${API_URL}/invoice/pay/busd/nfc`,
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      if (res.data.success) {
        // socket.emit('status', { payhash: request, paid: true })

        // socket.emit('sendTxNotification', {
        //   recipientId: res.data.data._id,
        //   message: {
        //     title: 'You sent a payment',
        //     subtitle: `to @${res.data.data.name}`,
        //     body: `Payment done with your card! 😎`,
        //   },
        // })

        setDone(true)
      } else {
        setFailed(true)
        // socket.emit('status', { payhash: request, paid: false })
      }

      setLoadSubmit(false)
    } catch (error) {
      console.log(error.message)
      setLoadSubmit(false)
      setFailed(true)
    }
  }

  if (loadSubmit) return <SendingMoney />

  if (done) return <TransactionDone refresh={refreshData} />

  if (failed) return <TransactionFailed />

  return (
    <View className="flex flex-col flex-1">
      <View className="flex flex-row items-center justify-between p-5">
        <AppText classProps="text-2xl font-bold">Payment</AppText>

        <View className="flex items-center justify-center flex-1">
          <Text className="p-2 font-bold bg-yellow-100 rounded-full text-primary">
            BUSD
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <AntDesign name="close" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex items-center flex-1 justify-evenly ">
        <View className="flex flex-col items-center justify-center ">
          <View className="flex flex-row">
            <AppText classProps="text-sm">UGX</AppText>
            <AppText classProps="text-6xl font-bold">{amount}</AppText>
          </View>
          <AppText classProps="text-base font-light">
            Invoice created by @{profileState.profile.name}
          </AppText>
        </View>

        <QRCODE data={data} />

        <View className="flex flex-col items-center justify-center">
          <AppText classProps="text-base">Shuku there!</AppText>
        </View>
      </View>

      <View className="flex flex-row w-full px-5 py-5">
        {hasNfc && (
          <Pressable
            onPress={readNFC}
            className="flex items-center justify-center flex-1 p-4 mr-2 rounded-full bg-primary"
          >
            <AppText classProps="text-xl font-bold">Card</AppText>
          </Pressable>
        )}
        <Pressable
          onPress={() => {}}
          className="flex items-center justify-center flex-1 p-4 ml-2 bg-white border-2 rounded-full border-primary"
        >
          <Text className="text-xl font-bold text-primary">Copy</Text>
        </Pressable>
      </View>
      <NFCSheet
        sendActionSheet={nfcActionSheet}
        // refresh={refreshEveryThing}
      />
    </View>
  )
}

export default PayTransactionScreen

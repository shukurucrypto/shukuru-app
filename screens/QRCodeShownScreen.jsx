import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Lottie from 'lottie-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import QRCODE from '../components/QRCode'
import AppText from '../components/AppText'
import { useSelector } from 'react-redux'
import { API_URL, SOCKET_SERVER } from '../apiURL'
import { io } from 'socket.io-client'
import TransactionDone from './Animators/TransactionDone'
import NfcManager, { NfcTech } from 'react-native-nfc-manager'
import NFCSheet from '../components/Sheets/NFCSheet'
import TransactionFailed from './Animators/TransactionFailed'
import SendingMoney from '../components/Loading/SendingMoney'
import useSendOneSignal from '../Notifications/useSendOneSignal'
import Clipboard from '@react-native-clipboard/clipboard'

// Pre-step, call this before any NFC operations
NfcManager.start()

const socket = io(SOCKET_SERVER)

const QRCodeShownScreen = () => {
  const profileState = useSelector((state) => state.profile)

  const { user } = useSelector((state) => state.user)
  const [hasNfc, setHasNFC] = useState(false)

  const [loading, setLoading] = useState(false)

  const [loadSubmit, setLoadSubmit] = useState(false)
  const nfcActionSheet = useRef(null)

  const [done, setDone] = useState(false)

  const [copiedInvoice, setCopiedInvoice] = useState(false)

  const [updateCount, setUpdateCount] = useState(0)

  const [failed, setFailed] = useState(false)
  const navigation = useNavigation()

  const balancesState = useSelector((state) => state.balances)

  const sendOnesignal = useSendOneSignal()

  const route = useRoute()

  const { data, amount, request, refresh } = route.params

  useEffect(() => {
    // client-side
    socket.on('connect', () => {
      // console.log(socket.id) // x8WIv7-mJelg7on_ALbx
    })

    socket.emit('join', { payhash: request })

    // return () => {
    //   socket.disconnect()
    // }
  }, [])

  useEffect(() => {
    if (updateCount <= 60) {
      getBTCBalance()
    }
  }, [updateCount])

  const getBTCBalance = async () => {
    try {
      const res = await axios.get(`${API_URL}/wallet/btc/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (res.data.success) {
        if (res.data.data > balancesState.balances.lightning) {
          setDone(true)
          setUpdateCount(2000)

          // Create Tx here...
          createExBTCTX()
        } else {
          setUpdateCount((prev) => (prev += 1))
        }
      } else {
        setUpdateCount(2000)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    socket.on('status', (data) => {
      setDone(data.paid)
    })
  }, [])

  useEffect(() => {
    createActiveInvoice()
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
        }
      } else {
        console.log('NDEF message not found on the tag')
        nfcActionSheet.current?.hide()
      }
      NfcManager.cancelTechnologyRequest()
    } catch (ex) {
      console.log('Oops!', ex)
      nfcActionSheet.current?.hide()
      NfcManager.cancelTechnologyRequest()
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest()
      nfcActionSheet.current?.hide()
    }
  }

  const createExBTCTX = async () => {
    try {
      const invoiceData = {
        invoice: data,
        amount: amount,
      }
      const res = await axios.post(
        `${API_URL}/wallet/exbtc/create`,
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      sendOnesignal(
        `You received a new Lightning payment`,
        'Recieved via app. Congrats! 🎉',
        [user.userId]
      )
      return res.data
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleNFCPay = async (tag) => {
    setLoadSubmit(true)
    try {
      const invoiceData = {
        tagNo: tag,
        invoice: data,
        amount: amount,
      }
      const res = await axios.post(`${API_URL}/invoice/pay/nfc`, invoiceData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (res.data.success) {
        socket.emit('status', { payhash: request, paid: true })

        socket.emit('sendTxNotification', {
          recipientId: res.data.data._id,
          message: {
            title: `You sent a ${res.data.tx.asset} payment`,
            subtitle: `to @${res.data.data.name}`,
            body: `Payment done with your card! 😎`,
          },
        })

        sendOnesignal(
          `You sent a ${res.data.tx.asset} payment`,
          `Payment done with your card! 😎`,
          [res.data.tx.sender]
        )

        setDone(true)
      } else {
        setFailed(true)
        socket.emit('status', { payhash: request, paid: false })
      }

      setLoadSubmit(false)
    } catch (error) {
      console.log(error.message)
      setLoadSubmit(false)
      setFailed(true)
    }
  }

  const copyToClipboard = () => {
    setCopiedInvoice(true)
    Clipboard.setString(data)

    setTimeout(() => {
      setCopiedInvoice(false)
    }, 4000)
  }

  if (loadSubmit) return <SendingMoney />

  if (done) return <TransactionDone refresh={refresh} />

  if (failed) return <TransactionFailed />

  return (
    <View className="flex flex-col flex-1">
      <View className="flex flex-row items-center justify-between p-5">
        <AppText classProps="text-2xl font-bold">Invoice</AppText>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <AntDesign name="close" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex items-center flex-1 justify-evenly ">
        <View className="flex flex-col items-center ">
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
          <AppText classProps="text-base">Hello pay 👋😀</AppText>
        </View>
      </View>

      <View className="w-full h-14 ">
        <Lottie
          source={require('../assets/animations/waiting.json')}
          autoPlay
          loop
        />
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
          onPress={copyToClipboard}
          className="flex items-center justify-center flex-1 p-4 ml-2 bg-white border-2 rounded-full border-primary"
        >
          <Text className="text-xl font-bold text-primary">
            {copiedInvoice ? 'Copied!' : 'Copy'}
          </Text>
        </Pressable>
      </View>
      <NFCSheet
        sendActionSheet={nfcActionSheet}
        // refresh={refreshEveryThing}
      />
    </View>
  )
}

export default QRCodeShownScreen

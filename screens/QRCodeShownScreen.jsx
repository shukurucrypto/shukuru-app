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
import TransactionFailed from './Animators/TransactionFailed'
import SendingMoney from '../components/Loading/SendingMoney'
import useSendOneSignal from '../Notifications/useSendOneSignal'
import Clipboard from '@react-native-clipboard/clipboard'

const socket = io(SOCKET_SERVER)

const QRCodeShownScreen = () => {
  const profileState = useSelector((state) => state.profile)

  const { user } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)

  const [loadSubmit, setLoadSubmit] = useState(false)

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
        <Pressable
          onPress={copyToClipboard}
          className="flex items-center justify-center flex-1 p-4 ml-2 bg-white border-2 rounded-full border-primary"
        >
          <Text className="text-xl font-bold text-primary">
            {copiedInvoice ? 'Copied!' : 'Copy'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default QRCodeShownScreen

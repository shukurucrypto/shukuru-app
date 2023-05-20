import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppText from '../components/AppText'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { API_URL, SOCKET_SERVER } from '../apiURL'
import TransactionDone from './Animators/TransactionDone'
import TransactionFailed from './Animators/TransactionFailed'
import { io } from 'socket.io-client'
import NFCSheet from '../components/Sheets/NFCSheet'
const socket = io(SOCKET_SERVER)

const ReadInvoiceScreen = () => {
  const navigation = useNavigation()
  const router = useRoute()

  const { user } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [loadSubmit, setLoadSubmit] = useState(false)
  const [invoiceState, setInvoiceState] = useState({})
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)

  const { data, refresh } = router.params

  useEffect(() => {
    // client-side
    socket.on('connect', () => {
      console.log(socket.id)
    })

    // return () => {
    //   socket.disconnect()
    // }
  }, [])

  useEffect(() => {
    decodeInvoice()
  }, [])

  const decodeInvoice = async () => {
    setLoading(true)
    try {
      const invoiceData = {
        userId: user.userId,
        invoice: data,
      }
      const res = await axios.post(`${API_URL}/invoice/decode`, invoiceData)

      if (res.data.success) {
        setInvoiceState(res.data.data)
        socket.emit('join', { payhash: res.data.data.hash })
      }

      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const handlePay = async () => {
    setLoadSubmit(true)
    try {
      const invoiceData = {
        from: user.userId,
        invoice: data,
        amount: invoiceState.amount,
      }

      const res = await axios.post(`${API_URL}/invoice/pay`, invoiceData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (res.data.success) {
        socket.emit('status', { payhash: invoiceState.hash, paid: true })
        setDone(true)
      } else {
        setFailed(true)
        socket.emit('status', { payhash: invoiceState.hash, paid: false })
      }

      setLoadSubmit(false)
    } catch (error) {
      console.log(error.message)
      setLoadSubmit(false)
    }
  }

  if (done) return <TransactionDone refresh={refresh} />

  if (failed) return <TransactionFailed />

  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-1 p-5">
        <View className="flex flex-row items-center justify-between">
          <AppText classProps="text-2xl font-bold">Payment</AppText>

          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <AntDesign name="close" size={25} color="black" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex items-center justify-center flex-1">
            <ActivityIndicator size={55} color="#FBC609" />
          </View>
        ) : (
          <>
            {/* AMount */}
            <View className="flex items-center flex-1 justify-evenly ">
              <View className="flex flex-col items-center justify-center ">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={135}
                  color="#FBC609"
                />
                <View className="flex flex-row mt-8 mb-4">
                  <AppText classProps="text-5xl font-bold">
                    {invoiceState.amount
                      ?.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    sats
                  </AppText>
                </View>
                <AppText classProps="text-lg font-light text-center">
                  {invoiceState.memo}
                </AppText>
                <AppText classProps="text-lg font-light text-center">
                  Created {invoiceState.date}
                </AppText>
                <AppText classProps="text-lg font-light text-center">
                  Expires in {invoiceState.expiry} (secs)
                </AppText>
              </View>
            </View>

            <View className="flex w-full px-5 py-5">
              <Pressable
                onPress={handlePay}
                disabled={loadSubmit}
                className="flex items-center justify-center w-full p-4 rounded-full bg-primary"
              >
                {loadSubmit ? (
                  <ActivityIndicator size={22} color="#fff" />
                ) : (
                  <AppText classProps="text-xl font-bold">Send</AppText>
                )}
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

export default ReadInvoiceScreen

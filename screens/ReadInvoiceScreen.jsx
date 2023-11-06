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
import SendingMoney from '../components/Loading/SendingMoney'
import useAPIPostRequest from '../helpers/apiRequests'
import useRefresh from '../hooks/useRefresh'
const socket = io(SOCKET_SERVER)

const ReadInvoiceScreen = () => {
  const navigation = useNavigation()
  const router = useRoute()

  const { user } = useSelector((state) => state.user)

  const balancesState = useSelector((state) => state.balances)

  const [loading, setLoading] = useState(false)
  const [loadSubmit, setLoadSubmit] = useState(false)
  const [invoiceState, setInvoiceState] = useState({})
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)
  const [error, setErr] = useState('')

  const [updateCount, setUpdateCount] = useState(0)

  const { data } = router.params

  const { refresh } = useRefresh()

  const { request } = useAPIPostRequest()

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
      // const res = await axios.post(`${API_URL}/invoice/decode`, invoiceData)

      const res = await request(invoiceData, '/invoice/decode')

      if (res.data) {
        setInvoiceState(res.data)
        socket.emit('join', { payhash: res.data.hash })
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

      const res = await request(invoiceData, '/invoice/pay')

      if (res.success) {
        socket.emit('status', { payhash: invoiceState.hash, paid: true })

        setDone(true)
        setFailed(false)
        setLoadSubmit(false)
      } else {
        setErr(res.error.response)
        setFailed(true)
        setLoadSubmit(false)
      }
    } catch (error) {
      console.log(error)
      setLoadSubmit(false)
    }
  }

  const getBTCBalance = async () => {
    try {
      const res = await axios.get(`${API_URL}/wallet/btc/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (res.data.success) {
        if (res.data.data < balancesState.balances.lightning) {
          setDone(true)
          setUpdateCount(2000)

          // Create Tx here...
          // createExBTCTX()
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

  if (loadSubmit) return <SendingMoney />

  if (done) return <TransactionDone refresh={refresh} />

  if (failed) return <TransactionFailed msg={error} />

  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-1 p-5">
        <View className="flex flex-row items-center justify-between">
          <AppText classProps="text-2xl font-bold">Invoice details</AppText>

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

                <View className="gap-4">
                  <AppText classProps="text-lg font-light text-center mt-3">
                    {invoiceState.memo}
                  </AppText>
                  <AppText classProps="text-sm font-light text-center my-3">
                    Created {invoiceState.date}
                  </AppText>
                  <AppText classProps="text-sm font-light text-center">
                    Expires in {invoiceState.expiry} (secs)
                  </AppText>
                </View>
              </View>

              {error && (
                <Text className="p-1 px-3 text-xs rounded-md text-primary bg-neutral-700">
                  {error}
                </Text>
              )}
            </View>

            <View className="flex w-full px-5 py-5">
              <Pressable
                onPress={handlePay}
                disabled={loadSubmit || !invoiceState}
                className={`flex items-center justify-center w-full p-4 rounded-full ${
                  loadSubmit || !invoiceState ? 'bg-neutral-200' : ' bg-primary'
                }`}
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

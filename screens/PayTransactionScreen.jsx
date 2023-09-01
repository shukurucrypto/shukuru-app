import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import Lottie from 'lottie-react-native'
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
import TransactionFailed from './Animators/TransactionFailed'
import SendingMoney from '../components/Loading/SendingMoney'
import { fetchBalance } from '../features/balances/balancesSlice'
import { fetchTransactions } from '../features/transactions/transactionsSlice'
import { fetchCheckreward } from '../features/rewards/rewardsSlice'
import { fetchUserGas } from '../features/gas/gasSlice'

const PayTransactionScreen = () => {
  const profileState = useSelector((state) => state.profile)

  const balancesState = useSelector((state) => state.balances)

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)

  const [filled, setFilled] = useState(true)

  const [loadSubmit, setLoadSubmit] = useState(false)

  const [updateCount, setUpdateCount] = useState(0)

  const [done, setDone] = useState(false)

  const [failed, setFailed] = useState(false)
  const navigation = useNavigation()

  const route = useRoute()

  const { data, amount, request, refresh, token, convertedAmount } =
    route.params

  useEffect(() => {
    if (updateCount <= 100) {
      getWalletBalance()
    }
  }, [updateCount])

  const getWalletBalance = async () => {
    try {
      if (token === 'BUSD') {
        const res = await axios.get(
          `${API_URL}/raw/wallet/busd/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        if (res.data.success) {
          if (
            balancesState.balances.busd &&
            res.data.data > balancesState.balances.busd
          ) {
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
      } else {
        const res = await axios.get(
          `${API_URL}/raw/wallet/cusd/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        if (res.data.success) {
          if (
            balancesState.balances.cusd &&
            res.data.data > balancesState.balances.cusd
          ) {
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
      }
    } catch (error) {
      console.log(error.message)
      setFailed(true)
    }
  }

  const refreshData = () => {
    fetchBalance(dispatch, user?.userId)
    fetchTransactions(dispatch, user?.userId)
    fetchCheckreward(dispatch, user.token)
    fetchUserGas(dispatch, user.userId, user.token)
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

  if (loadSubmit) return <SendingMoney />

  if (done) return <TransactionDone refresh={refreshData} />

  if (failed) return <TransactionFailed />

  return (
    <View className="flex flex-col flex-1">
      <View className="flex flex-row items-center justify-between p-5">
        <AppText classProps="text-2xl font-bold">Payment</AppText>

        <View className="flex items-center justify-center flex-1">
          <Text className="p-2 font-bold bg-yellow-100 rounded-full text-primary">
            {token}
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

        <View className="flex flex-row items-center justify-center w-1/3">
          <Pressable
            onPress={() => setFilled(!filled)}
            className={`p-2 px-2 border-[0.8px] rounded-l-full ${
              filled && 'bg-green-600'
            } border-green-600  w-full items-center justify-center`}
          >
            <Text className={filled ? 'text-white' : 'text-green-600'}>
              Prefill
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilled(!filled)}
            className={`p-2 px-2 border-[0.8px] rounded-r-full ${
              !filled && 'bg-green-600'
            } border-green-600 w-full items-center justify-center`}
          >
            <Text className={!filled ? 'text-white' : 'text-green-600'}>
              Address Only
            </Text>
          </Pressable>
        </View>

        {filled ? (
          <QRCODE
            data={`ethereum:${data}?value=${convertedAmount}?token=${token}`}
          />
        ) : (
          <QRCODE data={data} />
        )}

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
          onPress={() => {}}
          className="flex items-center justify-center flex-1 w-full p-4 ml-2 bg-white border-2 rounded-full border-primary"
        >
          <Text className="text-xl font-bold text-primary">Copy</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default PayTransactionScreen

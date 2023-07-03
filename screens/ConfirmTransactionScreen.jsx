import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import SlideToConfirm from 'rn-slide-to-confirm'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AppText from '../components/AppText'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { API_URL, SOCKET_SERVER } from '../apiURL'
import useSendOneSignal from '../Notifications/useSendOneSignal'
import SendingMoney from '../components/Loading/SendingMoney'
import TransactionDone from './Animators/TransactionDone'
import TransactionFailed from './Animators/TransactionFailed'
import { fetchBalance } from '../features/balances/balancesSlice'
import { fetchTransactions } from '../features/transactions/transactionsSlice'
import { io } from 'socket.io-client'
import { fetchCheckreward } from '../features/rewards/rewardsSlice'

const socket = io(SOCKET_SERVER)

const ConfirmTransactionScreen = () => {
  const { profile } = useSelector((state) => state.profile)

  const userState = useSelector((state) => state.user)

  const [gas, setGas] = useState(null)

  const [loading, setLoading] = useState(false)

  const [submitLoading, setSubmitLoading] = useState(false)

  const [done, setDone] = useState(false)

  const [failed, setFailed] = useState(false)

  const [total, setTotal] = useState(null)

  const [error, setError] = useState('')

  const width = useWindowDimensions().width

  const navigation = useNavigation()

  const router = useRoute()

  const dispatch = useDispatch()

  const { data, token, contactNumber, userId } = router.params

  const [sliderState, setSliderState] = useState(false)

  useEffect(() => {
    getGasEstimate()
  }, [])

  const getGasEstimate = async () => {
    setLoading(true)
    try {
      let res
      if (token === 'BUSD') {
        res = await axios.post(`${API_URL}/gas/busd`, data)
      } else {
        res = await axios.post(`${API_URL}/gas/cusd`, data)
      }

      if (res.data.success) {
        setGas(res.data.data)

        setTotal(Number(data.amount) + Number(res.data.data))
      }

      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    // return
    // setSliderState(true)
    setSubmitLoading(true)
    try {
      let PAY_URL

      if (token === 'cUSD') {
        PAY_URL = `${API_URL}/send/cusd`
      } else {
        PAY_URL = `${API_URL}/send/busd`
      }

      const result = await axios.post(PAY_URL, data, {
        headers: {
          Authorization: `Bearer ${userState.user.token}`,
        },
      })

      if (result.data.success) {
        socket.emit('sendTxNotification', {
          recipientId: userId,
          message: {
            title: 'You received a new payment',
            subtitle: `@${result.data.data.name}`,
            // body: `Paid in ${token} Congrats! 🎉`,
            body: `Recieved via app. Congrats! 🎉`,
          },
        })

        useSendOneSignal(
          `You received a new ${result.data.tx.asset} payment`,
          'Recieved via app. Congrats! 🎉',
          [result.data.tx.receiver]
        )

        setSubmitLoading(false)
        setDone(true)
      } else {
        setSubmitLoading(false)
        setFailed(true)
      }
    } catch (error) {
      setSubmitLoading(false)
    }
  }

  const refresh = () => {
    fetchBalance(dispatch, userState.user.userId)
    fetchTransactions(dispatch, userState.user.userId)
    fetchCheckreward(dispatch, userState.user.token)
    // fetchBTCTransactions()
  }

  if (loading)
    return (
      <View className="flex items-center justify-center flex-1">
        <ActivityIndicator size={35} color="#FBC609" />
      </View>
    )

  if (submitLoading) return <SendingMoney />

  if (done) return <TransactionDone token={token} refresh={refresh} />

  if (failed) return <TransactionFailed />

  return (
    <SafeAreaView className="flex flex-1 ">
      <View className="flex flex-col justify-between flex-1">
        <View className="flex flex-row items-center p-5 border-b-[0.8px] border-neutral-200">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex flex-row items-center"
          >
            <MaterialIcons name="arrow-back-ios" color="black" size={22} />
            <AppText classProps="text-lg font-bold">
              Transaction Summary
            </AppText>
          </Pressable>
        </View>

        <View className="flex items-center justify-center flex-1 ">
          {token === 'cUSD' ? (
            <View className="relative flex items-center justify-center w-12 h-12 rounded-full ">
              <Image
                source={require('../assets/tokens/cusd.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View className="flex items-center justify-center w-16 h-16 bg-black rounded-full">
              <Image
                source={require('../assets/tokens/busd.png')}
                style={{ width: 40, height: 40 }}
              />
            </View>
          )}
          <View className="items-center my-3">
            <AppText classProps="text-3xl font-medium ">
              {profile.country} {data.amount}
            </AppText>
            <Text className="text-xs">({token})</Text>
          </View>
        </View>

        {/* Main info */}
        <View className="flex items-center justify-center flex-1 p-5">
          <View className="w-full rounded-md border-[0.8px] border-neutral-300">
            <View className="flex-row items-center justify-between w-full p-5 border-b-[0.8px] border-neutral-300">
              <AppText classProps="text-lg">From</AppText>
              <AppText classProps="text-lg font-bold">
                @{profile.name}
                <Text className="text-lg font-bold text-neutral-500">
                  {' '}
                  (
                  {profile.address.slice(0, 3) +
                    '...' +
                    profile.address.slice(-3)}
                  )
                </Text>
              </AppText>
            </View>

            {/*  */}
            <View className="flex-row items-center justify-between w-full p-5 border-b-[0.8px] border-neutral-300">
              <AppText classProps="text-lg">To</AppText>
              <AppText classProps="text-lg font-bold">
                +
                <Text className="text-lg font-bold text-neutral-500">
                  ({contactNumber.slice(0, 3) + '...' + contactNumber.slice(-2)}
                  )
                </Text>
              </AppText>
            </View>

            {/*  */}
            <View className="flex-row items-center justify-between w-full p-5 border-b-[0.8px] border-neutral-300">
              <AppText classProps="text-lg">Network Fee</AppText>

              {gas ? (
                <AppText classProps="text-base font-bold">
                  {profile.country} {Number(gas).toFixed(2)}
                </AppText>
              ) : (
                <Pressable
                  onPress={() => navigation.navigate('TopUpGasScreen')}
                  className="flex flex-col"
                >
                  <Text className="text-base text-red-500">
                    You're low on gas
                  </Text>

                  <View className="flex flex-row items-center mt-1 ">
                    <Text className="mr-1 text-xs font-medium text-green-500 ">
                      Fill up?
                    </Text>
                    <MaterialIcons
                      name="open-in-new"
                      color="#22c55e"
                      size={15}
                    />
                  </View>
                </Pressable>
              )}
            </View>

            {gas && (
              <View className="flex-row items-center justify-between w-full p-5 ">
                <AppText classProps="text-lg">Total</AppText>

                <AppText classProps="text-base font-bold">
                  {profile.country} {Number(total).toFixed(2)}
                </AppText>
              </View>
            )}
          </View>
        </View>

        <View className="flex items-center justify-end flex-1 p-5">
          {gas ? (
            <SlideToConfirm
              unconfimredTipText={'Slide to confirm'}
              unconfirmedTipTextStyle={{
                color: 'white',
                fontSize: 20,
              }}
              confirmedTipText={'Confirmed  ✅'}
              confirmedTipTextStyle={{
                color: 'white',
                fontSize: 22,
              }}
              state={sliderState}
              onSlideConfirmed={handleSubmit}
              sliderStyle={{
                justifyContent: 'center',
                backgroundColor: '#FBC609',
                width: width - 30,
                height: 55,
                borderRadius: 8,
                padding: 5,
                overflow: 'hidden',
              }}
              ballPadding={8}
            />
          ) : (
            <Pressable
              onPress={() => navigation.goBack()}
              className="flex flex-row items-center justify-center w-full p-5 rounded-full bg-neutral-100 "
            >
              <AppText classProps="text-lg font-bold">Back</AppText>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ConfirmTransactionScreen

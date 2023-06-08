import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import React, { useEffect, useState } from 'react'
import SlideToConfirm from 'rn-slide-to-confirm'

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

const socket = io(SOCKET_SERVER)

const EVMConfirmTXScreen = () => {
  const { profile } = useSelector((state) => state.profile)

  const userState = useSelector((state) => state.user)

  const [gas, setGas] = useState(null)

  const [loading, setLoading] = useState(false)

  const [submitLoading, setSubmitLoading] = useState(false)

  const [done, setDone] = useState(false)

  const [failed, setFailed] = useState(false)

  const [total, setTotal] = useState(null)

  const [error, setError] = useState('')

  const [localSpend, setLocalSpend] = useState(0)

  const [txObj, setTxObj] = useState({})

  const width = useWindowDimensions().width

  const navigation = useNavigation()

  const router = useRoute()

  const dispatch = useDispatch()

  const { data, token, contactNumber, userId } = router.params

  const [sliderState, setSliderState] = useState(false)

  useEffect(() => {
    const getTxObj = async () => {
      if (data.startsWith('ethereum')) {
        // Remove the "ethereum:" prefix from the string
        const cleanedString = data.replace('ethereum:', '')

        // Split the string into parts using "?" as the delimiter
        const parts = cleanedString.split('?')

        // Extract the address and value from the parts
        const address = parts[0]
        const value = parts[1].replace('value=', '')
        const token = parts[2].replace('token=', '')

        // Create the JSON object
        const jsonObject = {
          to: address,
          value: value,
          token: token,
        }

        setTxObj(jsonObject)

        await getGasEstimate(token, address, value)
      } else if (
        data.hasOwnProperty('address') &&
        data.hasOwnProperty('amount')
      ) {
        const jsonObject = {
          to: data.address,
          value: data.amount,
        }

        setTxObj(jsonObject)
      } else {
        navigation.goBack()
      }
    }

    getTxObj()
  }, [])

  //   useEffect(() => {
  //     getGasEstimate()
  //   }, [])

  const getGasEstimate = async (token, toAddress, amount) => {
    setLoading(true)
    try {
      const gasData = {
        from: profile.address,
        to: toAddress,
        amount: amount,
      }
      let res
      if (token === 'BUSD') {
        res = await axios.post(`${API_URL}/raw/gas/busd`, gasData)
      } else {
        res = await axios.post(`${API_URL}/raw/gas/cusd`, gasData)
      }

      if (res.data.success) {
        setGas(res.data.data)

        setLocalSpend(res.data.spend)

        setTotal(Number(res.data.spend) + Number(res.data.data))
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

      const payData = {
        from: profile.address,
        to: txObj.to,
        amount: localSpend,
      }

      if (txObj.token === 'cUSD') {
        PAY_URL = `${API_URL}/send/raw/cusd`
      } else {
        PAY_URL = `${API_URL}/send/raw/busd`
      }

      const result = await axios.post(PAY_URL, payData, {
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
      console.log(error.message)
      setSubmitLoading(false)
    }
  }

  const refresh = () => {
    fetchBalance(dispatch, userState.user.userId)
    fetchTransactions(dispatch, userState.user.userId)
    // fetchBTCTransactions()
  }

  if (loading)
    return (
      <View className="flex items-center justify-center flex-1">
        <ActivityIndicator size={45} color="#FBC609" />
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

        {txObj && (
          <>
            <View className="flex items-center justify-center flex-1 p-5 ">
              <View className="w-full rounded-md border-[0.8px] border-neutral-300 flex items-center">
                <View className="flex-row items-center justify-between w-full p-3 border-b-[0.8px] border-neutral-300">
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
                <View className="flex-row items-center justify-between w-full p-3 border-b-[0.8px] border-neutral-300">
                  <AppText classProps="text-lg">To</AppText>
                  <AppText classProps="text-lg font-bold">
                    <Text className="text-lg font-bold text-neutral-500">
                      ({txObj?.to?.slice(0, 5) + '...' + txObj?.to?.slice(-5)})
                    </Text>
                  </AppText>
                </View>
              </View>
            </View>

            <View className="flex items-center justify-center flex-1 ">
              <View className="items-center">
                <AppText classProps="font-light my-2">AMOUNT</AppText>
                <AppText classProps="text-4xl font-medium ">
                  {profile.country} {Number(localSpend).toFixed(2)}
                </AppText>
              </View>
            </View>

            <View className="flex items-center flex-1 p-5 ">
              <View className="w-full rounded-md border-[0.8px] border-neutral-300 flex items-center">
                {/*  */}
                <View className="flex-row items-center justify-between w-full p-3 border-b-[0.8px] border-neutral-300">
                  <AppText classProps="text-lg">Network Fee</AppText>

                  {gas ? (
                    <AppText classProps="text-base font-bold">
                      {profile.country} {Number(gas).toFixed(2)}
                    </AppText>
                  ) : (
                    <Text className="text-red-500">Low on gas</Text>
                  )}
                </View>

                {gas && (
                  <View className="flex-row items-center justify-between w-full p-3 ">
                    <AppText classProps="text-lg">Total</AppText>

                    <AppText classProps="text-base font-bold">
                      {profile.country} {Number(total).toFixed(2)}
                    </AppText>
                  </View>
                )}
              </View>
            </View>

            <View className="flex items-center justify-end p-5">
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
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

export default EVMConfirmTXScreen

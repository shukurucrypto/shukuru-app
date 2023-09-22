import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import BackHeader from '../../components/Headers/BackHeader'
import AppText from '../../components/AppText'
import SlideToConfirm from 'rn-slide-to-confirm'
import axios from 'axios'
import { API_URL } from '../../apiURL'
import { useDispatch, useSelector } from 'react-redux'
import TransactionFailed from '../Animators/TransactionFailed'
import { fetchBalance } from '../../features/balances/balancesSlice'
import { fetchTransactions } from '../../features/transactions/transactionsSlice'
import SuccessScreen from './SuccessScreen'
import SendingMoney from '../../components/Loading/SendingMoney'

const ReviewScreen = () => {
  const [loading, setLoading] = useState(false)
  const [txData, setTxData] = useState({})
  const [error, setError] = useState(null)

  const [sliderState, setSliderState] = useState(false)

  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState(null)

  const { user } = useSelector((state) => state.user)

  const { token } = useSelector((state) => state.tokenState)

  const width = useWindowDimensions().width

  const router = useRoute()

  const navigation = useNavigation()

  const dispatch = useDispatch()

  const { data, phone, mobileNetwork } = router.params

  // const onShowNotification = useLocalNotification()

  useEffect(() => {
    fetchQuote()
  }, [])

  const fetchQuote = async () => {
    setLoading(true)
    try {
      const queryData = {
        amount: data.amount,
        asset: data.asset,
        network: data.selectedAsset.network,
      }

      const result = await axios.post(`${API_URL}/quote`, queryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (result.data.success) {
        setTxData(result.data.response)
        setLoading(false)
      } else {
        setLoading(false)
        setError(result.data.response)
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      setError(error.message)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const queryData = {
        amount: data.amount,
        asset: data.tokenAddress,
        phoneNumber: phone,
        asset: data.asset,
        network: data.selectedAsset.network,
      }

      const result = await axios.post(`${API_URL}/withdraw`, queryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (result.data.success) {
        setSubmitting(false)

        // const notifcationData = {
        //   title: `Successfully initiated ${data.asset} withdraw`,
        //   body: `You'll recieve ${data.asset} ${Number(txData.recives).toFixed(
        //     2
        //   )} on ${phone}`,
        // }

        // setTxData(result.data.response)
        // await goThere()
        setDone(true)

        // await onShowNotification(notifcationData)

        refresh()
      } else {
        setSubmitting(false)
        setErrorSubmit(
          'Transaction failed, make sure you have enough funds in your wallet'
        )
      }
    } catch (error) {
      console.log(error)
      setSubmitting(false)
      setErrorSubmit('Something went wrong')
    }
  }

  const goThere = () => navigation.navigate('SuccessScreen')

  if (loading)
    return (
      <View className="flex items-center justify-center flex-1">
        <ActivityIndicator size={22} color="#FBC609" />
      </View>
    )

  const refresh = () => {
    fetchBalance(dispatch, user.userId)
    fetchTransactions(dispatch, user.userId)
  }

  if (submitting) return <SendingMoney />

  if (done) return <SuccessScreen />

  if (errorSubmit) return <TransactionFailed asset="cUSD" />

  return (
    <SafeAreaView className="flex flex-1">
      <BackHeader title="Review" subTitle="Powered by" cancel />

      <View className="flex flex-col flex-1 p-5">
        <View className="flex flex-row items-center justify-between h-20 border-b border-b-neutral-300 ">
          <AppText classProps="text-base font-bold">You will recieve</AppText>
          <AppText classProps="text-base font-bold">
            ${Number(txData.recives).toFixed(3)}
          </AppText>
        </View>

        <View className="flex flex-col py-6 mb-8 border-b border-b-neutral-300">
          <Text className="font-bold text-neutral-500">
            Transaction Details
          </Text>

          <View className="flex flex-col mt-2 ">
            <View className="flex flex-row items-center justify-between">
              <AppText classProps="text-base font-bold ">
                Total Withdraw
              </AppText>
              <AppText classProps="text-base font-bold ">
                ${Number(txData.amount).toFixed(3)}
              </AppText>
            </View>

            {/*  */}
            <View className="flex flex-row items-center justify-between">
              <Text className="text-sm font-light text-neutral-500">
                Estimated Fees
              </Text>
              <Text className="text-sm font-light text-neutral-500">
                ${Number(txData.estimated_fee).toFixed(3)}
              </Text>
            </View>
          </View>
        </View>

        {/* Withdraw to */}
        <View className="flex flex-col">
          <Text className="font-bold text-neutral-500">Withdraw To</Text>
          <AppText classProps="text-lg font-bold">
            {mobileNetwork} (...{phone.slice(-3)})
          </AppText>
        </View>
      </View>

      <Text className="my-4 text-center underline text-neutral-700">
        {txData.memo}
      </Text>

      <View className="p-4">
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
        {/* <Pressable
          onPress={handleSubmit}
          //   navigation.navigate('TerminalScreen', {
          //     asset: selected.includes('cUSD') ? 'cUSD' : 'BUSD',
          //   })
          // }
          disabled={submitting}
          className={`items-center self-center w-full py-3 rounded-full ${
            !submitting ? 'bg-primary' : 'bg-neutral-200'
          } `}
        >
          {submitting ? (
            <ActivityIndicator size={22} color="#fff" />
          ) : (
            <Text
              className={`text-base font-bold ${
                submitting ? 'text-white' : 'text-black'
              }`}
            >
              Withdraw Funds
            </Text>
          )}
        </Pressable> */}
      </View>
    </SafeAreaView>
  )
}

export default ReviewScreen

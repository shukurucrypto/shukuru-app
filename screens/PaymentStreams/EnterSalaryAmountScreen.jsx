import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation, useRoute } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { API_URL } from '../../apiURL'
import SendingMoney from '../../components/Loading/SendingMoney'
import TransactionFailed from '../Animators/TransactionFailed'
import useSendOneSignal from '../../Notifications/useSendOneSignal'
import { streamToken } from '../../config/config'
import useLocalNotification from '../../Notifications/Local'

const EnterSalaryAmountScreen = () => {
  const [amount, setAmount] = useState('0.0')
  const [selecetedDuration, setSelectedDuration] = useState('Month')

  const [superTokenBalance, setSuperTokenBalance] = useState(0)

  const { profile } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitErr, setSubmitErr] = useState('')

  const navigation = useNavigation()

  const onDisplayNotification = useLocalNotification()

  const { token } = useSelector((state) => state.tokenState)

  const duration = ['Day', 'Week', 'Month', 'Year']

  const router = useRoute()

  const routeData = router.params

  const sendOnesignal = useSendOneSignal()

  useEffect(() => {
    getSuperTokenBalance()
  }, [])

  const getSuperTokenBalance = async () => {
    setLoading(true)
    try {
      const result = await axios.get(`${API_URL}/stream/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (result.data.success) {
        setSuperTokenBalance(result.data.response)
        setLoading(false)
      } else {
        setLoading(false)
        setError('OOPs!, Failed to fetch data')
      }
    } catch (error) {
      setLoading(false)
      setError('Something went very wrong')
    }
  }

  const handleSubmit = async () => {
    setSubmitLoading(true)
    try {
      const data = {
        reciever: routeData.searchedContact.address,
        recieverId: routeData.searchedContact._id,
        amount: amount,
        duration: selecetedDuration,
      }

      const result = await axios.post(`${API_URL}/stream/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (result.data.success) {
        const { to } = result.data.response

        const notifcationData = {
          title: 'Stream Created! 🎉',
          body: `You'll stream ${profile.country} ${amount} to ${profile.name} per ${selecetedDuration}`,
        }

        await onDisplayNotification(notifcationData)

        sendOnesignal(
          `${profile.name} has add you to their ${selecetedDuration} earner's list`,
          `You will earn ${profile.country} ${amount} per ${selecetedDuration}! 🎉`,
          [to]
        )

        navigation.navigate('Home')

        setSubmitLoading(false)
      } else {
        setSubmitLoading(false)
      }
    } catch (error) {
      console.log(error)
      setSubmitLoading(false)
    }
  }

  if (submitLoading) return <SendingMoney />

  if (submitErr) return <TransactionFailed />

  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-row items-center justify-between h-16 ">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-1 m-2"
        >
          <AntDesign name="arrowleft" size={30} color="black" />
        </Pressable>

        <View className="flex flex-col items-center">
          <Text className="text-base font-bold text-black">
            Complete payout details
          </Text>

          <View className="flex flex-row">
            <Text className="text-xs font-extralight ">Powered by </Text>
            <Text className="text-xs text-black">Superfluid</Text>
          </View>
        </View>

        <View className="flex flex-1" />
      </View>

      {loading ? (
        <View className="flex items-center justify-center flex-1 ">
          <ActivityIndicator size={35} color="#FBC609" />
        </View>
      ) : (
        <>
          <View className="flex flex-col justify-between flex-1 p-4 pt-5">
            <View className="flex flex-col flex-1 ">
              {/* Reciver */}

              <Text className="mt-3 font-light text-black">Payment to</Text>
              <View className="flex flex-row items-center w-full py-2 mb-3 rounded-md ">
                <View className="items-center justify-center w-10 h-10 bg-orange-400 rounded-full">
                  <Text className="text-lg font-extrabold text-white">
                    {routeData.searchedContact?.name.slice(0, 1)}
                  </Text>
                </View>

                {/* User info */}
                <View className="flex flex-col flex-1 px-3">
                  <Text className="text-base font-bold text-black">
                    @{routeData.searchedContact.name}
                  </Text>
                  <Text className="text-sm font-light text-neutral-600">
                    {routeData.searchedContact.address.slice(0, 3)} ...
                    {routeData.searchedContact.address.slice(-3)}
                  </Text>
                </View>

                <Pressable
                  onPress={() => navigation.goBack()}
                  className="items-center justify-center "
                >
                  <AntDesign name="closecircle" size={20} color="#FBC609" />
                </Pressable>
              </View>

              <Text className="mt-8 mb-2 font-light text-black">
                Enter amount in{' '}
                <Text className="font-bold">{profile.country}</Text>
              </Text>
              <View className="flex flex-row w-full mt-1">
                <TextInput
                  placeholder="0.0"
                  keyboardType="number-pad"
                  value={amount}
                  onChangeText={(e) => setAmount(e)}
                  className="p-3 border-[0.8px] w-2/3 rounded-l-lg border-neutral-300 h-14  text-black"
                />
                <View className="border-[0.8px] border-neutral-300 rounded-r-lg w-28 flex items-center border-l-0 px-3 flex-row justify-between">
                  <SelectDropdown
                    data={duration}
                    onSelect={(selectedItem, index) => {
                      // console.log(selectedItem, index)
                      setSelectedDuration(selectedItem)
                    }}
                    defaultValue={'Month'}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                      return item
                    }}
                    buttonStyle={{
                      backgroundColor: '#fff',
                      width: '100%',
                    }}
                  />

                  {/* <MaterialIcons name="arrow-drop-down" size={24} color="black" /> */}
                </View>
              </View>

              <View className="flex flex-row items-center justify-between mt-8">
                <Text className="text-base text-black">
                  Balance: {Number(superTokenBalance).toFixed(2)}
                </Text>

                <View className="flex flex-row items-center">
                  <View className="w-8 h-8 p-1 bg-[#2774CA] rounded-full">
                    <Image
                      source={streamToken.icon}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                  <Text className="mx-2 text-lg text-black">
                    {streamToken.name}
                  </Text>
                </View>
              </View>

              {/* Summary */}
            </View>

            <Pressable
              // onPress={() => navigation.navigate('CurrentStreamsScreen')}
              onPress={handleSubmit}
              disabled={amount <= 0}
              className={`items-center justify-center w-full p-4 rounded-lg ${
                amount <= 0 ? 'bg-neutral-100' : 'bg-primary'
              }`}
            >
              <Text
                className={`text-base font-bold ${
                  amount <= 0 ? 'text-neutral-300' : 'text-black'
                }`}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

export default EnterSalaryAmountScreen

{
  /* <View className="w-full p-2 mt-8 border-[0.8px] border-green-500 rounded-lg bg-green-50">
            <View className="flex flex-row items-center justify-between w-full my-2">
              <Text className="font-medium text-green-900">Receiver</Text>
              <Text className="font-bold text-green-500">0xD2..824</Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full my-2">
              <Text className="font-medium text-green-900">Flow rate</Text>
              <Text className="font-bold text-green-500">5 fDAIx/month</Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full my-2">
              <Text className="font-medium text-green-900">
                Amount per second
              </Text>
              <Text className="font-bold text-green-500">
                0.007519025 fDAIx
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full my-2">
              <Text className="font-medium text-green-900">Date</Text>
              <Text className="font-bold text-green-500">
                01/24/3689 at 8:18 PM
              </Text>
            </View>
          </View> */
}

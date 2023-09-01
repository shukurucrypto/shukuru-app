import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Lottie from 'lottie-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import AppText from '../../components/AppText'

import stream from '../../assets/animations/stream.json'
import dai from '../../assets/tokens/dai.png'
import usdc from '../../assets/tokens/usdc.png'
import axios from 'axios'
import { API_URL } from '../../apiURL'
import { useSelector } from 'react-redux'
import useSendOneSignal from '../../Notifications/useSendOneSignal'
import { streamToken } from '../../config/config'

const CurrentStreamsScreen = () => {
  const [paid, setPaid] = useState(4.345)
  const [counter, setCounter] = useState(0)

  const [initialBalance, setInitialBalance] = useState(1000)
  const [flowRate, setFlowRate] = useState(null)

  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const sendOnesignal = useSendOneSignal()

  const [superTokenBalance, setSuperTokenBalance] = useState(0)

  const router = useRoute()

  const { token } = useSelector((state) => state.tokenState)

  const { profile } = useSelector((state) => state.profile)

  const navigation = useNavigation()

  const { item } = router.params

  useEffect(() => {
    getAccountStreams()
    getSuperTokenBalance()
  }, [])

  useEffect(() => {
    let interval

    // Start the auto counter
    interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (counter >= flowRate) {
          return 0
        } else {
          return prevCounter + flowRate
        }
      })
    }, 100) // Update every 1000 milliseconds (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(interval)
  }, [flowRate])

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

  const getAccountStreams = async () => {
    setLoading(true)
    try {
      const result = await axios.get(`${API_URL}/stream/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (result.data.success) {
        // navigation.navigate('CurrentStreamsScreen')
        setLoading(false)
        const { deposit, flowRate } = result.data.response
        const flowRatePerSecs = Number(flowRate) / 10 ** 18

        setFlowRate(flowRatePerSecs)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const stopAccountStreams = async () => {
    setSubmitLoading(true)
    try {
      const result = await axios.get(`${API_URL}/stream/stop`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (result.data.success) {
        setSubmitLoading(false)

        sendOnesignal(
          `Your earning was stopped today`,
          `${profile.name} has REMOVED you from their earners 💔`,
          [item.to]
        )

        navigation.navigate('Home')
      } else {
        setSubmitLoading(false)
      }
    } catch (error) {
      console.log(error)
      setSubmitLoading(false)
    }
  }

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
          <Text className="text-base font-bold text-black">Active </Text>

          <View className="flex flex-row">
            <Text className="text-xs text-black font-extralight ">
              Powered by{' '}
            </Text>
            <Text className="text-xs text-black">Superfluid</Text>
          </View>
        </View>

        <View className="flex flex-1" />
      </View>

      {loading ? (
        <View className="flex items-center justify-center flex-1">
          <ActivityIndicator size={25} color="#FBC609" />
        </View>
      ) : (
        <>
          <View className="flex flex-col flex-1 p-5 my-3 ">
            {/* User stream */}
            <View className="flex flex-col items-center w-full ">
              <AppText classProps="text-base font-bold">
                Total amount{' '}
                {item.to == profile._id ? 'streamed in' : 'streamed'}
              </AppText>

              {/* Amount streamed */}
              <View className="flex flex-row items-center mt-6">
                <View className="w-12 h-12 p-1 bg-[#2774CA] rounded-full">
                  <Image
                    source={streamToken.icon}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>

                {/* <CountdownComponent
              initialBalance={initialBalance}
              flowRate={flowRate}
            /> */}

                <AppText classProps="text-4xl font-bold mx-3">
                  {Number(superTokenBalance).toFixed(2)}
                </AppText>

                <Text className="text-lg font-bold text-green-500">
                  {streamToken.name}
                </Text>
              </View>

              {item.to != profile._id && (
                <AppText classProps="font-bold mx-3 mt-2 text-base">
                  + {Number(counter).toFixed(6)}{' '}
                  <Text className="text-sm font-normal text-black">
                    / per sec
                  </Text>
                </AppText>
              )}

              {/* Accounts */}
              <View className="flex flex-row items-center justify-between w-full h-32 mt-5 ">
                {/* left */}
                <View className="flex flex-col flex-1">
                  {/* <AppText>Sender</AppText> */}

                  <View className="flex flex-row items-center w-full my-3 justify-evenly">
                    <View className="w-10 h-10 bg-green-200 rounded-full">
                      <Image
                        source={require('../../assets/illustrations/Owl.png')}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                        resizeMode="cover"
                      />
                    </View>

                    <View className="flex flex-row items-center px-3 py-1 ml-3 rounded-full bg-blue-50">
                      <Text className="mr-2 font-medium text-center text-blue-500">
                        0x5C...dcf
                      </Text>
                      <Ionicons name="copy-outline" color="#3b82f6" />
                    </View>
                  </View>
                </View>

                {/* Middle */}
                <View className="mx-3">
                  <Lottie
                    source={stream}
                    autoPlay
                    loop
                    style={{ width: 50, height: 60 }}
                  />
                </View>

                {/* Right */}
                <View className="flex flex-col flex-1">
                  {/* <AppText>Reciever</AppText> */}

                  <View className="flex flex-row items-center w-full my-3 justify-evenly">
                    <View className="items-center justify-center w-10 h-10 bg-orange-400 rounded-full">
                      <Text className="text-lg font-extrabold text-white">
                        {/* {routeData.searchedContact?.name.slice(0, 1)} */}k
                      </Text>
                    </View>

                    <View className="flex flex-row items-center px-3 py-1 ml-3 rounded-full bg-blue-50">
                      <Text className="mr-2 font-medium text-center text-blue-500">
                        0x5C...dcf
                      </Text>
                      <Ionicons name="copy-outline" color="#3b82f6" />
                    </View>
                  </View>
                </View>
              </View>

              {item.to == profile._id ? (
                <>
                  <AppText classProps="text-base font-medium">
                    You're earning{' '}
                    <Text className="font-bold">{item.amount}</Text> USDC per
                    month
                  </AppText>
                </>
              ) : (
                <>
                  <AppText classProps="text-base font-medium">
                    You're streaming{' '}
                    <Text className="font-bold">{flowRate}</Text> USDC per sec
                  </AppText>
                </>
              )}
            </View>
          </View>

          {item.to != profile._id && (
            <View className="w-full p-4">
              <Pressable
                // onPress={getAccountStreams}
                disabled={submitLoading}
                onPress={stopAccountStreams}
                className="items-center justify-center w-full h-12 my-5 border-2 border-red-500 rounded-full"
              >
                {submitLoading ? (
                  <ActivityIndicator size={24} color="#ef4444" />
                ) : (
                  <Text className="text-base text-red-500">Stop</Text>
                )}
              </Pressable>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  )
}

export default CurrentStreamsScreen

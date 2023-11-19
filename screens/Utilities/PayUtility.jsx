import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AppText from '../../components/AppText'
import SendingMoney from '../../components/Loading/SendingMoney'
import useAPIPostRequest from '../../helpers/apiRequests'
import useRefresh from '../../hooks/useRefresh'
import TransactionDone from '../Animators/TransactionDone'
import TransactionFailed from '../Animators/TransactionFailed'

const PayUtilityScreen = () => {
  const navigation = useNavigation()
  const router = useRoute()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)

  const { request } = useAPIPostRequest()

  const { payload, phone } = router.params
  const { refresh } = useRefresh()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const fullPackage = `${payload.item.amount} ${payload.item.weight}`

      const data = {
        network: payload.provider,
        package: fullPackage,
        asset: payload.token,
        amount: Number(payload.item.price),
        phone: phone,
      }

      const res = await request(data, '/utility/pay')

      if (res.success) {
        setDone(true)
        setLoading(false)
      } else {
        setFailed(true)
        setLoading(false)
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      setErrors(error.message)
      setFailed(true)
    }
  }

  const renderIcon = () => {
    switch (payload.token) {
      case 'BITCOIN':
        return (
          <View className="flex items-center justify-center w-20 h-20 mr-4 bg-orange-500 rounded-full">
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={40}
              color="#fff"
            />
          </View>
        )

      case 'CUSD':
        return (
          <View className="flex items-center justify-center w-20 h-20 mr-4 rounded-full ">
            <Image
              source={require('../../assets/tokens/cusd.png')}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )

      case 'BUSD':
        return (
          <View className="flex items-center justify-center w-20 h-20 p-4 mr-4 bg-black rounded-full">
            <Image
              source={require('../../assets/tokens/busd.png')}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )

      default:
        return (
          <View className="flex items-center justify-center w-20 h-20 mr-4 bg-orange-500 rounded-full">
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={40}
              color="#fff"
            />
          </View>
        )
    }
  }

  if (loading) return <SendingMoney />

  if (done) return <TransactionDone refresh={refresh} />

  if (failed) return <TransactionFailed />

  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-1 p-5">
        <View className="flex flex-col flex-1">
          <View className="flex flex-row w-full ">
            <Pressable
              onPress={() => navigation.goBack()}
              className="flex flex-1"
            >
              <AntDesign name="left" size={30} color="black" />
            </Pressable>

            <View className="flex items-center justify-center">
              <AppText classProps="text-lg font-bold">Make payment</AppText>
            </View>

            <View className="flex flex-1" />
          </View>

          <View className="flex flex-row items-center justify-center w-full h-20 my-10 ">
            {renderIcon()}
            <AntDesign name="doubleright" size={25} color="black" />
            <View className="w-20 h-full ml-5 overflow-hidden rounded-full ">
              {payload.provider === 'MTN' ? (
                <Image
                  source={require('../../assets/logos/mtn.jpeg')}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Image
                  source={require('../../assets/logos/airtel.jpeg')}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </View>
          </View>

          <View className="flex flex-col flex-1 py-5 ">
            <View className="border-[0.8px] border-neutral-200 p-5 rounded-md">
              <View className="flex flex-row items-center mb-3">
                <AppText classProps="font-bold text-base">Provider: </AppText>
                <AppText classProps="text-base">{payload.provider}</AppText>
              </View>

              {/*  */}
              <View className="flex flex-row items-center mb-3">
                <AppText classProps="font-bold text-base">Phone: </AppText>
                <AppText classProps="text-base">+{phone}</AppText>
              </View>

              {/*  */}
              <View className="flex flex-row items-center mb-3">
                <AppText classProps="font-bold text-base">Bundle: </AppText>
                <AppText classProps="text-base">
                  {payload.item.amount} {payload.item.weight}
                </AppText>
              </View>

              {/*  */}
              <View className="flex flex-row items-center mb-3">
                <AppText classProps="font-bold text-base">Pay with: </AppText>
                <AppText classProps="text-base">{payload.token}</AppText>
              </View>

              {/*  */}
              <View className="flex flex-row items-center mb-3">
                <AppText classProps="font-bold text-base">Amount: </AppText>
                <AppText classProps="text-base">
                  UGX {payload.item.price}
                </AppText>
              </View>

              {/*  */}
              <View className="w-full border-t-[0.8px] border-neutral-200 flex flex-row py-3 items-center">
                <AppText classProps="text-lg font-bold">Total: </AppText>
                <AppText classProps="text-lg font-bold">
                  UGX {Number(payload.item.price)}
                </AppText>
              </View>
            </View>
          </View>

          <View>
            <Pressable
              onPress={handleSubmit}
              className="items-center w-full p-4 mb-4 rounded-md bg-primary"
            >
              <Text className="font-bold text-black">CONFIRM</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Home')}
              className="items-center w-full p-4 rounded-full "
            >
              <Text className="font-bold text-primary">CANCEL</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PayUtilityScreen

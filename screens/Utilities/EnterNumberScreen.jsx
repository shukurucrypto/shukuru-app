import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  TextInput,
  ScrollView,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React, { useState } from 'react'
import AppText from '../../components/AppText'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'

const EnterNumberScreen = () => {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(null)

  const navigation = useNavigation()
  const router = useRoute()

  const { user } = useSelector((state) => state.user)
  const { profile } = useSelector((state) => state.profile)

  const dispatch = useDispatch()

  const { payload } = router.params

  const handleSubmit = async () => {
    try {
      if (!phone || phone.length < 9) {
        setError('Enter a valid phone number')
        return
      }

      navigation.navigate('PayUtilityScreen', { payload, phone: '256' + phone })
    } catch (error) {}
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

  return (
    <ScrollView className="flex flex-1">
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
              <AppText classProps="text-lg font-bold">Buy Data</AppText>
            </View>

            <View className="flex flex-1" />
          </View>

          <View className="flex flex-row items-center justify-center w-full h-20 my-6 ">
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
            <View className="border-[0.8px] border-neutral-200 p-3 rounded-md w-full h-36">
              <View className="flex flex-col flex-1 py-2">
                <AppText classProps=" text-sm mb-2">Recipient Number: </AppText>

                <View className="flex flex-row items-center flex-1">
                  <Text className="text-3xl text-center">🇺🇬</Text>
                  <Text className="mx-3 text-black">+256</Text>

                  <TextInput
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={(e) => setPhone(e)}
                    className="flex flex-1 h-10 px-3 text-black rounded-md bg-neutral-100"
                  />
                </View>
              </View>
            </View>
          </View>

          <View>
            <Pressable
              onPress={handleSubmit}
              disabled={!phone || error || phone.length < 9}
              className={`items-center w-full p-4 my-4 rounded-full ${
                !phone || error || phone.length < 9
                  ? 'bg-neutral-200'
                  : 'bg-primary'
              }`}
            >
              <Text
                className={`font-bold ${
                  !phone || error || phone.length < 9
                    ? 'text-white'
                    : 'text-black'
                }`}
              >
                CONTINUE
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default EnterNumberScreen

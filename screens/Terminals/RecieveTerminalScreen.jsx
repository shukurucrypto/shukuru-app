import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AppText from '../../components/AppText'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { API_URL } from '../../apiURL'

const ReceiveTerminalScreen = () => {
  const [number, setNumber] = useState('0.00')
  const [hasPoint, setHasPoint] = useState(false)

  const { profile } = useSelector((state) => state.profile)

  const [isLoading, setIsLoading] = useState(false)

  const [err, setErr] = useState('')

  const { loading, user, error } = useSelector((state) => state.user)

  const navigation = useNavigation()
  const router = useRoute()

  const { token, refresh } = router.params

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      if (number === 0) {
        setErr('You need to fill in a number')
        return
      }

      if (token != 'BTC-LT') {
        navigation.navigate('PayTransactionScreen', {
          token: token,
          amount: number,
          data: profile.address,
          request: '',
          refresh: refresh,
        })
        setIsLoading(false)
        return
      }

      const data = {
        userId: user.userId,
        amount: number,
        memo: '',
      }

      const result = await axios.post(`${API_URL}/invoice/create`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (result.data.success) {
        navigation.navigate('QRCodeShownScreen', {
          data: result.data.data,
          amount: number,
          request: result.data.request,
          refresh: refresh,
        })
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setErr(error.message)
    }
  }

  const handleNumberPress = (num) => {
    let newPrice

    if (num.includes('.')) {
      setHasPoint(true)
    }

    if (number === '0.00' || number === '0.0' || !number) {
      newPrice = num
    } else {
      newPrice = number + num
    }

    setNumber(newPrice)
  }

  const handleBackspacePress = () => {
    let newPrice = number?.slice(0, -1)
    setNumber(newPrice)

    if (!number) {
      setHasPoint(false)
    }
  }

  const renderNumberButton = (num) => (
    <TouchableOpacity
      style={styles.button}
      disabled={hasPoint && num == '.' && true}
      onPress={() => handleNumberPress(num)}
    >
      <Text style={styles.buttonText}>{num}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View className="flex flex-row items-center justify-between w-full p-5">
        <Pressable
          onPress={() => navigation.navigate('Home')}
          className="flex flex-1"
        >
          <SimpleLineIcons name="arrow-left" size={22} color="black" />
        </Pressable>

        <View className="flex items-center justify-center flex-1">
          <AppText classProps="text-2xl font-bold">Receive</AppText>
        </View>

        <View className="flex items-center justify-center flex-1">
          <Text className="p-2 font-bold bg-yellow-100 rounded-full text-primary">
            {token}
          </Text>
        </View>
      </View>

      {/* Entry */}
      <View className="flex flex-col items-center justify-center flex-1">
        <AppText classProps="text-6xl font-bold">
          {number ? number : '0.00'}
        </AppText>
        <AppText>{profile.country}</AppText>
      </View>

      {/* 
      <View className="flex w-full px-5">
        <TextInput
          className="w-full p-4 h-16 px-4 border-[0.8px] rounded-lg border-neutral-300"
          placeholder="Add a memo"
        />
      </View>
       */}

      <View style={styles.row}>
        {renderNumberButton('1')}
        {renderNumberButton('2')}
        {renderNumberButton('3')}
      </View>
      <View style={styles.row}>
        {renderNumberButton('4')}
        {renderNumberButton('5')}
        {renderNumberButton('6')}
      </View>
      <View style={styles.row}>
        {renderNumberButton('7')}
        {renderNumberButton('8')}
        {renderNumberButton('9')}
      </View>
      <View style={styles.row}>
        {renderNumberButton('.')}
        {renderNumberButton('0')}
        <TouchableOpacity style={styles.button} onPress={handleBackspacePress}>
          <Feather name="delete" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <View className="w-full px-6 my-4">
        {number === '0.00' ? (
          <View className="flex items-center justify-center w-full p-4 rounded-full bg-neutral-200 ">
            <Text className="text-xl font-bold text-white">Send</Text>
          </View>
        ) : (
          <Pressable
            disabled={isLoading}
            onPress={handleSubmit}
            className="flex items-center justify-center w-full p-4 rounded-full bg-primary "
          >
            {isLoading ? (
              <ActivityIndicator size={22} color="#fff" />
            ) : (
              <AppText classProps="text-xl font-bold">Show QR Code</AppText>
            )}
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#404040',
  },
  number: {
    fontSize: 48,
    marginBottom: 20,
  },
})

export default ReceiveTerminalScreen

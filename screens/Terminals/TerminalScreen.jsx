import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { useSelector } from 'react-redux'
import { API_URL } from '../../apiURL'
import AppText from '../../components/AppText'

const TerminalScreen = () => {
  const [number, setNumber] = useState('0.00')
  const [hasPoint, setHasPoint] = useState(false)

  const { profile } = useSelector((state) => state.profile)

  const [activeToken, setActiveToken] = useState('cUSD')

  const [loading, setLoading] = useState(false)

  const navigation = useNavigation()

  const route = useRoute()

  const { asset, assetName } = route.params

  useEffect(() => {
    setNumber('0.00')
  }, [])

  const handleSubmit = async () => {
    // return
    if (number == '0.0') return
    setLoading(true)

    try {
      const amountInUSD = await convertToUSD()
      if (amountInUSD) {
        const data = {
          asset: assetName,
          amount: amountInUSD,
          fiat: number,
          selectedAsset: asset,
        }

        //   const data = `ethereum:${to}?value=${amountInUSD}?token=${activeToken}`
        if (assetName === 'cUSD') {
          setLoading(false)
          setNumber('0.00')
          data['tokenAddress'] = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'
          return navigation.navigate('EnterPhoneScreen', { data })
        } else if (assetName === 'BUSD') {
          setLoading(false)
          setNumber('0.00')
          data['tokenAddress'] = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'
          return navigation.navigate('EnterPhoneScreen', { data })
        }
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const convertToUSD = async () => {
    try {
      const convertData = {
        amount: number,
        from: profile.country,
        to: 'USD',
      }
      const res = await axios.post(`${API_URL}/convert`, convertData)

      if (res.data.success) {
        return res.data.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error.message)
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

  const rendeToken = () => {
    switch (assetName) {
      case 'BUSD':
        return (
          <View className="flex flex-row items-center justify-center ">
            <View className="flex flex-row items-center justify-center p-1 mx-1 bg-black rounded-full w-7 h-7">
              <Image
                source={require('../../assets/tokens/busd.png')}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
          </View>
        )

      default:
        return (
          <View className="flex flex-row items-center justify-center w-10 h-10 p-1 rounded-full">
            <Image
              source={require('../../assets/tokens/cusd.png')}
              style={{
                width: '100%',
                height: '100%',
                marginHorizontal: 4,
              }}
            />
          </View>
        )
    }
  }

  return (
    <SafeAreaView className="flex flex-1">
      <View style={styles.container}>
        {/* Headre */}
        <View className="flex flex-row items-center justify-between w-full px-5">
          <Pressable onPress={() => navigation.goBack()} className="flex ">
            <SimpleLineIcons name="arrow-left" size={20} color="black" />
          </Pressable>

          <View className="flex items-center justify-center flex-1">
            <AppText classProps="text-xl font-bold">
              Withdraw {assetName}
            </AppText>
            <AppText classProps="text-xs font-medium">to mobile money</AppText>
          </View>

          <View className="flex items-center justify-center ">
            {rendeToken()}
          </View>
        </View>

        {/* Entry */}
        <View className="flex flex-col items-center justify-center flex-1">
          <AppText classProps="text-6xl font-bold">
            {number ? number : '0.00'}
          </AppText>
          <AppText>{profile.country}</AppText>
        </View>

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
          <TouchableOpacity
            style={styles.button}
            onPress={handleBackspacePress}
          >
            <Feather name="delete" size={25} color="#404040" />
          </TouchableOpacity>
        </View>

        <View className="w-full px-6 my-4">
          {number === '0.00' ? (
            <View className="flex items-center justify-center w-full p-4 rounded-full bg-neutral-200 ">
              <Text className="text-xl font-bold text-white">Next</Text>
            </View>
          ) : (
            <Pressable
              disabled={loading}
              onPress={handleSubmit}
              // onPress={() => refresh()}
              className="flex items-center justify-center w-full p-4 rounded-md bg-primary "
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <AppText classProps="text-xl font-bold">Next</AppText>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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

export default TerminalScreen

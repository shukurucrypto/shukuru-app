import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

const EnterPinScreen = () => {
  const [pinCode, setPinCode] = useState('')
  const [error, setError] = useState('')

  const [storedPin, setStoredPin] = useState(null)

  const navigation = useNavigation()
  const router = useRoute()

  const { NextScreen } = router.params

  useEffect(() => {
    AsyncStorage.getItem('@pinCode')
      .then((storedPinCode) => {
        setStoredPin(storedPinCode)
      })
      .catch((error) => {
        console.log('Error retrieving PIN code from AsyncStorage:', error)
      })
  }, [])

  useEffect(() => {
    if (pinCode.length >= 4) {
      handlePinCodeSubmit()
      return
    }
  }, [pinCode])

  const handlePinCodePress = (value) => {
    if (pinCode.length < 4) {
      setPinCode(pinCode + value)
      setError('')
    }
  }

  const handleDeletePress = () => {
    setPinCode(pinCode.slice(0, -1))
    setError('')
  }

  const handlePinCodeSubmit = () => {
    // Perform your PIN code verification logic here
    if (pinCode === storedPin) {
      if (NextScreen) {
        navigation.navigate(NextScreen)
      } else {
        navigation.navigate('Home')
      }
    } else {
      // Incorrect PIN code, display an error message
      setError('Incorrect PIN code. Please try again.')
      setPinCode('')
    }
  }

  return (
    <View className="flex flex-1 ">
      <StatusBar backgroundColor="#171717" />
      <View className="flex flex-col items-center justify-center flex-1">
        <Text className="my-5 text-xl text-black">Enter PIN Code</Text>

        <View style={styles.pinCodeContainer}>
          <View style={styles.pinCodeInput}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pinCodeDigit,
                  pinCode.length > index && styles.pinCodeDigitFilled,
                ]}
              />
            ))}
          </View>
        </View>

        {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
      </View>

      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('1')}
          >
            <Text style={styles.keypadButtonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('2')}
          >
            <Text style={styles.keypadButtonText}>2</Text>
            <Text className="text-xs text-black font-extralight">ABC</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('3')}
          >
            <Text style={styles.keypadButtonText}>3</Text>
            <Text className="text-xs text-black font-extralight">DEF</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.keypadRow}>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('4')}
          >
            <Text style={styles.keypadButtonText}>4</Text>
            <Text className="text-xs text-black font-extralight">GHI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('5')}
          >
            <Text style={styles.keypadButtonText}>5</Text>
            <Text className="text-xs text-black font-extralight">JKL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('6')}
          >
            <Text style={styles.keypadButtonText}>6</Text>
            <Text className="text-xs text-black font-extralight">MNO</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keypadRow}>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('7')}
          >
            <Text style={styles.keypadButtonText}>7</Text>
            <Text className="text-xs text-black font-extralight">PQRS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('8')}
          >
            <Text style={styles.keypadButtonText}>8</Text>
            <Text className="text-xs text-black font-extralight">TUV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('9')}
          >
            <Text style={styles.keypadButtonText}>9</Text>
            <Text className="text-xs text-black font-extralight">WXYZ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keypadRow}>
          <View style={styles.keypadButton} />

          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handlePinCodePress('0')}
          >
            <Text style={styles.keypadButtonText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keypadButton}
            disabled={!pinCode}
            onPress={handleDeletePress}
          >
            {/* <Text
              style={[
                styles.keypadButtonText,
                !pinCode && styles.keypadButtonDisabledText,
              ]}
            >
              Delete
            </Text> */}
            <Feather
              name="delete"
              size={24}
              color={pinCode ? 'black' : '#ddd'}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.keypadButton}
            disabled={!pinCode}
            onPress={handlePinCodeSubmit}
          >
            <Text
              style={[
                styles.keypadButtonText,
                !pinCode && styles.keypadButtonDisabledText,
              ]}
            >
              Submit
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  pinCodeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pinCodeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    height: 40,
    marginBottom: 10,
  },
  pinCodeDigit: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#f97316',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  pinCodeDigitFilled: {
    backgroundColor: '#f97316',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
  keypadContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  keypadRow: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    // justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  keypadButtonDisabledText: {
    color: '#999999',
  },
})

export default EnterPinScreen

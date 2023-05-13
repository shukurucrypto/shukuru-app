import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import MainStackNavigator from './navigation/MainNavigator'
import AuthNavigator from './navigation/AuthNavigator'
import { useDispatch, useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { io } from 'socket.io-client'
import { SOCKET_SERVER } from './apiURL'
import useLocalNotification from './Notifications/Local'
import { fetchBalance } from './features/balances/balancesSlice'
import { fetchTransactions } from './features/transactions/transactionsSlice'

const socket = io(SOCKET_SERVER)

// import SOCKET_SERVER from './apiURL'

function App() {
  const [token, setToken] = useState(null)
  const [payhash, setPayHash] = useState('myTX')
  const { loading, user, error } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const onDisplayNotification = useLocalNotification()

  useEffect(() => {
    // client-side
    if (token) {
      socket.on('connect', () => {})

      socket.emit('joinedActive', {
        joinedUser: { userId: user?.userId },
      })
      // return () => {
      //   socket.disconnect()
      // }
    }
  }, [token, user])

  useEffect(() => {
    getToken()
  }, [token, user])

  useEffect(() => {
    if (token) {
      // Listen for the 'privateMessage' event
      socket.on('txNotification', ({ senderId, message }) => {
        onDisplayNotification(message)
        fetchBalance(dispatch, user?.userId)
        fetchTransactions(dispatch, user?.userId)
      })

      return () => {
        // Clean up the event listener when the component unmounts
        socket.off('txNotification')
      }
    }
  }, [token, user])

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token')
      if (value !== null) {
        // value previously stored
        setToken(value)
      }
    } catch (e) {
      // error reading value
    }
  }

  // console.log('DEBUG HERE: ', loading, user, token)

  return (
    <SafeAreaView className="flex flex-1 bg-neutral-50">
      {!token ? <AuthNavigator /> : <MainStackNavigator />}
    </SafeAreaView>
  )
}

export default App

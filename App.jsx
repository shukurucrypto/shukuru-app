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
import SplashScreen from './components/SplashScreen'
import {
  failedFetchToken,
  fetchedToken,
  fetchingToken,
} from './features/token/tokenSlice'

const socket = io(SOCKET_SERVER)

// import SOCKET_SERVER from './apiURL'

function App() {
  const [payhash, setPayHash] = useState('myTX')
  const { loading, user, error } = useSelector((state) => state.user)

  const {
    token,
    loading: tokenLoading,
    error: tokenErr,
  } = useSelector((state) => state.tokenState)

  const [appReady, setAppReady] = useState(false)

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
  }, [user])

  useEffect(() => {
    async function prepare() {
      try {
        // our api calls will be here.
        setTimeout(() => {
          getToken()
          setAppReady(true)
        }, 3000)

        // new Promise((resolve) => setTimeout(resolve, 5000)) // wait for 5 secs
      } catch (e) {
        console.warn(e)
        setAppReady(true)
      } finally {
        SplashScreen.hide()
        setAppReady(true)
      }
    }
    prepare()
  }, [user])

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
  }, [user])

  const getToken = async () => {
    dispatch(fetchingToken())
    try {
      const value = await AsyncStorage.getItem('@token')
      if (value !== null) {
        // value previously stored
        // setToken(value)
        dispatch(fetchedToken(value))
        // setAppReady(true)
      } else {
        // setAppReady(false)

        dispatch(failedFetchToken('Not logged In'))
      }
    } catch (e) {
      // error reading value
      // setAppReady(true)
      dispatch(failedFetchToken('Failed to get token'))
    }
  }

  // console.log('DEBUG HERE: ', token)
  if (!appReady || tokenLoading) return <SplashScreen />

  return (
    <SafeAreaView className="flex flex-1 bg-neutral-50">
      {!token ? <AuthNavigator /> : <MainStackNavigator />}
    </SafeAreaView>
  )
}

export default App

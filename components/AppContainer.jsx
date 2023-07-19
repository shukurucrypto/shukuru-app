import { SafeAreaView, StatusBar, AppState } from 'react-native'
import React, { useEffect } from 'react'
import AppHeader from './AppHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import useRenderLock from '../hooks/useRenderLock'
import { useSelector } from 'react-redux'

const AppContainer = ({ children, refresh }) => {
  const navigation = useNavigation()

  const { appStateVisible } = useRenderLock()

  useEffect(() => {
    if (appStateVisible === 'active') {
      AsyncStorage.getItem('@pinCode')
        .then((storedPinCode) => {
          if (storedPinCode) {
            // setPinCode(storedPinCode);
            navigation.navigate('LockScreen')
          } else {
            navigation.navigate('CreatePinScreen')
          }
        })
        .catch((error) => {
          console.log('Error retrieving PIN code from AsyncStorage:', error)
        })
    }
  }, [appStateVisible])

  return (
    <SafeAreaView className="flex flex-col flex-1 ">
      <StatusBar backgroundColor="#171717" />
      <AppHeader refresh={refresh} />
      {children}
    </SafeAreaView>
  )
}

export default AppContainer

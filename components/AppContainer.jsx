import { SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import AppHeader from './AppHeader'

const AppContainer = ({ children, refresh }) => {
  return (
    <SafeAreaView className="flex flex-col flex-1 bg-neutral-50">
      <AppHeader refresh={refresh} />
      {children}
    </SafeAreaView>
  )
}

export default AppContainer

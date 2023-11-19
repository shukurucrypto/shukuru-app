import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { usePinCode } from '../hooks/usePinCode'
import AppHeader from './AppHeader'
import CreatePinSheet from './Sheets/Lock/CreatePinSheet'
import UnlockSheet from './Sheets/Lock/UnlockSheet'

const AppContainer = ({ children, refresh }) => {
  const { actionSheetRef, createPinActionSheetRef } = usePinCode()

  return (
    <SafeAreaView className="flex flex-col flex-1 ">
      <StatusBar backgroundColor="#171717" />
      <AppHeader refresh={refresh} />
      {children}

      <UnlockSheet actionSheetRef={actionSheetRef} />
      <CreatePinSheet createPinActionSheetRef={createPinActionSheetRef} />
    </SafeAreaView>
  )
}

export default AppContainer

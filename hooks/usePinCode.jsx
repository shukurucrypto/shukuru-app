import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef } from 'react'
import useRenderLock from './useRenderLock'

export const usePinCode = () => {
  const { appStateVisible } = useRenderLock()

  const actionSheetRef = useRef(null)
  const createPinActionSheetRef = useRef(null)

  useEffect(() => {
    if (appStateVisible === 'active') {
      AsyncStorage.getItem('@pinCode')
        .then((storedPinCode) => {
          if (storedPinCode) {
            // navigation.navigate('LockScreen')
            actionSheetRef?.current.show()
          } else {
            createPinActionSheetRef?.current.show()
          }
        })
        .catch((error) => {
          console.log('Error retrieving PIN code from AsyncStorage:', error)
        })
    }
  }, [appStateVisible])

  return {
    actionSheetRef,
    createPinActionSheetRef,
  }
}

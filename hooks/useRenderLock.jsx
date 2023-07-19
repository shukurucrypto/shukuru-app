import React, { useRef, useState, useEffect } from 'react'
import { AppState } from 'react-native'

const useRenderLock = () => {
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  const [showPin, setShowPin] = useState(false)

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          setShowPin(true)
        }

        appState.current = nextAppState
        setAppStateVisible(appState.current)
      }
    )

    return () => {
      subscription.remove()
    }
  }, [])

  return { appStateVisible, showPin }
}

export default useRenderLock

import './ignoreWarnings'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import App from './App'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import OneSignal from 'react-native-onesignal'
// Create a client

OneSignal.setAppId('bdb34439-82ae-4091-bcb3-664874f10810')

const Entry = () => {
  const queryClient = new QueryClient()

  useEffect(() => {
    // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
    OneSignal.promptForPushNotificationsWithUserResponse()

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notificationReceivedEvent) => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent
        )
        let notification = notificationReceivedEvent.getNotification()
        console.log('notification: ', notification)
        const data = notification.additionalData
        console.log('additionalData: ', data)
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification)
      }
    )

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler((notification) => {
      console.log('OneSignal: notification opened:', notification)
    })
  }, [])
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <App />
          </NavigationContainer>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}

export default Entry

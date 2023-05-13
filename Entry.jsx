import './ignoreWarnings'
import React from 'react'
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
// Create a client

const Entry = () => {
  const queryClient = new QueryClient()
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

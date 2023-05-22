import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import userReducer from './features/user/userSlice'
import profileReducer from './features/profile/profileSlice'
import balancesReducer from './features/balances/balancesSlice'
import transactionsReducer from './features/transactions/transactionsSlice'
import tokenReducer from './features/token/tokenSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  balances: balancesReducer,
  transactions: transactionsReducer,
  tokenState: tokenReducer,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// export default configureStore({
//   reducer: {
//     user: userReducer,
//   },
// })

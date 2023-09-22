import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ReceiveTerminalScreen from '../screens/Terminals/RecieveTerminalScreen'
import SendTerminalScreen from '../screens/Terminals/SendTerminalScreen'
import FindUser from '../screens/FindUser'
import QRCodeShownScreen from '../screens/QRCodeShownScreen'
import ProfileScreen from '../screens/ProfileScreen'
import TransactionDetailScreen from '../screens/TransactionDetail'
import ScanQRScreen from '../screens/ScanQRScreen'
import ReadInvoiceScreen from '../screens/ReadInvoiceScreen'
import PayTransactionScreen from '../screens/PayTransactionScreen'
import SettingsScreen from '../screens/SettingsScreen'
import SelectCountyScreen from '../screens/SelectCounty'
import ConfirmTransactionScreen from '../screens/ConfirmTransactionScreen'
import EVMConfirmTXScreen from '../screens/EVMConfirmTxScreen'
import ExternalSendTerminalScreen from '../screens/Terminals/ExternalSendTerminalScreen'
import ClaimRewardsScreen from '../screens/ClaimRewardsScreen'
import UtilitiesScreen from '../screens/Utilities/UtilitiesScreen'
import PayUtilityScreen from '../screens/Utilities/PayUtility'
import TransactionsScreen from '../screens/TransactionsScreen'
import TopUpGasScreen from '../screens/TopUpGasScreen'
import GasQRShownScreen from '../screens/GasQRShownScreen'
import LockScreen from '../screens/Lock/LockScreen'
import CreatePinScreen from '../screens/Lock/CreatePinScreen'
import SelectWithdrawAssetScreen from '../screens/Withdraw/SelectWithdrawAssetScreen'
import TerminalScreen from '../screens/Terminals/TerminalScreen'
import EnterPhoneScreen from '../screens/Withdraw/EnterPhoneScreen'
import WithdrawScreen from '../screens/Withdraw/WithdrawScreen'
import ReviewScreen from '../screens/Withdraw/ReviewScreen'
import SuccessScreen from '../screens/Withdraw/SuccessScreen'
import EnterNumberScreen from '../screens/Utilities/EnterNumberScreen'

const Stack = createNativeStackNavigator()

function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ReceiveTerminal" component={ReceiveTerminalScreen} />
      <Stack.Screen name="SendTerminal" component={SendTerminalScreen} />
      <Stack.Screen name="FindUser" component={FindUser} />
      <Stack.Screen name="QRCodeShownScreen" component={QRCodeShownScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ScanQRScreen" component={ScanQRScreen} />
      <Stack.Screen name="ReadInvoiceScreen" component={ReadInvoiceScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="SelectCountryScreen" component={SelectCountyScreen} />
      <Stack.Screen name="EVMConfirmTXScreen" component={EVMConfirmTXScreen} />
      <Stack.Screen name="ClaimRewardsScreen" component={ClaimRewardsScreen} />
      <Stack.Screen name="UtilitiesScreen" component={UtilitiesScreen} />
      <Stack.Screen name="PayUtilityScreen" component={PayUtilityScreen} />
      <Stack.Screen name="TransactionsScreen" component={TransactionsScreen} />
      <Stack.Screen name="TopUpGasScreen" component={TopUpGasScreen} />
      <Stack.Screen name="EnterNumberScreen" component={EnterNumberScreen} />
      <Stack.Screen name="GasQRShownScreen" component={GasQRShownScreen} />
      <Stack.Screen name="LockScreen" component={LockScreen} />
      <Stack.Screen name="CreatePinScreen" component={CreatePinScreen} />
      <Stack.Screen name="WithdrawScreen" component={WithdrawScreen} />
      <Stack.Screen name="TerminalScreen" component={TerminalScreen} />
      <Stack.Screen name="EnterPhoneScreen" component={EnterPhoneScreen} />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen
        name="SelectWithdrawAssetScreen"
        component={SelectWithdrawAssetScreen}
      />
      <Stack.Screen
        name="ExternalSendTerminal"
        component={ExternalSendTerminalScreen}
      />
      <Stack.Screen
        name="ConfirmTransactionScreen"
        component={ConfirmTransactionScreen}
      />
      <Stack.Screen
        name="PayTransactionScreen"
        component={PayTransactionScreen}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
    </Stack.Navigator>
  )
}

export default MainStackNavigator

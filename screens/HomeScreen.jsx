import { View, Text, Pressable, FlatList, ScrollView } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React, { useEffect, useRef, useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'

import AppContainer from '../components/AppContainer'
import Banner from '../components/Banner'
import TransactionCards from '../components/Cards/TransactionCards'
import RecieveSheet from '../components/Sheets/RecieveSheet'
import SendActionSheet from '../components/Sheets/SendActionSheet'
import TopupSheet from '../components/Sheets/TopupSheet'
import AppText from '../components/AppText'
import { useDispatch, useSelector } from 'react-redux'
import { SOCKET_SERVER } from '../apiURL'
import { fetchBalance } from '../features/balances/balancesSlice'
import { io } from 'socket.io-client'
import useLocalNotification from '../Notifications/Local'
import { fetchTransactions } from '../features/transactions/transactionsSlice'
import { fetchAds } from '../features/advert/advertSlice'
import { fetchCheckreward } from '../features/rewards/rewardsSlice'
import ClaimReward from '../components/Reward/ClaimReward'
import { useNavigation } from '@react-navigation/native'
import { fetchUserGas } from '../features/gas/gasSlice'

const socket = io(SOCKET_SERVER)

const HomeScreen = () => {
  const { loading, user, error } = useSelector((state) => state.user)

  const profileState = useSelector((state) => state.profile)

  const advertState = useSelector((state) => state.advertState)

  const tokenState = useSelector((state) => state.tokenState)

  const navigation = useNavigation()

  const balancesState = useSelector((state) => state.balances)

  const rewardState = useSelector((state) => state.rewardState)

  const transactionsState = useSelector((state) => state.transactions)

  const [showBalances, setShowBalances] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    fetchBalance(dispatch, user.userId)
    fetchTransactions(dispatch, user.userId)

    fetchAds(dispatch)

    fetchCheckreward(dispatch, user.token)

    fetchUserGas(dispatch, user.userId, tokenState.token)

    // fetchBTCTransactions()
  }, [])

  const receiveActionSheet = useRef(null)
  const sendActionSheet = useRef(null)
  const topupActionSheet = useRef(null)
  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString()
  }
  const renderItem = ({ item, index }) => {
    return (
      <View className="px-5">
        <TransactionCards item={item} />
      </View>
    )
  }

  const onRefresh = () => {
    fetchCheckreward(dispatch, user.token)
    fetchBalance(dispatch, user.userId)
    fetchTransactions(dispatch, user.userId)
    // fetchBTCTransactions()
    fetchUserGas(dispatch, user.userId, tokenState.token)
  }

  const refreshEveryThing = () => {
    fetchCheckreward(dispatch, user.token)
    fetchBalance(dispatch, user.userId)
    fetchTransactions(dispatch, user.userId)
    // fetchBTCTransactions()
    fetchUserGas(dispatch, user.userId, tokenState.token)
  }

  return (
    <AppContainer refresh={refreshEveryThing}>
      <View className="flex flex-col flex-1">
        <FlatList
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex flex-col items-center justify-center flex-1 p-12">
              <Text className="text-base font-light text-neutral-400">
                No transactions yet
              </Text>
            </View>
          }
          ListHeaderComponent={
            <>
              <View className="flex flex-col flex-1 ">
                {/* Top ad banner */}

                {advertState.banners && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex flex-row h-48 my-3 bg-neutral-50"
                  >
                    {!rewardState.loading && !rewardState.error && (
                      <ClaimReward item={rewardState.reward} />
                    )}
                    {advertState?.banners?.map((item) => (
                      <Banner key={item.id} item={item} />
                    ))}
                  </ScrollView>
                )}

                {/* Balance */}
                <View className="flex flex-col w-full px-5 py-3">
                  {/* top */}
                  <View className="flex flex-row items-center justify-between w-full">
                    <Text className="text-base font-medium text-neutral-700">
                      Total Balance
                    </Text>

                    {/* View assets */}
                    <View className="flex flex-row items-center">
                      <Text className="font-bold text-primary">
                        View Assets
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={18}
                        color="#FBC609"
                      />
                    </View>
                  </View>

                  <View className="flex flex-row h-24 ">
                    <View className="flex flex-col flex-1">
                      {balancesState.loading ? (
                        <>
                          <AppText classProps="my-1 text-3xl font-bold">
                            ****
                          </AppText>
                          <View className="flex flex-row items-center">
                            <Text className="font-light">*** </Text>
                          </View>
                        </>
                      ) : (
                        !balancesState.error &&
                        balancesState.balances && (
                          <>
                            <AppText
                              numberOfLines={1}
                              classProps="my-1 text-3xl font-bold"
                            >
                              {showBalances
                                ? `${profileState?.profile?.country} ` +
                                  balancesState?.balances?.total
                                    ?.toFixed(2)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : '****'}
                            </AppText>

                            <View className="flex flex-row items-center">
                              {!showBalances ? (
                                <Text className="text-xs font-light text-black">
                                  ***
                                </Text>
                              ) : (
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  className="py-3"
                                >
                                  <Text className="font-light text-black">
                                    SATS{' '}
                                    {balancesState.balances?.lightning?.toFixed(
                                      2
                                    )}
                                  </Text>
                                  <Text className="mx-8 font-light text-black">
                                    BUSD{' '}
                                    {balancesState?.balances?.busd?.toFixed(2)}
                                  </Text>
                                  <Text className="mr-8 font-light text-black">
                                    cUSD{' '}
                                    {balancesState.balances?.cusd?.toFixed(2)}
                                  </Text>
                                  <Text className="font-light text-black">
                                    USDT{' '}
                                    {balancesState.balances?.usdt?.toFixed(2)}
                                  </Text>
                                </ScrollView>
                              )}
                            </View>
                          </>
                        )
                      )}
                    </View>

                    {!balancesState.loading && (
                      <Pressable
                        onPress={() => setShowBalances(!showBalances)}
                        className="p-5 "
                      >
                        {showBalances ? (
                          <Entypo
                            name="eye-with-line"
                            size={20}
                            color="black"
                          />
                        ) : (
                          <Entypo name="eye" size={20} color="black" />
                        )}
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Recent txs */}
                <View className="flex flex-col flex-1 px-5 pt-5 ">
                  <View className="flex flex-row items-center justify-between w-full">
                    <Text className="mb-4 font-medium text-neutral-600">
                      Recent Activity
                    </Text>

                    {transactionsState?.transactions?.length > 4 && (
                      <Pressable
                        onPress={() =>
                          navigation.navigate('TransactionsScreen')
                        }
                        className="flex flex-row items-center"
                      >
                        <Text className="font-bold text-primary">View all</Text>
                        <MaterialIcons
                          name="keyboard-arrow-right"
                          size={18}
                          color="#FBC609"
                        />
                      </Pressable>
                    )}
                  </View>

                  {/* Transaction cards */}
                  {/* <TransactionCards /> */}
                  {/* <TransactionCards recieved type="BTC" /> */}
                  {/* <TransactionCards recieved /> */}
                </View>

                {/* Buttons */}
              </View>
            </>
          }
          data={transactionsState?.transactions?.slice(0, 3)}
          // data={transactionsState?.transactions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onRefresh={onRefresh}
          refreshing={balancesState.loading}
          className="flex flex-1"
        />
        <View className="flex flex-row w-full py-3 bg-transparent">
          {balancesState?.balances?.total?.toFixed(2) <= 0 ? (
            <View className="flex flex-col items-center justify-center flex-1">
              <Pressable
                onPress={() => sendActionSheet.current?.show()}
                disabled
                className="flex items-center justify-center p-4 rounded-full bg-neutral-200 "
              >
                <AntDesign name="arrowup" size={22} color="white" />
              </Pressable>
              <Text className="mt-1 text-sm text-neutral-400">Pay</Text>
            </View>
          ) : (
            <View className="flex flex-col items-center justify-center flex-1">
              <Pressable
                onPress={() => sendActionSheet.current?.show()}
                className="flex items-center justify-center p-4 rounded-full bg-primary "
              >
                <AntDesign name="arrowup" size={22} color="black" />
              </Pressable>
              <AppText classProps="mt-1 text-sm">Pay</AppText>
            </View>
          )}

          <View className="flex flex-col items-center justify-center flex-1">
            <Pressable
              onPress={() => receiveActionSheet.current?.show()}
              className="flex items-center justify-center p-4 rounded-full bg-primary "
            >
              <AntDesign name="arrowdown" size={22} color="black" />
            </Pressable>
            <AppText classProps="mt-1 text-sm">Recieve</AppText>
          </View>

          <View className="flex flex-col items-center justify-center flex-1">
            <Pressable
              onPress={() => topupActionSheet.current?.show()}
              className="flex items-center justify-center p-4 rounded-full bg-primary "
            >
              <AntDesign name="creditcard" size={22} color="black" />
            </Pressable>
            <AppText classProps="mt-1 text-sm">Topup</AppText>
          </View>
        </View>

        <RecieveSheet
          receiveActionSheet={receiveActionSheet}
          refresh={refreshEveryThing}
        />
        <SendActionSheet
          sendActionSheet={sendActionSheet}
          refresh={refreshEveryThing}
          balances={balancesState}
        />
        <TopupSheet
          topupActionSheet={topupActionSheet}
          refresh={refreshEveryThing}
        />
      </View>
    </AppContainer>
  )
}

export default HomeScreen

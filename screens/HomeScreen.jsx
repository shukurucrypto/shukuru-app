import React, { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { SOCKET_SERVER } from '../apiURL'
import AppContainer from '../components/AppContainer'
import AppText from '../components/AppText'
import Banner from '../components/Banner'
import TransactionCards from '../components/Cards/TransactionCards'
import ClaimReward from '../components/Reward/ClaimReward'
import RecieveSheet from '../components/Sheets/RecieveSheet'
import SendActionSheet from '../components/Sheets/SendActionSheet'
import TopupSheet from '../components/Sheets/TopupSheet'
import { fetchAds } from '../features/advert/advertSlice'
import { fetchBalance } from '../features/balances/balancesSlice'
import { fetchUserGas } from '../features/gas/gasSlice'
import { fetchCheckreward } from '../features/rewards/rewardsSlice'
import { fetchTransactions } from '../features/transactions/transactionsSlice'
import useRefresh from '../hooks/useRefresh'
import useGetRequest from '../helpers/useGetRequest'

const socket = io(SOCKET_SERVER)

const HomeScreen = () => {
  const { loading, user, error } = useSelector((state) => state.user)

  const profileState = useSelector((state) => state.profile)

  const advertState = useSelector((state) => state.advertState)

  const tokenState = useSelector((state) => state.tokenState)

  const { request } = useGetRequest()

  const navigation = useNavigation()

  const balancesState = useSelector((state) => state.balances)

  const rewardState = useSelector((state) => state.rewardState)

  const transactionsState = useSelector((state) => state.transactions)

  const { refresh } = useRefresh()

  const [showBalances, setShowBalances] = useState(false)

  const [hideBanner, setHidebanner] = useState(false)

  const dispatch = useDispatch()

  const width = useWindowDimensions().width

  useEffect(() => {
    fetchBalance(dispatch, user.userId, tokenState.token, tokenState.bolt)
    fetchTransactions(dispatch, user.userId)

    fetchAds(dispatch)

    fetchCheckreward(dispatch, user.token)

    fetchUserGas(dispatch, user.userId, tokenState.token)

    // request(`/invoice/legacies`)

    // fetchBTCTransactions()
  }, [])

  const scrollViewRef = useRef()

  const onScroll = (event) => {
    // Calculate the width of each item in your banner (you may need to adjust this based on your layout)
    const itemWidth = width

    // Calculate the current index based on the scroll position
    const currentIndex = Math.floor(
      event.nativeEvent.contentOffset.x / itemWidth
    )

    // Calculate the new scroll position to snap to the full width
    const newScrollX = currentIndex * itemWidth

    // Scroll to the new position with animation
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: newScrollX, animated: true })
    }
  }

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

  return (
    <AppContainer refresh={refresh}>
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

                <>
                  {!hideBanner && advertState.banners && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="flex flex-row h-48 my-3 bg-neutral-50"
                      snapToAlignment="center"
                      snapToInterval={width}
                      pagingEnabled={true}
                      onMomentumScrollEnd={onScroll}
                      ref={scrollViewRef}
                    >
                      {!rewardState.loading && !rewardState.error && (
                        <ClaimReward
                          item={rewardState.reward}
                          dismiss={() => setHidebanner(true)}
                        />
                      )}
                      {advertState?.banners?.map((item) => (
                        <Banner
                          key={item.id}
                          item={item}
                          dismiss={() => setHidebanner(true)}
                        />
                      ))}
                    </ScrollView>
                  )}
                </>

                {/* Balance */}
                <View className="flex flex-col w-full px-5 pt-6">
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
                          <View
                          // onPress={() => setShowBalances(!showBalances)}
                          >
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
                                    cUSD{' '}
                                    {balancesState.balances?.cusd?.toFixed(2)}
                                  </Text>
                                  <Text className="font-light text-black ">
                                    BUSD{' '}
                                    {balancesState?.balances?.busd?.toFixed(2)}
                                  </Text>
                                  {/* <Text className="font-light text-black">
                                    USDT{' '}
                                    {balancesState.balances?.usdt?.toFixed(2)}
                                  </Text> */}
                                </ScrollView>
                              )}
                            </View>
                          </View>
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
                </View>

                {/* Buttons */}
              </View>
            </>
          }
          data={transactionsState?.transactions?.slice(0, 10)}
          // data={transactionsState?.transactions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onRefresh={refresh}
          refreshing={balancesState.loading}
          className="flex flex-1"
          ListFooterComponent={
            <View>
              <Pressable
                onPress={() => navigation.navigate('TransactionsScreen')}
                className="flex items-center justify-center w-full py-4"
              >
                <Text className="font-bold text-primary">View more</Text>
              </Pressable>
            </View>
          }
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
            <AppText classProps="mt-1 text-sm">Bills</AppText>
          </View>
        </View>

        <RecieveSheet
          receiveActionSheet={receiveActionSheet}
          refresh={refresh}
        />
        <SendActionSheet
          sendActionSheet={sendActionSheet}
          refresh={refresh}
          balances={balancesState}
        />
        <TopupSheet topupActionSheet={topupActionSheet} refresh={refresh} />
      </View>
    </AppContainer>
  )
}

export default HomeScreen

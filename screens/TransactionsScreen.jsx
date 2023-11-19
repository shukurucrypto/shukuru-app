import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

import TransactionCards from '../components/Cards/TransactionCards'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../features/transactions/transactionsSlice'
import { fetchCheckreward } from '../features/rewards/rewardsSlice'
import AppText from '../components/AppText'
import { useNavigation } from '@react-navigation/native'
import ClearTransactions from '../components/Modals/ClearTransactions'
import useRefresh from '../hooks/useRefresh'

const TransactionsScreen = () => {
  const { loading, user, error } = useSelector((state) => state.user)

  const balancesState = useSelector((state) => state.balances)

  const navigation = useNavigation()

  const { refresh } = useRefresh()

  const transactionsState = useSelector((state) => state.transactions)

  const dispatch = useDispatch()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    fetchTransactions(dispatch, user.userId)

    fetchCheckreward(dispatch, user.token)
  }, [])

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

  const goBack = () => navigation.goBack()

  return (
    <View className="flex flex-col flex-1">
      <ClearTransactions
        isModalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        refresh={refresh}
        goBack={goBack}
      />
      <View className="flex flex-row items-center justify-between w-full h-20 px-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
        >
          <AntDesign name="left" color="black" size={25} />
          <AppText classProps="text-lg font-medium ml-2">Back</AppText>
        </Pressable>

        {/* <Pressable
          onPress={() => setIsModalVisible(true)}
          className="flex-row items-center"
        >
          <Text className="text-red-600">Clear All</Text>
        </Pressable> */}
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex flex-col items-center justify-center flex-1 p-12">
            <Text className="text-base font-light text-neutral-400">
              No transactions yet
            </Text>
          </View>
        }
        data={transactionsState?.transactions}
        // data={transactionsState?.transactions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={refresh}
        refreshing={balancesState.loading}
        className="flex flex-1"
      />
    </View>
  )
}

export default TransactionsScreen

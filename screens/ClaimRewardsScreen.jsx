import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import React, { useState } from 'react'
import AppText from '../components/AppText'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import ConfettiCannon from 'react-native-confetti-cannon'

import { claimReward, fetchCheckreward } from '../features/rewards/rewardsSlice'
import { fetchBalance } from '../features/balances/balancesSlice'
import { fetchTransactions } from '../features/transactions/transactionsSlice'

const ClaimRewardsScreen = () => {
  const navigation = useNavigation()
  const router = useRoute()

  const { user } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [done, setDone] = useState(false)

  const dispatch = useDispatch()

  const { item } = router.params

  const handleClaimReward = async () => {
    setLoading(true)
    try {
      const result = await claimReward(user.token)

      if (result.success) {
        // Show confettie
        setDone(true)
      }
      setLoading(true)
    } catch (error) {
      setLoading(true)
      console.log(error.message)
      setError(error.message)
    }
  }

  const refreshData = () => {
    fetchBalance(dispatch, user?.userId)
    fetchTransactions(dispatch, user?.userId)
    fetchCheckreward(dispatch, user.token)
  }
  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-1">
        <View className="flex justify-center w-full p-3">
          <Pressable onPress={() => navigation.goBack()} className="p-2">
            <AntDesign name="close" size={30} color="black" />
          </Pressable>
        </View>

        {/* Main */}
        <View className="flex flex-1">
          <View className="flex flex-1 ">
            <View className="flex items-center flex-1 px-4 ">
              <Image
                source={require('../assets/illustrations/gift.png')}
                style={{
                  width: '60%',
                  height: '60%',
                }}
                resizeMode="contain"
              />
              <View>
                {done ? (
                  <>
                    <AppText classProps="text-xl font-bold">
                      🎉 Successfully supercharged your account 🥳
                    </AppText>
                  </>
                ) : (
                  <>
                    <AppText classProps="text-xl font-bold">
                      Claim your rewards today and super charge your account
                    </AppText>

                    <AppText classProps="text-base p-3">
                      You're getting a nice reward from us today. We distribute
                      them every week. 💛 Claim them now.
                    </AppText>
                  </>
                )}
              </View>
            </View>

            <AppText classProps="text-base text-center p-3">
              Rewards are valid to be claimed in less than 24hrs
            </AppText>
          </View>

          {done && <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} />}

          <View className="flex border-t-[0.8px] border-neutral-200 items-center p-2">
            {!item.response.claimed ? (
              <>
                {done ? (
                  <Pressable
                    onPress={() => {
                      refreshData()
                      navigation.goBack()
                      setDone(false)
                    }}
                    // onPress={handleClaimReward}
                    className="items-center justify-center w-full p-4 my-3 rounded-full bg-primary"
                  >
                    <AppText classProps="text-lg font-bold">Success</AppText>
                  </Pressable>
                ) : (
                  <Pressable
                    disabled={loading}
                    onPress={handleClaimReward}
                    // onPress={() => setDone(true)}
                    className="items-center justify-center w-full p-4 my-3 rounded-full bg-primary"
                  >
                    {loading ? (
                      <ActivityIndicator size={24} color="black" />
                    ) : (
                      <AppText classProps="text-lg font-bold">
                        Claim now
                      </AppText>
                    )}
                  </Pressable>
                )}
              </>
            ) : (
              <View className="items-center justify-center w-full p-4 my-3 rounded-full bg-neutral-100">
                <AppText classProps="text-lg font-bold">Claimed</AppText>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ClaimRewardsScreen

import { View, Text, SafeAreaView, Pressable } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import React from 'react'
import AppText from '../components/AppText'
import { useNavigation } from '@react-navigation/native'

const TransactionDetailScreen = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView className="flex flex-col flex-1">
      <View className="flex flex-col flex-1 p-5">
        {/* Header */}

        <View className="flex flex-row justify-between w-full">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex flex-1"
          >
            <SimpleLineIcons name="arrow-left" size={22} color="black" />
          </Pressable>

          <View className="flex flex-col flex-1">
            <AppText classProps="text-base font-bold">Lightning Sent</AppText>
          </View>

          <View className="flex flex-1" />
        </View>

        {/* Infow */}

        <View className="flex flex-row items-center justify-between mt-12">
          <View className="flex flex-col w-full">
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-col justify-between flex-1">
                <Text className="text-sm font-bold text-neutral-500">
                  Sent to
                </Text>
                <AppText classProps="text-lg font-medium">
                  +256700719619
                </AppText>
              </View>

              {/* icons */}
              <View className="w-12 h-12 bg-green-500 rounded-full" />
            </View>

            {/* Tx hash */}
            <View className="flex flex-col w-full p-4 my-4 rounded-md h-28 bg-neutral-300">
              <AppText classProps="font-bold">Transaction hash</AppText>

              <Text className="my-2 font-light text-neutral-800">
                0xbb0f305a76fd6dabaa14fbfffc91cbe1f61dd02c92bb2bbd3003cd4edef9fb64
              </Text>

              <Pressable onPress={() => {}}>
                <Text className="font-light underline text-neutral-800">
                  Tap to Copy
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View className="flex flex-col justify-between w-full">
          <View className="flex flex-row items-center justify-between w-full my-2">
            <AppText classProps="text-base font-light">Amount</AppText>
            <AppText classProps="text-base font-light">$248.85</AppText>
          </View>

          <View className="flex flex-row items-center justify-between w-full">
            <AppText classProps="text-base font-light">Fees</AppText>
            <AppText classProps="text-base font-light">$0.0013</AppText>
          </View>

          <View className="flex flex-row items-center justify-between w-full my-3">
            <AppText classProps="text-base font-bold">Total</AppText>
            <AppText classProps="text-base font-bold">$248.85</AppText>
          </View>

          <View className="flex flex-col"></View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default TransactionDetailScreen

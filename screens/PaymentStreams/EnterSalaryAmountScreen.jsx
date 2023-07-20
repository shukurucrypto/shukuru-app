import { View, Text, SafeAreaView, Pressable, TextInput } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown'

const EnterSalaryAmountScreen = () => {
  const navigation = useNavigation()

  const duration = ['Week', 'Month', 'Year']

  const router = useRoute()

  const routeData = router.params

  console.log('====================================')
  console.log(routeData)
  console.log('====================================')

  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-row items-center justify-between h-16 ">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-1 m-2"
        >
          <AntDesign name="arrowleft" size={30} color="black" />
        </Pressable>

        <View className="flex flex-col items-center">
          <Text className="text-base font-bold text-black">
            Complete payout details
          </Text>

          <View className="flex flex-row">
            <Text className="text-xs font-extralight ">Powered by </Text>
            <Text className="text-xs text-black">Superfluid</Text>
          </View>
        </View>

        <View className="flex flex-1" />
      </View>

      <View className="flex flex-col justify-between flex-1 p-4 pt-5">
        <View className="flex flex-col flex-1 ">
          {/* Reciver */}

          <Text className="mt-3 font-light text-black">Payment to</Text>
          <View className="flex flex-row items-center w-full py-2 mb-3 rounded-md ">
            <View className="w-10 h-10 rounded-full bg-neutral-200" />

            {/* User info */}
            <View className="flex flex-col flex-1 px-3">
              <Text className="text-base font-bold text-black">
                @{routeData.searchedContact.name}
              </Text>
              <Text className="text-sm font-light text-neutral-600">
                {routeData.searchedContact.address.slice(0, 3)} ...
                {routeData.searchedContact.address.slice(-3)}
              </Text>
            </View>

            <Pressable
              onPress={() => navigation.goBack()}
              className="items-center justify-center "
            >
              <AntDesign name="closecircle" size={20} color="#FBC609" />
            </Pressable>
          </View>

          <Text className="mt-8 mb-2 font-light text-black">Enter amount</Text>
          <View className="flex flex-row w-full mt-1">
            <TextInput
              placeholder="0.0"
              keyboardType="number-pad"
              className="p-3 border-[0.8px] w-2/3 rounded-l-lg border-neutral-300 h-14  text-black"
            />
            <View className="border-[0.8px] border-neutral-300 rounded-r-lg w-28 flex items-center border-l-0 px-3 flex-row justify-between">
              <SelectDropdown
                data={duration}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index)
                }}
                defaultValue={'Month'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  return item
                }}
                buttonStyle={{
                  backgroundColor: '#fff',
                  width: '100%',
                }}
              />

              {/* <MaterialIcons name="arrow-drop-down" size={24} color="black" /> */}
            </View>
          </View>

          <View className="flex flex-row items-center justify-between mt-8">
            <Text className="text-base text-black">Balance: 99997</Text>

            <View className="flex flex-row items-center">
              <View className="w-8 h-8 bg-orange-400 rounded-full" />
              <Text className="mx-2 text-lg text-black">fDAIx</Text>
            </View>
          </View>

          {/* Summary */}
          <View className="w-full p-2 mt-8 border-[0.8px] border-green-500 rounded-lg bg-green-50">
            <View className="flex flex-row items-center justify-between w-full my-2">
              <Text className="font-medium text-green-900">Receiver</Text>
              <Text className="font-bold text-green-500">0xD2..824</Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full my-2">
              <Text className="font-medium text-green-900">Flow rate</Text>
              <Text className="font-bold text-green-500">5 fDAIx/month</Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full my-2">
              <Text className="font-medium text-green-900">
                Amount per second
              </Text>
              <Text className="font-bold text-green-500">
                0.007519025 fDAIx
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full my-2">
              <Text className="font-medium text-green-900">Date</Text>
              <Text className="font-bold text-green-500">
                01/24/3689 at 8:18 PM
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => {}}
          className="items-center justify-center w-full p-4 rounded-lg bg-primary"
        >
          <Text className="text-base font-bold text-black">Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default EnterSalaryAmountScreen

import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import {
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import AppText from '../../components/AppText'
import BackHeader from '../../components/Headers/BackHeader'

import airtel from '../../assets/logos/airtel.jpeg'
import mtn from '../../assets/logos/mtn.jpeg'
import ConfirmPhoneDialog from '../../components/Modals/ConfirmPhoneDialog'

const EnterPhoneScreen = () => {
  const [mobileNetwork, setMobileNetwork] = useState('MTN')
  const network = ['MTN', 'AIRTEL']

  const [isModalVisible, setModalVisible] = useState(false)

  const [phone, setPhone] = useState(null)

  const navigation = useNavigation()

  const router = useRoute()

  const { data } = router.params

  const handleSubmit = () => {
    if (phone.length < 9) {
      return
    }

    setModalVisible(false)

    const phoneNumber = '256' + phone // Make phone more dynamic....

    navigation.navigate('ReviewScreen', {
      data,
      phone: phoneNumber,
      mobileNetwork,
    })
  }

  return (
    <SafeAreaView className="flex flex-1">
      <BackHeader title="Enter Mobile" subTitle="By" cancel />

      <View className="flex-col flex-1 p-5">
        <AppText classProps="text-base mb-3">Select mobile network</AppText>
        <View className="flex flex-row items-center ">
          <SelectDropdown
            data={network}
            onSelect={(selectedItem, index) => {
              setMobileNetwork(selectedItem) // console.log(selectedItem, index)
            }}
            rowTextStyle={{
              fontSize: 15,
            }}
            buttonTextStyle={{
              fontSize: 16,
            }}
            defaultValue={'MTN'}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
            buttonStyle={{
              margin: 0,
              backgroundColor: '#fff',
              width: 110,
              borderRadius: 8,
              backgroundColor: '#fafafa',
            }}
          />

          <View className="relative w-12 h-12 mx-4 overflow-hidden rounded-md bg-neutral-50">
            <Image
              source={mobileNetwork === 'MTN' ? mtn : airtel}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        </View>
        {/* <View className="flex flex-col ">
          <AppText classProps="text-lg">Mobile Network</AppText>
          <TextInput
            defaultValue={mobileNetwork}
            value={mobileNetwork}
            onChangeText={(e) => setMobileNetwork(e)}
            className="px-3 my-2 text-black border rounded-md h-14 border-neutral-400"
          />
        </View> */}

        <View className="flex flex-col flex-1 py-5 ">
          <View className="border-[0.8px] border-neutral-200 p-3 rounded-md w-full h-36">
            <View className="flex flex-col flex-1 py-2">
              <AppText classProps=" text-sm mb-2">Recipient Number: </AppText>

              <View className="flex flex-row items-center flex-1">
                <Text className="text-3xl text-center">🇺🇬</Text>
                <Text className="mx-3 text-black">+256</Text>

                <TextInput
                  keyboardType="phone-pad"
                  placeholderTextColor="#d6d6d4"
                  value={phone}
                  onChangeText={(e) => setPhone(e)}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (phone.length < 9) {
                      return
                    }

                    setModalVisible(true)
                  }}
                  className="flex flex-1 h-10 px-3 text-black rounded-md bg-neutral-100"
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="p-5">
        {/* Button */}
        <Pressable
          onPress={() => setModalVisible(true)}
          disabled={!phone}
          className={`items-center self-center  py-3 rounded-md w-full ${
            phone ? 'bg-primary' : 'bg-neutral-200'
          } `}
        >
          <Text
            className={`text-lg font-bold ${
              !phone ? 'text-white' : 'text-black'
            }`}
          >
            Submit & Continue
          </Text>
        </Pressable>
      </View>
      <ConfirmPhoneDialog
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        phoneNumber={'256' + phone}
        handleSubmit={handleSubmit}
      />
    </SafeAreaView>
  )
}

export default EnterPhoneScreen

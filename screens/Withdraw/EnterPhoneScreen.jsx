import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
} from 'react-native'
import React, { useState } from 'react'
import AppText from '../../components/AppText'
import { useNavigation, useRoute } from '@react-navigation/native'
import BackHeader from '../../components/Headers/BackHeader'
import SelectDropdown from 'react-native-select-dropdown'

import mtn from '../../assets/logos/mtn.jpeg'
import airtel from '../../assets/logos/airtel.jpeg'
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
    setModalVisible(false)

    navigation.navigate('ReviewScreen', {
      data,
      phone,
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

        {/*  */}
        <View className="flex flex-col mt-8 ">
          <AppText classProps="text-base">Enter phone number</AppText>
          <TextInput
            placeholder="+256XXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(e) => setPhone(e)}
            returnKeyType="done"
            onSubmitEditing={() => setModalVisible(true)}
            className="p-3 my-2 text-black border rounded-md h-14 border-neutral-300"
          />
        </View>
      </View>

      <View className="p-5">
        {/* Button */}
        <Pressable
          onPress={() => setModalVisible(true)}
          disabled={!phone}
          className={`items-center self-center  py-3 rounded-full w-full ${
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
        phoneNumber={phone}
        handleSubmit={handleSubmit}
      />
    </SafeAreaView>
  )
}

export default EnterPhoneScreen

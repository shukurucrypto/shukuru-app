import { View, Text, SafeAreaView, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import AppText from '../../components/AppText'
import { useNavigation, useRoute } from '@react-navigation/native'
import BackHeader from '../../components/Headers/BackHeader'

const EnterPhoneScreen = () => {
  const [mobileNetwork, setMobileNetwork] = useState('MTN')
  const [phone, setPhone] = useState(null)

  const navigation = useNavigation()

  const router = useRoute()

  const { data } = router.params

  return (
    <SafeAreaView className="flex flex-1">
      <BackHeader title="Enter Mobile" subTitle="Powered by OneRamp" cancel />

      <View className="flex-col flex-1 p-5">
        <View className="flex flex-col ">
          <AppText classProps="text-lg">Mobile Network</AppText>
          <TextInput
            defaultValue={mobileNetwork}
            value={mobileNetwork}
            onChangeText={(e) => setMobileNetwork(e)}
            className="px-3 my-2 text-black border rounded-md h-14 border-neutral-400"
          />
        </View>

        {/*  */}
        <View className="flex flex-col mt-5 ">
          <AppText classProps="text-lg">Phone Number</AppText>
          <TextInput
            placeholder="+256XXXXXXXX"
            value={phone}
            onChangeText={(e) => setPhone(e)}
            className="p-3 my-2 text-black border rounded-md h-14 border-neutral-400"
          />
        </View>
      </View>

      <View className="p-5">
        {/* Button */}
        <Pressable
          onPress={() =>
            navigation.navigate('ReviewScreen', {
              data,
              phone,
              mobileNetwork,
            })
          }
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
    </SafeAreaView>
  )
}

export default EnterPhoneScreen

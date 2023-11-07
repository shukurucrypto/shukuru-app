import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux'
import AppText from '../components/AppText'
import ResetAccModal from '../components/Modals/ResetAccModal'

const SettingsScreen = () => {
  const profileState = useSelector((state) => state.profile)
  const navigation = useNavigation()

  const [isModalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (!profileState.loading) {
      setCountry({
        currency: profileState.profile.country,
        code: '+256',
      })
    }
  }, [profileState.loading])

  const [country, setCountry] = useState({
    currency: profileState.profile.country,
    code: '+256',
  })

  const handleGoToChangePassword = () => {
    navigation.navigate('EnterPin', { NextScreen: 'ChangePassword' })
  }

  if (!profileState.loading && !profileState.error)
    return (
      <ScrollView className="flex flex-1 p-5">
        <ResetAccModal
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
        <View className="flex justify-center w-full h-16 ">
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={25} color="black" />
          </Pressable>
        </View>
        <AppText classProps="text-xl font-medium mb-3">Settings</AppText>

        <View className="flex flex-col flex-1">
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-base py-5">Edit Profile</AppText>
          </View>

          {/*  */}
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-base py-5">Language</AppText>
            <View className="flex flex-row items-center">
              <AppText classProps="text-base py-5 mr-1">English</AppText>
              <MaterialIcons name="arrow-forward-ios" size={22} />
            </View>
          </View>

          {/*  */}
          <Pressable
            onPress={() =>
              navigation.navigate('SelectCountryScreen', {
                setCountry,
              })
            }
            className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full"
          >
            <AppText classProps="text-base py-5">Currency</AppText>
            <View className="flex flex-row items-center">
              <AppText classProps="text-base py-5 mr-1">
                {country.currency}
              </AppText>
              <MaterialIcons name="arrow-forward-ios" size={22} />
            </View>
          </Pressable>

          {/*  */}
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-base py-5">Connected Phone</AppText>
            <View className="flex flex-row items-center">
              <AppText classProps="text-base py-5 mr-1">
                +
                {profileState.profile.phoneNumber.slice(0, 3) +
                  '...' +
                  profileState.profile.phoneNumber.slice(-2)}
              </AppText>
              <MaterialIcons name="arrow-forward-ios" size={22} />
            </View>
          </View>
        </View>

        {/* Security */}
        <View className="flex flex-col flex-1 mt-10">
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-sm py-5">Security</AppText>
          </View>

          {/*  */}
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-base py-5">Recovery Phrase</AppText>
          </View>

          <Pressable
            // onPress={() => navigation.navigate('ChangePassword')}
            onPress={handleGoToChangePassword}
            className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full"
          >
            <AppText classProps="text-base py-5">Change Password</AppText>
          </Pressable>

          {/*  */}
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-base py-5">
              Require PIN to Open App
            </AppText>
            <View className="flex flex-row items-center">
              <Switch
                trackColor={{ false: '#767577', true: '#fce0ac' }}
                // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                thumbColor={'#f5dd4b'}
                // ios_backgroundColor="#3e3e3e"
                // onValueChange={toggleSwitch}
                value={true}
              />
            </View>
          </View>
        </View>

        {/* Security */}
        <View className="flex flex-col flex-1 mt-10">
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-sm py-5">Alerts</AppText>
          </View>

          {/*  */}
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-base py-5">Payment alerts</AppText>
            <View className="flex flex-row items-center">
              <Switch
                trackColor={{ false: '#767577', true: '#fce0ac' }}
                // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                thumbColor={'#f5dd4b'}
                // ios_backgroundColor="#3e3e3e"
                // onValueChange={toggleSwitch}
                value={true}
              />
            </View>
          </View>

          {/*  */}
          <View className="flex flex-row border-b-[0.8px] border-neutral-400 items-center justify-between w-full">
            <AppText classProps="text-base py-5">New feature updates</AppText>
            <View className="flex flex-row items-center">
              {/* <Text className="py-5 mr-1 text-base text-green-600">YES</Text> */}
              <Switch
                trackColor={{ false: '#767577', true: '#fce0ac' }}
                // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                thumbColor={'#f5dd4b'}
                // ios_backgroundColor="#3e3e3e"
                // onValueChange={toggleSwitch}
                value={true}
              />
            </View>
          </View>
        </View>

        {/* My data */}
        <TouchableHighlight
          onPress={() => setModalVisible(true)}
          activeOpacity={0.6}
          underlayColor="#f7f5f5"
          className="flex flex-col flex-1 py-10 mt-20"
        >
          {/*  */}
          <View className="flex flex-col border-t-[0.8px] border-neutral-400 justify-between w-full">
            <Text className="py-3 text-base font-bold text-red-600">
              Delete My Account
            </Text>

            <Text className="text-base font-light text-red-600">
              Reseting will{' '}
              <Text className="font-bold underline">COMPLETELY</Text> wipe all
              your funds.
            </Text>
            <Text className="text-base font-light text-red-600">
              Nobody, not even Shukuru, will be able to recover your account.
            </Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
    )
}

export default SettingsScreen

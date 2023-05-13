import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Contacts from 'react-native-contacts'
import { PermissionsAndroid } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import ContactCard from '../components/Cards/ContactCard'
import AppText from '../components/AppText'
import axios from 'axios'
import { API_URL } from '../apiURL'

const FindUser = () => {
  const navigation = useNavigation()

  const route = useRoute()

  const [loading, setLoading] = useState(false)
  const [searchedContact, setSearchedContact] = useState(null)
  const [contacts, setContacts] = useState([])
  const [error, setError] = useState(null)
  const [searchErr, setSearchErr] = useState(null)

  const [text, setText] = useState('')

  const { token, refresh } = route.params

  const handleSearch = async () => {
    setLoading(true)
    try {
      const result = await axios.get(`${API_URL}/profile/${text}`)

      if (result.data.success) {
        setSearchedContact(result.data.data)
      } else {
        setSearchErr('Number not found. Make sure you add the country code')
      }

      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (text.length > 10) {
      handleSearch()
    }
  }, [text])

  // useEffect(() => {
  //   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
  //     title: 'Contacts',
  //     message: 'This app would like to view your contacts.',
  //     buttonPositive: 'Please accept bare mortal',
  //   }).then(
  //     Contacts.getAll()
  //       .then((contacts) => {
  //         // work with contacts
  //         setContacts(contacts)
  //       })
  //       .catch((e) => {
  //         console.log(e)
  //       })
  //   )
  // }, [])

  const navigateToTerminal = () => {
    // .

    navigation.navigate('SendTerminal', {
      token: token,
      contactNumber: searchedContact.phoneNumber,
      userId: searchedContact._id,
      refresh: refresh,
    })
  }

  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString()
  }
  const renderItem = ({ item, index }) => {
    return (
      <ContactCard contact={item} navigateToTerminal={navigateToTerminal} />
    )
  }

  return (
    <View className="flex flex-col flex-1 p-5">
      {/* Header */}
      <View className="flex flex-row items-center w-full mb-4">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center flex-1"
        >
          <AntDesign name="close" size={25} color="black" />
        </Pressable>

        <View className="flex items-center justify-center flex-1">
          <AppText classProps="mx-3 text-xl font-bold">Send</AppText>
          <AppText classProps="text-xs font-extralight">{token}</AppText>
        </View>

        <View className="flex items-end flex-1 ">
          <Ionicons name="qr-code" size={25} color="black" />
        </View>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Form */}
            <View className="flex flex-row items-center justify-center w-full px-4 my-5">
              <AppText classProps="text-base ">To</AppText>
              <TextInput
                placeholder="Enter your phone 256(XXXXXXX) "
                value={text}
                onChangeText={(e) => setText(e)}
                onBlur={() => setSearchedContact({})}
                className="w-full border-[0.8px] rounded-lg text-base h-12 px-4 border-neutral-400 relative ml-3"
              />

              {loading && (
                <View className="absolute rounded-full right-4">
                  <ActivityIndicator size={8} color="#ef4444" />
                </View>
              )}
            </View>

            <View className="flex flex-row items-center w-full p-3 rounded-md bg-neutral-200">
              <View className="mr-3 bg-white rounded-full w-14 h-14" />
              <View className="flex flex-col flex-1">
                <AppText classProps="text-base font-bold">
                  Invite your friends and get paid in BTC
                </AppText>
                <AppText classProps="mt-1 font-light">
                  Optimised to fit the local businesses and markets through
                  easily helping them to start accepting crypto
                </AppText>
              </View>
            </View>

            <View className="mt-4">
              <AppText classProps="font-light text-neutral-500">
                Contacts
              </AppText>

              {searchedContact && (
                <ContactCard
                  contact={searchedContact}
                  navigateToTerminal={navigateToTerminal}
                />
              )}

              {searchErr && (
                <View className="flex items-center self-center justify-center w-1/2 py-5">
                  <Text className="text-center text-neutral-700">
                    {searchErr}
                  </Text>
                </View>
              )}
            </View>
          </>
        }
        // data={searchedContact ? searchedContact : contacts}
        data={searchedContact}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        className="flex flex-1"
      />
    </View>
  )
}

export default FindUser

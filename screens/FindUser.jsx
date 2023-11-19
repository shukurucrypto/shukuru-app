import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { API_URL } from '../apiURL'
import AppText from '../components/AppText'
import ContactCard from '../components/Cards/ContactCard'

const FindUser = () => {
  const navigation = useNavigation()

  const route = useRoute()

  const [loading, setLoading] = useState(false)
  const [searchedContact, setSearchedContact] = useState(null)
  const [error, setError] = useState(null)
  const [searchErr, setSearchErr] = useState(null)

  const [showSearch, setShowSearch] = useState(false)

  const [text, setText] = useState('')

  const { token, refresh } = route.params

  useEffect(() => {
    if (text.length > 0) {
      handleSearch()
      setShowSearch(true)
    } else {
      setShowSearch(false)
    }
  }, [text])

  useEffect(() => {
    if (text.length > 3 && token != 'BTC-LT') {
      // handleSearch()
      setShowSearch(true)
    }

    if (text.startsWith('0x') && text.length == 42 && token != 'BTC-LT') {
      navigation.navigate('ExternalSendTerminal', {
        to: text,
      })
    }

    if (
      (text.length > 11 && text.startsWith('lntb')) ||
      text.startsWith('lnbc') ||
      text.startsWith('lightning') ||
      text.startsWith('LNBC')
    ) {
      navigation.navigate('ReadInvoiceScreen', {
        data: text,
        refresh: () => {},
      })
    }
  }, [text])

  const handleSearch = async () => {
    // Keyboard.dismiss()
    setLoading(true)
    try {
      const result = await axios.get(`${API_URL}/profile/name/${text}`)

      if (result.data.success) {
        setSearchedContact(result.data.data)
      } else {
        setSearchErr(`No user with @${text} found. Try again`)
        setSearchedContact(null)
      }

      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const navigateToTerminal = () => {
    navigation.navigate('SendTerminal', {
      token: token,
      contactNumber: searchedContact.phoneNumber,
      user: searchedContact,
      refresh: refresh,
    })
  }

  const renderContactCard = () => {
    if (searchedContact) {
      return (
        <ContactCard
          contact={searchedContact}
          navigateToTerminal={navigateToTerminal}
        />
      )
    } else if (searchErr) {
      return (
        <View className="flex items-center self-center justify-center w-1/2 py-5">
          <Text className="text-center text-neutral-700">{searchErr}</Text>
        </View>
      )
    }
    return null
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

        <View className="flex items-end flex-1">
          {/* <Ionicons name="qr-code" size={25} color="black" /> */}
        </View>
      </View>

      {/* Form */}
      <View className="flex flex-row items-center justify-center w-full h-12 my-4">
        <View className="flex flex-1">
          <TextInput
            placeholder="Name, phone, invoice or address"
            value={text}
            onChangeText={(e) => setText(e)}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            onSubmitEditing={navigateToTerminal}
            onBlur={() => setSearchedContact(null)}
            returnKeyType="done"
            className="relative w-full h-full px-4 text-base text-black border rounded-lg border-neutral-300"
          />
        </View>

        <View className="flex items-center justify-center">
          <Pressable
            onPress={handleSearch}
            disabled={loading}
            className={`flex items-center justify-center w-10 h-full ml-2 rounded-md bg-primary`}
          >
            {loading ? (
              <ActivityIndicator size={12} color="black" />
            ) : (
              <AntDesign name="search1" size={20} color="black" />
            )}
          </Pressable>
        </View>
      </View>

      <View className="w-full h-8">
        {text && !loading && showSearch ? (
          <Pressable onPress={handleSearch} className="">
            <Text className="font-bold text-neutral-600">
              Show results for <Text className="text-blue-500 ">"{text}"</Text>
            </Text>
          </Pressable>
        ) : (
          <Text className="text-sm font-light text-neutral-600">
            You can also paste your lightning invoice here
          </Text>
        )}
      </View>

      {/* Render Contact Card */}
      {renderContactCard()}

      {/* Additional content goes here if needed */}
    </View>
  )
}

export default FindUser

import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  countriesCodes,
  countriesCurrencies,
  countriesWithFlags,
} from '../data/countries'
import AppText from '../components/AppText'

const SelectCountyScreen = () => {
  const [loading, setLoading] = useState(false)
  const [countries, SetCountries] = useState([])
  const [error, setError] = useState(null)

  const [searched, setSearched] = useState([])
  const [text, setText] = useState('')

  const navigation = useNavigation()

  const router = useRoute()

  const { setCountry } = router.params

  useEffect(() => {
    if (text.length > 2) {
      searchForCountry()
    }
  }, [text])

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className={`py-2 border-b-[0.8xpx] border-neutral-500 flex flex-row items-center `}
      onPress={() => handleCurrencySelection(item)}
    >
      <Text className={`text-gray-500 text-xl mr-3`}>{item.unicodeFlag}</Text>
      <View className="flex flex-col">
        <Text numberOfLines={1} className={`text-lg text-gray-800`}>
          {item.name}
        </Text>
        <Text className={`text-gray-500 `}>{item.iso3}</Text>
      </View>
    </TouchableOpacity>
  )

  const handleCurrencySelection = (item) => {
    // Do something with the selected country and currency

    const selected = countriesCurrencies.find(
      (country) => country.name === item.name
    )
    const countryCode = countriesCodes.find(
      (country) => country.name === item.name
    )

    const data = {
      currency: selected.currency,
      code: countryCode.dial_code,
    }

    setCountry(data)
    navigation.goBack()
  }

  const searchForCountry = () => {
    const country = countriesWithFlags.filter(
      (item) => text.trim() === item.name
    )
    setSearched(country)
  }

  const handleBlur = () => {
    setText(text.trim())
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center`}>
        <Text className={`text-lg text-red-600`}>{error}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex flex-1">
      <View className="flex flex-1 p-5">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <View className="flex flex-col items-center w-full h-16 ">
              <View className="flex flex-row items-center">
                <Pressable onPress={() => navigation.goBack()}>
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={25}
                    color="black"
                  />
                </Pressable>

                <View className="flex items-center justify-center flex-1">
                  <TextInput
                    placeholder="Search for your country"
                    className="p-4 border-b-[0.8px] border-neutral-300 text-black px-4 w-full "
                    // onBlur={searchForCountry}
                    value={text}
                    onChangeText={(e) => setText(e)}
                    onBlur={handleBlur}
                  />
                </View>
              </View>
            </View>
            <FlatList
              data={searched}
              keyExtractor={(item) => item.name}
              renderItem={renderItem}
              // contentContainerStyle={tw`p-4`}
              contentContainerStyle={{
                padding: 12,
              }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

export default SelectCountyScreen

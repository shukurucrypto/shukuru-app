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
import { API_URL } from '../apiURL'
import { useDispatch, useSelector } from 'react-redux'
import { fetchedProfile } from '../features/profile/profileSlice'

const SelectCountyScreen = () => {
  const [loading, setLoading] = useState(false)
  const [countries, SetCountries] = useState([])
  const [error, setError] = useState(null)

  const { user } = useSelector((state) => state.user)

  const [submitLoading, setSubmitLoading] = useState(false)

  const [searched, setSearched] = useState([])
  const [text, setText] = useState('')

  const navigation = useNavigation()

  const dispatch = useDispatch()

  const router = useRoute()

  const { setCountry } = router.params

  useEffect(() => {
    if (text.length > 2) {
      searchForCountry()
    }
  }, [text])

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className={`py-2 border-b-[0.8xpx] border-neutral-500 flex flex-row items-center`}
      onPress={() => handleCurrencySelection(item)}
    >
      <View className="flex flex-row items-center flex-1">
        <Text className={`text-gray-500 text-xl mr-3`}>{item.unicodeFlag}</Text>
        <View className="flex flex-col">
          <Text numberOfLines={1} className={`text-lg text-gray-800`}>
            {item.name}
          </Text>
          <Text className={`text-gray-500 `}>{item.iso3}</Text>
        </View>
      </View>

      {submitLoading && <ActivityIndicator size={18} color="#FBC609" />}
    </TouchableOpacity>
  )

  const handleCurrencySelection = (item) => {
    // Do something with the selected country and currency

    const selected = countriesCurrencies.find(
      (country) => country?.name === item?.name
    )
    const countryCode = countriesCodes.find(
      (country) => country?.name === item?.name
    )

    const data = {
      currency: selected?.currency,
      code: countryCode?.dial_code,
    }

    setCountry(data)
    changeUserCountry(data.currency) //
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

  const changeUserCountry = async (country) => {
    setSubmitLoading(true)
    try {
      const data = {
        country: country,
      }
      const result = await axios.post(`${API_URL}/user/country/update`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (result.data.success) {
        // Update the userState
        dispatch(fetchedProfile(result.data.data))

        navigation.goBack()
      }
      setSubmitLoading(false)
    } catch (error) {
      console.log(error.message)
    }
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
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={25} color="black" />
        </Pressable>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <View className="flex flex-col w-full mt-6 justify-evenly h-28 ">
              <AppText classProps="text-xl font-bold">
                Search for your Country
              </AppText>
              <View className="flex flex-row items-center">
                <View className="flex items-center justify-center flex-1">
                  <TextInput
                    placeholder="Search for your country"
                    placeholderTextColor="black"
                    className="w-full p-4 px-4 text-black rounded-md bg-neutral-100 "
                    // onBlur={searchForCountry}
                    value={text}
                    onChangeText={(e) => setText(e)}
                    onBlur={handleBlur}
                    autoCapitalize="words"
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

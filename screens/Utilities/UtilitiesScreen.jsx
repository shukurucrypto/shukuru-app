import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
} from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AppText from '../../components/AppText'
import { bundles } from '../../data/bundle'
import { useSelector } from 'react-redux'

const UtilitiesScreen = () => {
  const navigation = useNavigation()
  // const coin = ['BITCOIN', 'CUSD', 'BUSD']
  const coin = ['BITCOIN', 'CUSD']
  const [selectedCoin, setSelectedCoin] = useState('CUSD')

  const { balances } = useSelector((state) => state.balances)

  const [error, setError] = useState('')
  const [errorShown, setErrorShown] = useState(false)

  const [provider, setProvider] = useState('MTN')

  const handleSubmit = (item) => {
    const selectedTokenLowercase = selectedCoin.toLowerCase()

    if (balances[selectedTokenLowercase] > 0.0023) {
      const payload = {
        token: selectedCoin,
        provider: provider,
        item: item,
      }
      // navigation.navigate('PayUtilityScreen', { payload })
      navigation.navigate('EnterNumberScreen', { payload })
    } else {
      setError(`You have insufficient ${selectedCoin} to buy this bundle`)

      setErrorShown(true)

      setTimeout(() => {
        setErrorShown(false)
      }, 1000)
    }
  }

  const renderIcon = () => {
    switch (selectedCoin) {
      case 'BITCOIN':
        return (
          <View className="flex items-center justify-center w-6 h-6 bg-orange-500 rounded-full">
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={20}
              color="#fff"
            />
          </View>
        )

      case 'CUSD':
        return (
          <View className="flex items-center justify-center w-6 h-6 rounded-full">
            <Image
              source={require('../../assets/tokens/cusd.png')}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )

      default:
        return (
          <View className="flex items-center justify-center w-6 h-6 bg-orange-500 rounded-full">
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={20}
              color="#fff"
            />
          </View>
        )
    }
  }
  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex flex-1">
        <View className="flex flex-col flex-1">
          <View className="flex flex-row w-full p-4">
            <Pressable
              onPress={() => navigation.goBack()}
              className="flex flex-1"
            >
              <AntDesign name="close" size={30} color="black" />
            </Pressable>

            <View className="flex items-center justify-center flex-1 ">
              <AppText classProps="text-lg font-bold">Buy Data</AppText>
            </View>

            <View className="flex flex-1" />
          </View>

          {/* top up */}
          <View className="flex flex-row items-center justify-center w-full p-5">
            <View className="flex flex-1">
              <AppText classProps="text-base">Buy using</AppText>
            </View>

            {/*  */}
            <View className="flex flex-row items-center justify-end flex-1 ">
              {/* <View className="flex items-center justify-center w-6 h-6 rounded-full">
                <Image
                  source={require('../../assets/tokens/cusd.png')}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>

              <AppText classProps="text-lg ml-2">cUSD</AppText> */}

              <SelectDropdown
                data={coin}
                onSelect={(selectedItem, index) => {
                  // console.log(selectedItem, index)
                  let selectedCoin

                  if (selectedItem === 'BITCOIN') {
                    selectedCoin = 'lightning'
                  } else {
                    selectedCoin = selectedItem
                  }

                  setSelectedCoin(selectedCoin)
                }}
                defaultValue={'CUSD'}
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
                }}
              />

              {renderIcon()}
            </View>
          </View>

          {/* Select provider */}
          <View className="w-full px-5 pb-3">
            <AppText classProps="text-base">Select provider</AppText>
          </View>
          <View className="flex flex-row items-center w-full px-5 h-28">
            <Pressable
              onPress={() => setProvider('MTN')}
              className={`h-full w-28 border-[0.8px] rounded-md border-neutral-200 flex items-center justify-center overflow-hidden p-3 mr-4 ${
                provider === 'MTN' && 'bg-blue-100'
              } `}
            >
              <Image
                source={require('../../assets/logos/mtn.jpeg')}
                style={{ width: '100%', height: '100%' }}
              />
            </Pressable>
            <Pressable
              onPress={() => setProvider('AIRTEL')}
              className={`h-full w-28 border-[0.8px] rounded-md border-neutral-200 flex items-center justify-center overflow-hidden p-3 ${
                provider === 'AIRTEL' && 'bg-blue-100'
              } `}
            >
              <Image
                source={require('../../assets/logos/airtel.jpeg')}
                style={{ width: '100%', height: '100%' }}
              />
            </Pressable>
          </View>

          {/* Select provider */}
          <View className="w-full px-5 py-3">
            <AppText classProps="text-base">Select category</AppText>
          </View>
          <View className="flex flex-row items-center w-full px-5">
            <View className="px-5 py-2 mr-4 rounded-full bg-primary">
              <Text className="text-black">Daily</Text>
            </View>

            <View className="px-5 py-2 mr-4 rounded-full bg-neutral-200">
              <Text className="font-bold text-white">Weekly</Text>
            </View>

            <View className="px-5 py-2 mr-4 rounded-full bg-neutral-200">
              <Text className="font-bold text-white">Monthly</Text>
            </View>
          </View>

          {/* Select provider */}
          <View className="w-full px-5 py-3">
            <AppText classProps="text-base">Select a bundle</AppText>
          </View>

          {bundles.map((item) => (
            <Pressable
              onPress={() => handleSubmit(item)}
              key={item.id}
              className="flex flex-row items-center justify-between w-full h-20 px-4 mb-3 bg-neutral-100"
            >
              <View className="flex flex-col">
                <Text className="text-neutral-400">Daily</Text>
                <AppText classProps="text-base font-bold">
                  {item.amount} {item.weight}
                </AppText>
              </View>
              <Text className="text-base font-bold text-black">
                UGX {item.price}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {error && errorShown && (
        <Text className="absolute z-10 p-1 text-sm text-center text-white rounded-lg right-4 bg-neutral-700 bottom-5 left-4">
          {error}
        </Text>
      )}
    </SafeAreaView>
  )
}

export default UtilitiesScreen

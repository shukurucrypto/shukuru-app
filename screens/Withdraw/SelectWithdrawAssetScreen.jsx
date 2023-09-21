import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import BackHeader from '../../components/Headers/BackHeader'
import AppText from '../../components/AppText'
import ListSelector from '../../components/AssetSelector'

const SelectWithdrawAssetScreen = () => {
  // const options = ['Celo Dollar (cUSD)', 'Binance Dollar (BUSD)']

  const options = [
    { id: 1, name: 'Celo Dollar (cUSD)', network: 'celo' },
    { id: 2, name: 'Binance Dollar (BUSD)', network: 'bnb' },
  ]

  const [selected, setSelected] = useState(null)

  const handleOptionSelect = (selectedOption) => {
    setSelected(selectedOption)
  }

  const navigation = useNavigation()
  return (
    <SafeAreaView className="flex flex-1">
      <BackHeader title="Withdraw Funds" subTitle="Powered by OneRamp" />
      <View className="flex flex-col flex-1 p-5">
        <AppText classProps="text-lg font-medium">Select an asset</AppText>

        <ListSelector options={options} onSelect={handleOptionSelect} />
      </View>

      <View className="p-5">
        <Pressable
          onPress={() =>
            navigation.navigate('TerminalScreen', {
              assetName: selected?.name.includes('cUSD') ? 'cUSD' : 'BUSD',
              asset: selected,
            })
          }
          disabled={!selected}
          className={`items-center self-center py-3 rounded-full  w-full ${
            selected ? 'bg-primary' : 'bg-neutral-200'
          } `}
        >
          <Text
            className={`text-base font-bold ${
              !selected ? 'text-white' : 'text-black'
            }`}
          >
            Next
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default SelectWithdrawAssetScreen

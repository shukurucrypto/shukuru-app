import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useSelector } from 'react-redux'

const ListSelector = ({ options, onSelect }) => {
  const { balances, loading, error } = useSelector((state) => state.balances)

  const [selectedOption, setSelectedOption] = useState(null)

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    onSelect(option)
  }

  // Filter the options based on user balance
  const filteredOptions = options.filter((option) => {
    // Check the currency type and balance key

    if (option.name.includes('cUSD')) {
      return balances.cusd > 0
    } else if (option.name.includes('BUSD')) {
      return balances.busd > 0
    }
    return true // Show other currencies by default (you can adjust this as needed)
  })

  return (
    <View style={styles.container}>
      {filteredOptions.map((option, index) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.option,
            selectedOption?.id === option.id && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect(option)}
        >
          {option.name.includes('cUSD') ? (
            <Image
              source={require('../assets/tokens/cusd.png')}
              style={{ width: 25, height: 25, marginRight: 8 }}
            />
          ) : (
            <View className="flex items-center justify-center w-6 h-6 mr-2 bg-black rounded-full">
              <Image
                source={require('../assets/tokens/busd.png')}
                style={{ width: 18, height: 18 }}
              />
            </View>
          )}
          <Text style={styles.optionText}>{option.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 18,
    borderRadius: 10,
  },
  option: {
    paddingVertical: 14,

    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#f2f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#404040',
  },
})

export default ListSelector

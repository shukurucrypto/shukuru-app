import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const ListSelector = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null)

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    onSelect(option)
  }

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
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
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
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

// Usage example
// const App = () => {
//   return (
//   );
// };

// export default App;

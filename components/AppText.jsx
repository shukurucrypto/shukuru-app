import { View, Text } from 'react-native'
import React from 'react'

const AppText = ({ classProps, children, numberOfLines }) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={classProps + ' text-neutral-700'}
    >
      {children}
    </Text>
  )
}

export default AppText

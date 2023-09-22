import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import AppText from '../AppText'

function SupportedCountry({ isModalVisible, setModalVisible }) {
  return (
    <Modal isVisible={isModalVisible}>
      <View className="flex p-5 bg-white rounded-md justify-evenly ">
        <AppText classProps="text-lg font-bold mb-3">
          ⚠️ Region Not Supported
        </AppText>
        <AppText classProps="text-base font-meduim mb-2">
          Crypto to MOMO withdraws are only supported in Uganda for now.
        </AppText>

        <View className="flex flex-row items-center justify-end w-full mt-8">
          {/* <Pressable onPress={() => setModalVisible(false)}>
            <Text className="text-base font-bold text-blue-400 ">Edit</Text>
          </Pressable> */}

          <Pressable onPress={() => setModalVisible(false)}>
            <Text className="text-base font-bold text-blue-400">OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default SupportedCountry

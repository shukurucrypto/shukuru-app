import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import AppText from '../AppText'

function ConfirmPhoneDialog({
  isModalVisible,
  setModalVisible,
  phoneNumber,
  handleSubmit,
}) {
  return (
    <Modal isVisible={isModalVisible}>
      <View className="flex p-5 bg-white rounded-md justify-evenly ">
        <AppText classProps="text-base font-meduim mb-2">
          Is this the correct number?
        </AppText>

        <AppText classProps="text-xl font-bold mb-3">+{phoneNumber}</AppText>

        <View className="flex flex-row items-center justify-between w-full mt-8">
          <Pressable onPress={() => setModalVisible(false)}>
            <Text className="text-base font-bold text-blue-400 ">Edit</Text>
          </Pressable>

          <Pressable onPress={handleSubmit}>
            <Text className="text-base font-bold text-blue-400">Yes</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmPhoneDialog

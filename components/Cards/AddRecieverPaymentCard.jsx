import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const AddRecieverPaymentCard = ({ contact, navigateToTerminal }) => {
  if (!contact?.phoneNumber) return null

  return (
    <Pressable onPress={navigateToTerminal} style={styles.contactCon}>
      <View style={styles.imgCon}>
        <View style={styles.placeholder}>
          <Text style={styles.txt}>{contact?.name.slice(0, 1)}</Text>
        </View>
      </View>
      <View style={styles.contactDat}>
        <Text style={styles.name}>@{contact?.name}</Text>
        <Text style={styles.phoneNumber}>
          {contact?.phoneNumber?.slice(0, 3) +
            '...' +
            contact?.phoneNumber?.slice(-2)}
        </Text>
      </View>

      <Pressable
        onPress={navigateToTerminal}
        className="items-center justify-center "
      >
        <AntDesign name="pluscircle" size={24} color="#FBC609" />
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  contactCon: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    marginVertical: 12,
  },
  imgCon: {},
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 8,
    overflow: 'hidden',
    backgroundColor: '#f58b56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDat: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  txt: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  name: {
    fontSize: 16,
    color: '#404040',
    fontWeight: '600',
  },
  phoneNumber: {
    color: '#888',
  },
})
export default AddRecieverPaymentCard

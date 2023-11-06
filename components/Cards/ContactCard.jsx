import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const ContactCard = ({ contact, navigateToTerminal }) => {
  // if (!contact?.phoneNumber) return null

  if (contact)
    return (
      <Pressable onPress={navigateToTerminal} style={styles.contactCon}>
        <View style={styles.imgCon}>
          <View style={styles.placeholder}>
            {/* <Text style={styles.txt}>{contact?.givenName[0]}</Text> */}
            <Text style={styles.txt}>{contact?.name.slice(0, 1)}</Text>
          </View>
        </View>
        <View style={styles.contactDat}>
          {/* <Text style={styles.name}>
          {contact?.givenName} {contact?.middleName && contact.middleName + ' '}
          {contact?.familyName}
        </Text> */}
          <Text style={styles.name}>@{contact?.name}</Text>
          <Text style={styles.phoneNumber}>
            {/* {contact?.phoneNumbers[0]?.number} */}+
            {contact?.phoneNumber?.slice(0, 3) +
              '...' +
              contact?.phoneNumber?.slice(-2)}
          </Text>
        </View>
      </Pressable>
    )
}

const styles = StyleSheet.create({
  contactCon: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
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
export default ContactCard

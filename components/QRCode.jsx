import React from 'react'
import QRCode from 'react-native-qrcode-svg'

const QRCODE = ({ data }) => {
  return (
    <QRCode
      value={data}
      logo={require('../assets/logos/logo.png')}
      logoSize={50}
      logoBackgroundColor="transparent"
      size={250}
    />
  )
}

export default QRCODE

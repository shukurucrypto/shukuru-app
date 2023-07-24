import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'
import AppText from './AppText'

const CountdownComponent = ({ initialBalance, flowRate }) => {
  const [currentBalance, setCurrentBalance] = useState(initialBalance)

  useEffect(() => {
    let interval

    // Calculate the time interval (in milliseconds) to update the balance
    const updateInterval = 1000 // 1 second, you can adjust this interval if needed

    // Start the countdown timer
    interval = setInterval(() => {
      // Calculate the change in balance based on the flow rate and update interval
      const balanceChange = flowRate * (updateInterval / 1000)

      // Update the current balance by subtracting the balance change
      setCurrentBalance((prevBalance) => prevBalance - balanceChange)
    }, updateInterval)

    // Clean up the interval on component unmount
    return () => clearInterval(interval)
  }, [flowRate])

  // Format the current balance to display with the desired number of decimals
  const formattedBalance = currentBalance.toFixed(2) // For example, show two decimal places

  return (
    <AppText classProps="text-4xl font-bold mx-3">{formattedBalance}</AppText>
  )
}

export default CountdownComponent

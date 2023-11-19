import { View, Text, StatusBar, SafeAreaView } from 'react-native'
import Lottie from 'lottie-react-native'
import React, { useEffect, useState } from 'react'
import TypeWriter from 'react-native-typewriter'
import { famousQuotes } from '../../data'

const LoginAnimator = () => {
  const [showAuthor, setShowAuthor] = useState(false)
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveQuoteIndex((prevIndex) => (prevIndex + 1) % famousQuotes.length)
      setShowAuthor(false)
    }, 20000) // Change the quote every 10 seconds (adjust this value as needed)

    return () => clearTimeout(timer)
  }, [activeQuoteIndex])

  const handleTypingEnd = () => {
    setShowAuthor(true)
  }

  const activeQuote = famousQuotes[activeQuoteIndex]

  return (
    <SafeAreaView className="flex flex-1 bg-primary">
      <View className="flex flex-1 bg-primary ">
        <StatusBar backgroundColor="#FBC609" translucent />

        <View className="flex flex-1" />
        <View className="flex items-center justify-center flex-1 h-full bg-primary">
          <Lottie
            source={require('../../assets/animations/people.json')}
            autoPlay
            loop
            style={{
              width: 300,
              height: 300,
            }}
          />
        </View>
        <View className="flex justify-end flex-1 p-4">
          <TypeWriter
            className="text-xl italic font-extrabold text-center text-black shadow-lg"
            typing={1}
            onTypingEnd={handleTypingEnd}
          >
            "{activeQuote.text}"
          </TypeWriter>

          {showAuthor && (
            <TypeWriter
              typing={5}
              className="text-sm font-extrabold text-right text-black"
            >
              {activeQuote.author}
            </TypeWriter>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginAnimator

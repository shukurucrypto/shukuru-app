import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { paymentStreamData } from '../../data'
import TypeWriter from 'react-native-typewriter'
import Lottie from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native'

const PaymentOnboardingScreen = () => {
  const navigation = useNavigation()
  return (
    <ScrollView showsHorizontalScrollIndicator={false} className="flex flex-1">
      <Pressable onPress={() => navigation.goBack()} className="flex m-2">
        <AntDesign name="close" size={30} color="black" />
      </Pressable>

      <View className="flex flex-col justify-between flex-1">
        <View className="flex flex-1">
          <SwiperFlatList
            // autoplay
            autoplayDelay={10}
            autoplayLoop
            index={0}
            showPagination={false}
            data={paymentStreamData}
            renderItem={({ item }) => (
              // <View style={[styles.child, { backgroundColor: item.color }]}>
              <View style={[styles.child]}>
                <View className="flex flex-1 pt-8">
                  <View className="flex items-center justify-center flex-1">
                    <Lottie
                      source={item.illustration}
                      autoPlay
                      loop
                      style={{ width: 150, height: 150 }}
                    />
                    <Text className="mb-4 text-3xl font-bold text-center text-black">
                      Stream payments
                    </Text>
                  </View>

                  <View className="flex flex-1 pr-10">
                    <View className="flex flex-row items-center mt-4">
                      <View className="border-black border-[0.8px] rounded-full w-5 items-center  justify-center h-5">
                        <Text className="text-black ">1</Text>
                      </View>

                      <Text className="ml-3 text-base text-black">
                        Add employee to recieve frequent payout
                      </Text>
                    </View>

                    <View className="flex flex-row my-5">
                      <View className="border-black border-[0.8px] rounded-full w-5 items-center  justify-center h-5">
                        <Text className="text-black ">2</Text>
                      </View>

                      <Text className="ml-3 text-base text-black">
                        Enter the amount the employee is going to recieve
                      </Text>
                    </View>

                    <View className="flex flex-row ">
                      <View className="border-black border-[0.8px] rounded-full w-5 items-center  justify-center h-5">
                        <Text className="text-black ">3</Text>
                      </View>

                      <Text className="ml-3 text-base text-black">
                        Schedule the duration you want to send out each payment
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex flex-col my-4">
                  <TypeWriter
                    className="text-lg font-bold text-center text-black "
                    typing={1}
                  >
                    {item.description}
                  </TypeWriter>
                </View>
              </View>
            )}
          />
        </View>

        <View className="flex flex-row items-center justify-between w-full px-6">
          <Pressable
            onPress={() => navigation.navigate('FindRecieverScreen')}
            className="flex items-center w-full p-4 mb-8 rounded-lg bg-primary"
          >
            <Text className="text-lg font-bold text-black">Setup Now</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  child: { width, padding: 25 },
  text: { fontSize: 25, textAlign: 'center' },
})

export default PaymentOnboardingScreen

import React, { useRef } from 'react'
import Banner from '../Banner'
import ClaimReward from '../Reward/ClaimReward'
import { ScrollView, useWindowDimensions } from 'react-native'

const ScrollBanner = (hideBanner, advertState, rewardState, setHidebanner) => {
  const width = useWindowDimensions().width

  const scrollViewRef = useRef()

  const onScroll = (event) => {
    // Calculate the width of each item in your banner (you may need to adjust this based on your layout)
    const itemWidth = width

    // Calculate the current index based on the scroll position
    const currentIndex = Math.floor(
      event.nativeEvent.contentOffset.x / itemWidth
    )

    // Calculate the new scroll position to snap to the full width
    const newScrollX = currentIndex * itemWidth

    // Scroll to the new position with animation
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: newScrollX, animated: true })
    }
  }

  if (!hideBanner && advertState) return null

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex flex-row h-48 my-3 bg-neutral-50"
        snapToAlignment="center"
        snapToInterval={width}
        pagingEnabled={true}
        onMomentumScrollEnd={onScroll}
        ref={scrollViewRef}
      >
        {/* {!rewardState.loading &&
          !rewardState.error &&
          rewardState.reward(
            <ClaimReward
              item={rewardState?.reward}
              dismiss={() => setHidebanner(true)}
            />
          )} */}
        {advertState?.banners?.map((item) => (
          <Banner
            key={item.id}
            item={item}
            dismiss={() => setHidebanner(true)}
          />
        ))}
      </ScrollView>
    </>
  )
}

export default ScrollBanner

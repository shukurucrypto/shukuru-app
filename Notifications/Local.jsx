import notifee from '@notifee/react-native'

const useLocalNotification = () => {
  async function onDisplayNotification(data) {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    })

    // Display a notification
    notifee.displayNotification({
      title: data.title,
      //   subtitle: `from ${data.subtitle}`,
      body: data.body,
      android: {
        channelId,
        color: 'black',
        actions: [
          //   {
          //     title: 'Book',
          //     pressAction: {id: 'dance'},
          //   },
          {
            title: '<p style="color: #FBC609;"><b>See more</b></p>',
            pressAction: { id: 'more' },
          },
        ],
      },
    })
  }

  return onDisplayNotification
}

export default useLocalNotification

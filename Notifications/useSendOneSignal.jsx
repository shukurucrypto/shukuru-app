import axios from 'axios'

const useSendOneSignal = () => {
  async function sendOnesignal(heading, content, playerIds) {
    try {
      const options = {
        method: 'POST',
        url: 'https://onesignal.com/api/v1/notifications',
        headers: {
          accept: 'application/json',
          Authorization:
            'Basic MzE1NDBmMjItNzRiOS00MGYwLWE1MDQtNzNkMGE2MzMwOGIy',
          'content-type': 'application/json',
        },
        data: {
          app_id: 'bdb34439-82ae-4091-bcb3-664874f10810',
          //   include_player_ids: ['6bac8ac3-f7b8-4017-8ee5-36f60588e731'],
          include_external_user_ids: playerIds,
          headings: {
            en: heading,
            es: heading,
          },
          contents: {
            en: content,
            es: content,
          },
          name: 'Payments',
          small_icon: 'ic_stat_onesignal_default',
        },
      }

      const result = axios
        .request(options)
        .then(function (response) {})
        .catch(function (error) {
          return error.message
        })
      return result
    } catch (error) {
      return error.message
    }
  }
  return sendOnesignal
}

export default useSendOneSignal

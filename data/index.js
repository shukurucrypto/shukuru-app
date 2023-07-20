import autopay from '../assets/animations/autopay.json'

export const transactions = [
  {
    id: 1,
    to: '+256700719619',
    asset: 'BTC',
    type: 'recieved',
    amount: 1500,
    date: 'Apr 24',
  },
  {
    id: 2,
    to: '+256700719619',
    asset: 'Lightning',
    type: 'sent',
    amount: 2560,
    date: 'Apr 24',
  },
  {
    id: 3,
    to: '0x5CBDf5f9E468dF3888e04155668CcAfC6F6C4dcf',
    asset: 'cUSD',
    type: 'sent',
    amount: 13000,
    date: 'Mar 30',
  },
  {
    id: 4,
    to: '+256700719619',
    asset: 'BTC',
    type: 'recieved',
    amount: 500,
    date: 'Apr 24',
  },
  {
    id: 5,
    to: '+256700719619',
    asset: 'USDT',
    type: 'sent',
    amount: 1500,
    date: 'Apr 24',
  },
  {
    id: 6,
    to: '+256700719619',
    asset: 'cUSD',
    type: 'recieved',
    amount: 1500,
    date: 'Apr 24',
  },
]

export const paymentStreamData = [
  {
    id: 1,
    description:
      'Automate your salary payments based on each employee preferences.',
    color: 'tomato',
    illustration: autopay,
  },
  {
    id: 2,
    description:
      'Customize payment amounts for individual employees and choose between monthly, weekly, or yearly salary cycles.',
    color: 'skyblue',
    illustration: autopay,
  },
  {
    id: 3,
    description:
      'Save time and streamline payroll by simply selecting employee addresses and letting our app handle the rest.',
    color: 'thistle',
    illustration: autopay,
  },
]

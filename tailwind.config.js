const nativewind = require('nativewind/tailwind/native');
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './contents/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FBC609',
        'primary-dark': '#0C0B0B',
        white: '#fff',
      },
      borderRadius: {
        1: '0.8px',
      },
    },
  },
  plugins: [nativewind()],
};

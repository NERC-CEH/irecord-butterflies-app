// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const flumensTailwind = require('@flumens/tailwind/tailwind.config.js');

const primary = {
  // https://www.tailwindshades.com/#color=144.23076923076923%2C47.27272727272728%2C43.13725490196078&step-up=12&step-down=9&hue-shift=0&name=chateau-green&base-stop=5&v=1&overrides=e30%3D
  DEFAULT: '#3AA264',
  50: '#F4FBF7',
  100: '#DEF3E6',
  200: '#B1E3C5',
  300: '#84D3A4',
  400: '#57C382',
  500: '#3AA264',
  600: '#2E804F',
  700: '#225E3A',
  800: '#163D25',
  900: '#0A1B11',
  950: '#040A06'
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    'node_modules/@flumens/ionic/dist/**/*.{js,ts,jsx,tsx}',
    'node_modules/@flumens/tailwind/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      ...flumensTailwind.theme?.extend,

      colors: {
        primary,

        secondary: {
          // https://www.tailwindshades.com/#color=203.89830508474577%2C100%2C46.27450980392157&step-up=11&step-down=10&hue-shift=0&name=azure-radiance&base-stop=5&v=1&overrides=e30%3D
          DEFAULT: '#008EEC',
          50: '#E9F6FF',
          100: '#CDEBFF',
          200: '#95D5FF',
          300: '#5DBFFF',
          400: '#25A8FF',
          500: '#008EEC',
          600: '#006FB9',
          700: '#005186',
          800: '#003253',
          900: '#001320',
          950: '#000406'
        },

        tertiary: {
          // https://www.tailwindshades.com/#color=278%2C20.833333333333336%2C28.235294117647058&step-up=10&step-down=10&hue-shift=0&name=voodoo&base-stop=7&v=1&overrides=e30%3D
          DEFAULT: '#4C3957',
          50: '#EFEAF1',
          100: '#E3DBE7',
          200: '#CBBCD3',
          300: '#B39DBF',
          400: '#9A7EAB',
          500: '#826195',
          600: '#674D76',
          700: '#4C3957',
          800: '#312538',
          900: '#161119',
          950: '#09070A',
        },

        success: {
          // https://www.tailwindshades.com/#color=128.25396825396825%2C100%2C37.05882352941177&step-up=11&step-down=10&hue-shift=0&name=malachite&base-stop=6&v=1&overrides=e30%3D
          DEFAULT: '#00BD1A',
          50: '#F3FFF4',
          100: '#D7FFDC',
          200: '#9EFFAC',
          300: '#66FF7B',
          400: '#2EFF4B',
          500: '#00F522',
          600: '#00BD1A',
          700: '#008A13',
          800: '#00570C',
          900: '#002405',
          950: '#000B01'
        },

        warning: {
          // https://www.tailwindshades.com/#color=28.826815642458104%2C74.89539748953973%2C46.86274509803921&step-up=9&step-down=11&hue-shift=0&name=hot-cinnamon&base-stop=6&v=1&overrides=e30%3D
          DEFAULT: '#D1741E',
          50: '#FDF5EF',
          100: '#FAEADB',
          200: '#F4D2B3',
          300: '#EEBA8A',
          400: '#E9A362',
          500: '#E38B3A',
          600: '#D1741E',
          700: '#A05917',
          800: '#6F3E10',
          900: '#3E2209',
          950: '#251505'
        },

        danger: {
          // https://www.tailwindshades.com/#color=0%2C85.36585365853658%2C59.80392156862745&step-up=7&step-down=15&hue-shift=0&name=flamingo&base-stop=6&v=1&overrides=e30%3D
          DEFAULT: '#F04141',
          50: '#FEF7F7',
          100: '#FDE6E6',
          200: '#FAC5C5',
          300: '#F8A4A4',
          400: '#F58383',
          500: '#F36262',
          600: '#F04141',
          700: '#D41111',
          800: '#8D0B0B',
          900: '#460606',
          950: '#230303'
        },
      },
    },
  },
  plugins: flumensTailwind.plugins,
};

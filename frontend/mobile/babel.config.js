module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        ssr: false,
        displayName: false,
        preprocess: false,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

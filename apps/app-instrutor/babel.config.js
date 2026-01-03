module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // expo-router/babel is deprecated in SDK 50+
      // babel-preset-expo already includes expo-router support
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
          },
        },
      ],
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      "react-native-reanimated/plugin", // Deve ser o último plugin
    ],
  };
};

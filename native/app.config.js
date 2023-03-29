export default {
  name: "AwesomeProject",
  slug: "AwesomeProject",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    permissions: ["FOREGROUND_SERVICE", "WAKE_LOCK"],
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.anonymous.AwesomeProject",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: ["./configPlugins/withForegroundService.js"],
};

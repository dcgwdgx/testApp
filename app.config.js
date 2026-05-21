// For local dev: create a .env file with ARK_API_KEY=your_key
// For production: EAS Build will use EAS Secrets
const ARK_API_KEY = process.env.ARK_API_KEY || 'YOUR_ARK_API_KEY_HERE';

module.exports = {
  expo: {
    name: 'Pet Portrait AI',
    slug: 'pet-portrait-ai',
    scheme: 'pet-portrait-ai',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    android: {
      package: 'com.petportrait.ai',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FF6B35',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ['CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.petportrait.ai',
      infoPlist: {
        NSPhotoLibraryUsageDescription: 'We need access to your photo library so you can upload pet photos.',
        NSPhotoLibraryAddUsageDescription: 'We need permission to save your AI portraits to your gallery.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#FF6B35',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-image-picker',
        { photosPermission: 'We need access to your photo library so you can upload pet photos.' },
      ],
      [
        'expo-media-library',
        {
          photosPermission: 'We need permission to save your AI portraits to your gallery.',
          savePhotosPermission: 'We need permission to save your AI portraits to your gallery.',
        },
      ],
    ],
    extra: {
      arkApiKey: ARK_API_KEY,
      eas: {
        projectId: '6d571e25-fac4-4864-9e9c-cf2d93448e98',
      },
    },
  },
};

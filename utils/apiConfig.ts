// utils/apiConfig.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getApiUrl = (): string => {
  if (__DEV__) {
    try {
      // Get the host from Expo config (works with newer Expo versions)
      const hostUri =
        Constants.expoConfig?.hostUri ||
        Constants.manifest?.debuggerHost ||
        Constants.manifest2?.extra?.expoGo?.debuggerHost;

      if (hostUri) {
        // Extract the IP address and use port 8000 (your FastAPI server port)
        const host = hostUri.split(':')[0];
        return `http://${host}:8000`; // Using port 8000 based on your FastAPI setup
      }
    } catch (error) {
      console.warn('Error getting debugger host:', error);
    }

    // Fallbacks for different platforms
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000'; // Special IP for Android emulator
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:8000'; // For iOS simulator
    }
  }

  // Default to localhost for web or if other methods fail
  return 'http://localhost:8000';
};

export const API_URL = getApiUrl();

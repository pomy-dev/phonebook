import NetInfo from '@react-native-community/netinfo';

export const checkNetworkConnectivity = async () => {
  // Step 1: Check if the device is connected to a network
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    return false;
  }

  // Step 2: Check actual internet access with a timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://clients3.google.com/generate_204', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.status === 204;
  } catch (error) {
    clearTimeout(timeoutId);
    return false;
  }
};
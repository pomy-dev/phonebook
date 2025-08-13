import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

export default function CustomLoader() {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Example: Start a continuous rotation
  // You would typically trigger this based on a loading state
  rotation.value = withTiming(360, { duration: 1000, easing: Easing.linear, loop: true });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./your-loader-icon.png')} // Replace with your icon
        style={[styles.loaderIcon, animatedStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderIcon: {
    width: 50,
    height: 50,
  },
});
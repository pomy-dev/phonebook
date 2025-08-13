import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';
import { Icons } from '../utils/Icons';

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
      <Animated.View style={[styles.loaderIcon, animatedStyle]}>
        <Icons.EvilIcons name="spinner-3" size={50} color="slate" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderIcon: {
    width: 50,
    height: 50,
  },
});
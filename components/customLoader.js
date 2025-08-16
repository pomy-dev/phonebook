import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Icons } from '../utils/Icons';
import React from 'react';

export default function CustomLoader() {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1, // infinite
      false // do not reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.fullScreenContainer}>
      <Animated.View style={animatedStyle}>
        <Icons.EvilIcons name="spinner" size={50} color="#003366" />
      </Animated.View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  }
});
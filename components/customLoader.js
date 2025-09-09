import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Icons } from '../constants/Icons';
import { AppContext } from '../context/appContext';
import React from 'react';
import { LoaderKitView } from 'react-native-loader-kit';

export default function CustomLoader() {
  const { theme, selectedState, isDarkMode } = React.useContext(AppContext);
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
      <LoaderKitView
        style={{ width: 50, height: 50 }}
        name="BallSpinFadeLoader"
        color={theme.colors.indicator}
        animationSpeedMultiplier={1.0}
      />
      {/* <Animated.View style={animatedStyle}> */}
      {/* <Icons.EvilIcons name="spinner" size={50} color={theme.colors.indicator} /> */}
      {/* </Animated.View> */}
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
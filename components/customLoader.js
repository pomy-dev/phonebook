import { View, StyleSheet, Dimensions } from 'react-native';
import { AppContext } from '../context/appContext';
import React from 'react';
import { LoaderKitView } from 'react-native-loader-kit';

export default function CustomLoader() {
  const { theme } = React.useContext(AppContext);

  return (
    <View style={styles.fullScreenContainer}>
      <LoaderKitView
        style={{ width: 50, height: 50 }}
        name="BallSpinFadeLoader"
        color={theme.colors.indicator}
        animationSpeedMultiplier={1.0}
      />
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
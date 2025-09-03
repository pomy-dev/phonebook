import Toast from "react-native-toast-message"

export const CustomToast = (title1, title2) => {
  Toast.show({
    type: 'success',
    text1: title1,
    text2: title2,
    position: 'bottom',
    visibilityTime: 5000,
    autoHide: true,
    bottomOffset: 60,
  });
}
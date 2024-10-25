import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LoadingModal = ({ visible, text }) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      {visible && <View style={styles.containerBaackground}>
        <Image
          source={require("../../assets/pngs/cat.gif")}
          style={styles.loaderImageStyle}
        />
        {text && <Text style={styles.loadingText}>{text}</Text>}</View>}
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  containerBaackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0, //insets.top
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  loaderImageStyle: {
    resizeMode: "contain",
  },
  activityIndicatorWrapper: {
    // backgroundColor: "#FFFFFF",
    height: hp("15%"),
    width: wp("50%"),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  loadingText: {
    //marginTop: hp('2%'),
    fontSize: fonts.fontNormal,
  },
});

export default LoadingModal;

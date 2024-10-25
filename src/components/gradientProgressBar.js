import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Dimensions } from "react-native";

function getProgressWidth(width) {
  let deviceWidth = Dimensions.get("window").width;
  let padingWidth = wp("5%");
  return (width / 100) * (deviceWidth - 2 * padingWidth);
}
const GradientProgressBar = ({ progress, colors }) => {
  if (progress > 100) {
    progress = 100;
  }
  let dynamicValue = getProgressWidth(progress);
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { width: dynamicValue, height: hp("2%") }]}
    ></LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 25,
    borderRadius: 25,
    overflow: "hidden",
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: "red",
  },
  gradient: {
    // marginLeft: wp("5%"),
    // marginRight: wp("15%"),
    borderRadius: 25,
    // width: getWidthVal()
  },
  progress: {
    height: "100%",
    backgroundColor: "transparent",
  },
});

export default GradientProgressBar;

import React from "react";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";
import Colors from "./color";

const CommonStyles = StyleSheet.create({
  mainComponentStyle: {
    flex: 1,
    backgroundColor: "#b3effb",
    borderRadius: 10,
  },

  textInputStyle: {
    flex: 1,
    color: "black",
    height: hp("8%"),
    paddingLeft: wp("5%"),
    fontSize: fonts.fontMedium,
    fontFamily: "Lexend-Regular",
  },

  textInputStyleBig: {
    flex: 1,
    color: "black",
    height: hp("30%"),
    fontSize: fonts.fontNormal,
    fontFamily: "Lexend-Regular",
    backgroundColor: "white",
    marginLeft: wp("3%"),
  },
  textInputStyleBigNotes: {
    flex: 1,
    color: "black",
    height: hp("20%"),
    fontSize: fonts.fontNormal,
    paddingBottom: hp("6%"),
    fontFamily: "Lexend-Regular",
    backgroundColor: "white",
    marginLeft: wp("3%"),
  },
  textInputStyleSmall: {
    flex: 1,
    height: hp("4%"),
    fontSize: fonts.fontTiny,
    width: wp("5%"),
    borderRadius: 10,
    backgroundColor: "white",
    fontFamily: "Lexend-Regular",
  },
  textInputStyleOrangeSmall: {
    flex: 1,
    height: hp("4%"),
    fontSize: fonts.fontTiny,
    width: wp("5%"),
    borderRadius: 10,
    backgroundColor: "white",
    fontFamily: "Lexend-Regular",
    borderColor: "#FF6F0C",
    borderWidth: 1,
  },

  textInputContainerStyle: {
    flexDirection: "row",
    width: wp("80%"),
    height: hp("8%"),
    borderWidth: 1,
    marginTop: hp("2%"),
    borderColor: "#dedede",
    backgroundColor: "white",
    marginRight: "auto",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },

  textInputContainerStyleBig: {
    flexDirection: "row",
    width: wp("85%"),
    height: hp("20%"),
    borderWidth: 1,
    borderColor: "#FFF",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  textInputContainerStyleBigWithColor: {
    flexDirection: "row",
    width: wp("85%"),
    height: hp("20%"),
    borderWidth: 1,
    borderColor: "#FF6F0C",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: hp("2%"),
  },

  textInputContainerStyleSmall: {
    flexDirection: "row",
    width: wp("40%"),
    height: hp("1%"),
    marginBottom: hp("2%"),
    marginTop: wp("3%"),
    borderColor: "#dedede",
    alignItems: "center",
    justifyContent: "center",
  },
  textInputContainerStatusStyleSmall: {
    flexDirection: "row",
    width: wp("40%"),
    height: hp("1%"),
    marginBottom: hp("1%"),
    marginTop: wp("1%"),
    borderColor: "#dedede",
    alignItems: "center",
    justifyContent: "center",
  },

  customPopUpStyle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  customPopUpGlobalStyle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  headerTextStyle: {
    fontSize: fonts.fontXLarge,
    fontFamily: "Lexend-Regular",
    color: "black",
  },

  headerTextStyle1: {
    fontSize: fonts.fontXLarge,
    fontFamily: "Lexend-Medium",
    color: "black",
  },

  headerTextStyleBold: {
    fontSize: fonts.fontXLarge,
    fontFamily: "Lexend-SemiBold",
    color: "black",
  },

  subHeaderTextStyle: {
    fontSize: fonts.fontXMedium,
    fontFamily: "Lexend-Bold",
    color: "black",
    opacity: 0.7,
  },

  buttonSubTextStyle: {
    fontSize: fonts.fontNormal,
    fontFamily: "Lexend-Regular",
    color: "black",
  },

  textStyleSemiBold: {
    fontFamily: "Lexend-SemiBold",
  },

  textStyleRegular: {
    fontFamily: "Lexend-Regular",
  },
  textPressedStyle: {
    fontFamily: "Lexend-Regular",
    color: Colors.TEXT_PRESS,
  },
  textStyleBold: {
    fontFamily: "Lexend-Bold",
  },

  textStyleExtraBold: {
    fontFamily: "Lexend-ExtraBold",
  },

  textStyleMedium: {
    fontFamily: "Lexend-Medium",
  },

  textStyleBlack: {
    fontFamily: "Lexend-Black",
  },

  textStyleThin: {
    fontFamily: "Lexend-Thin",
  },

  textStyleLight: {
    fontFamily: "Lexend-Light",
    color: "black",
  },

  hideOpenIconStyle: {
    width: wp("6%"),
    height: hp("6%"),
    resizeMode: "contain",
    marginRight: wp("2%"),
    tintColor: Colors.GRAY,
    marginEnd: 15,
  },

  authIconStyle: {
    width: wp("6%"),
    height: hp("6%"),
    resizeMode: "contain",
    marginRight: wp("2%"),
    // tintColor:'black'
  },

  spinnerStyle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  headerTextStyleLight: {
    fontFamily: "Lexend-Light",
    fontSize: fonts.fontLarge,
    color: "black",
  },

  bottomViewComponentStyle: {
    height: hp("13%"),
    width: wp("100%"),
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    shadowColor: "black",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },

  headerView: {
    backgroundColor: "white",
    width: wp("100%"),
    height: hp("12%"),
    justifyContent: "center",
  },

  petsSelViewHeaderStyle: {
    backgroundColor: "transparent",
    width: wp("100%"),
    //  minHeight:hp('12%'),
    borderRadius: 5,
    justifyContent: "center",
  },

  noRecordsTextStyle: {
    fontSize: fonts.fontLarge,
    fontFamily: "Lexend-SemiBold",
    color: "black",
    marginTop: hp("2%"),
  },

  hintTextStyle: {
    fontSize: fonts.fontTiny,
    fontFamily: "Lexend-SemiBold",
    color: "grey",
    marginTop: hp("2%"),
  },

  noRecordsTextStyle1: {
    fontSize: fonts.fontMedium,
    fontFamily: "Lexend-Regular",
    color: "black",
    marginTop: hp("1%"),
  },

  submitQSTNotAnsweredTextStyle: {
    fontSize: fonts.fontMedium,
    fontFamily: "Lexend-Regular",
    color: "red",
  },

  mediaViewTextStyle: {
    fontFamily: "Lexend-Bold",
    fontSize: fonts.fontTiny,
    color: "white",
  },

  shadowStyleDrop: {
    shadowColor: "#132533",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },

  dropDownFlatcontainer: {
    flex: 1,
  },

  dropDownTextStyle: {
    fontFamily: "Lexend-Regular",
    fontSize: fonts.fontXMedium,
    // textAlign: "left",
    color: "black",
  },

  dropDownHeaderTextStyle: {
    fontFamily: "Lexend-Regular",
    fontSize: fonts.fontXSmall,
    // textAlign: "left",
    color: "black",
  },

  shadowStyleLight: {
    shadowColor: "#132533",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },

  noRecTexStyle: {
    fontSize: fonts.fontMedium,
    fontFamily: "Lexend-SemiBold",
    color: "black",
  },

  tabViewStyle: {
    width: wp("94%"),
    height: hp("3.5%"),
    backgroundColor: "#7676801F",
    alignSelf: "center",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tabViewEnableBtnStyle: {
    width: wp("46%"),
    height: hp("3%"),
    backgroundColor: "white",
    borderRadius: 7,
    marginLeft: hp("0.2%"),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#132533",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },

  tabViewBtnStyle: {
    width: wp("46%"),
    height: hp("3.5%"),
    backgroundColor: "transparent",
    marginLeft: hp("0.2%"),
    justifyContent: "center",
    alignItems: "center",
  },

  tabBtnTextStyle: {
    fontSize: 16,
    fontFamily: "Lexend-SemiBold",
    color: "black",
  },

  shadowStyle: {
    shadowColor: "#132533",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  mainContainer: {
    flex: 1,
  },
});

export default CommonStyles;

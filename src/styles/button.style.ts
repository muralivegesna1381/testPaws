import React from "react";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";

const ButtonStyle = StyleSheet.create({
  container:{
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 35,
    height: hp("8%"),
    borderColor: "#FF6F0C",
    borderWidth: wp("0.2%"),
    
  },
  subContainerStyle: {flex: 1,  flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
  imageStyle: {
    resizeMode: 'contain'
  }
})

export default ButtonStyle;
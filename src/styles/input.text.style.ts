import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";

const InputTextStyle = StyleSheet.create({
    textInputStyle: {
      flex: 1,
      color: "black",
      height: hp("7%"),
      paddingLeft: wp("5%"),
      fontSize: fonts.fontMedium,
      fontFamily: "Lexend-Regular",
    },
  
    textInputContainerStyle: {
      flexDirection: "row",
      borderWidth: 1,
      marginTop: hp("2%"),
      borderColor: "#dedede",
      backgroundColor: "white",
      marginRight: "auto",
      alignItems: "center",
      justifyContent: "center",
      borderRadius:20,
    },
  })

  export default InputTextStyle;
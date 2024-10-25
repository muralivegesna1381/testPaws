import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts, { fontFamily } from "../fonts/fonts";
import Colors from "./color";

const BottomSheetStyle = StyleSheet.create({
  headerTextStyle: {
    fontFamily: fontFamily.semibold,
    fontSize: fonts.fontNormal,
    marginBottom: hp("1.5%"),
  },
  textInputStyle: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(200, 205, 214, 1)",
    fontSize: 14,
    lineHeight: 20,
    padding: 8,
    color: "rgba(21, 35, 52, 1)",
    marginBottom: hp("1%"),
  },
  itemTextStyle: {
    fontFamily: fontFamily.semibold,
    fontSize: fonts.fontSmall,
    flex: 1,
    marginLeft: wp("2%"),
  },
  bottomButtonContainer: {
    position: "absolute",
    flexDirection: "row",
    bottom: hp("2%"),
  },
  bottomButtonSubContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 15,
  },
  rowItemStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
    marginBottom: hp("1%"),
  },
  chipStyle: {
    height: 30,
    margin: 5,
    padding: 0,
    backgroundColor: Colors.LIGHT_GRAY,
    alignSelf: "flex-start",
  },
});

export default BottomSheetStyle;

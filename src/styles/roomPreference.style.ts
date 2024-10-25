import { Dimensions, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts, { fontFamily } from "../fonts/fonts";
import Colors from "./color";
var width = Dimensions.get("window").width;
const RoomStyles = StyleSheet.create({
  titleTextStyle: {
    fontFamily: fontFamily.semibold,
    fontSize: fonts.fontLarge,
    color: "#000000",
    paddingTop: hp("1%"),
  },
  ChipStype: {
    width: width / 3.3,
    backgroundColor: "#136DA533",
    borderColor: "#136DA54D",
    margin: 3,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  DynamicChip: {
    flex: 1,
    maxWidth: "100%", // 100% devided by the number of rows you want
    alignItems: "center",

    // my visual styles; not important for the grid
    padding: 0,
    backgroundColor: "rgba(208, 225, 236, 1.0)",
    borderWidth: 2,
    borderColor: "#136DA54D",
    margin: 5,
  },
  mainContainer: {
    marginLeft: wp("8%"),
    marginRight: wp("8%"),
    // marginTop: wp("1%"),
    marginBottom: wp("2%"),
  },
  containerDropdown: {
    justifyContent: "space-around",
    alignSelf: "stretch",
    alignItems: "flex-start",

    borderRadius: 10,
    height: hp("8%"),
    backgroundColor: Colors.DROP_DOWN_BG,
    borderColor: Colors.BORDER_COLOR,
    borderWidth: wp("0.2%"),
    flexDirection: "row",
  },
});
export default RoomStyles;

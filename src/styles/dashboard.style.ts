import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts, { fontFamily } from "../fonts/fonts";
import Colors from "./color";


const DashboardStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    textAlign: "center",
    color: "black",
    fontSize: fonts.fontMedium,
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginTop: hp("0.50%"),
    fontFamily: "Lexend-SemiBold",
  },

  textSmall: {
    color: "black",
    fontSize: fonts.fontTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1,
  },

  textSmallCollections: {
    color: "black",
    fontSize: fonts.fontTiny,
    fontFamily: "Lexend-Medium",
    flex: 1,
  },
  textSmallCollectionsAnimal: {
    color: "black",
    fontSize: fonts.fontTiny,
    //marginLeft: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 0.7,
  },
  textSmallLocation: {
    color: "black",
    fontSize: fonts.fontTiny,
    fontFamily: "Lexend-Medium",
    flex: 0.7,
  },
  textSmallLocationFMT: {
    color: "black",
    fontSize: fonts.fontTiny,
    fontFamily: "Lexend-Medium",
    flex: 0.6,
  },

  textSmallNew: {
    color: "black",
    fontSize: fonts.fontTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
  },
  textSmallFMTDate: {
    color: "black",
    fontSize: fonts.fontTiny,
    marginLeft: wp("4%"),
    //marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
  },

  textSmallTest: {
    color: "black",
    fontSize: fonts.fontTiny,
    flex: 0.5,
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
  },
  calenderStyle: {
    backgroundColor: "#F1F9E8",
    marginBottom: 10,
  },

  textTiny: {
    color: "black",
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1,
  },
  textTinyOrange: {
    color: Colors.ORANGE,
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1,
  },
  textTinyGrey: {
    color: Colors.GRAY,
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1,
  },
  textTinyACT: {
    color: "black",
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1.1,
  },
  textTinyFailedACT: {
    color: Colors.ORANGE,
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1.1,
  },
  textTinyNotPerfACT: {
    color: Colors.GRAY,
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1.1,
  },
  textTinyFMT: {
    color: "black",
    fontSize: fonts.fontTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1.3,
  },
  textTinyFMTSample: {
    color: "black",
    fontSize: fonts.fontTiny,
    // marginLeft: wp("1%"),
    marginRight: wp("5%"),
    fontFamily: "Lexend-Medium",
    flex: 0.8,
  },
  textTinyFMTDate: {
    color: "black",
    fontSize: fonts.fontTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1,
  },
  textTinyTest: {
    color: "black",
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 0.7,
  },
  textTinyNotPerTest: {
    color: Colors.GRAY,
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 0.7,
  },
  textTinyFailTest: {
    color: Colors.ORANGE,
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 0.7,
  },

  textTinyAnimalStlye: {
    color: "#136DA5",
    fontSize: fonts.fontXXTiny,
    fontFamily: "Lexend-Medium",
  },
  textTinyAnimalStlyeBlack: {
    color: "#000",
    fontSize: fonts.fontXXTiny,
    fontFamily: "Lexend-Medium",
  },
  textTinyAnimalStlyeGray: {
    color: Colors.GRAY,
    fontSize: fonts.fontXXTiny,
    fontFamily: "Lexend-Medium",
  },
  textTinyAnimalStlyeOrange: {
    color: Colors.ORANGE,
    fontSize: fonts.fontXXTiny,
    fontFamily: "Lexend-Medium",
  },
  textTinyPressableAnimalStlye: {
    flex: 1.3,
  },

  titleWithIcon: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  titleWithIconPC: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
  },
  titleWithIconACT: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp("0.5%"),
  },

  titleWithIconDate: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: hp("1%"),
  },

  buttonText: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    fontFamily: "Lexend-Medium",
    fontSize: fonts.fontTiny,
    marginLeft: wp("2%"),
    marginTop: hp("1%"),
  },

  textTinyBluePendingLocation: {
    color: "#000",
    fontSize: fonts.fontTiny,
    fontFamily: "Lexend-Medium",
    flex: 0.7,
  },
  textTinyBlueLocation: {
    color: "#136DA5",
    fontSize: fonts.fontXXTiny,
    fontFamily: "Lexend-Medium",
    //flex: 0.8,
  },
  textTinyBlackLocation: {
    color: "#000",
    fontSize: fonts.fontXXTiny,
    fontFamily: "Lexend-Medium",
    //flex: 0.8,
  },
  textTinyOrangeLocation: {
    color: Colors.ORANGE,
    fontSize: fonts.fontXXTiny,
    fontFamily: "Lexend-Medium",
    //flex: 0.8,
  },
  textTinyGreyLocation: {
    color: Colors.GRAY,
    fontSize: fonts.fontXXTiny,
    fontFamily: "Lexend-Medium",
    //flex: 0.8,
  },
   textTinyBlueLocationPressable: {
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    flex: 0.8,
  },
  textTinyLocationFMT: {
    color: "#000",
    fontSize: fonts.fontXXXTiny,
    fontFamily: "Lexend-Medium",
    flex: 0.7,
  },
  textTinyRed: {
    color: "red",
    fontSize: fonts.fontXXTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1,
  },
  textTinyFMTRed: {
    color: "red",
    fontSize: fonts.fontTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: "Lexend-Medium",
    flex: 1,
  },

  textStyleFilters: {
    color: "black",
    fontSize: fonts.fontTiny,
    marginRight: wp("1%"),
    textAlign:"center",
    fontFamily: "Lexend-Medium",
    flex: 1,
  },

  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#565867",
    paddingVertical: 10,
  },
  rowItemBG: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "rgba(254, 254, 254, 0.6)",
  },
  textLarge: {
    color: "black",
    fontSize: fonts.fontMedium,
    justifyContent: "space-between",
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginTop: hp("0.75%"),
    fontFamily: "Lexend-Regular",
    fontWeight: "500",
  },
  textLargeCenter: {
    color: "black",
    fontSize: fonts.fontXSmall,
    marginTop: hp("0.75%"),
    fontFamily: "Lexend-Regular",
    fontWeight: "700",
    textAlign: "center",
  },
  textWhite: {
    textAlign: "center",
    color: "white",
    fontSize: fonts.fontMedium,
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginTop: hp("0.50%"),
    fontFamily: "Lexend-SemiBold",
  },
  textWhiteSmall: {
    textAlign:"left",
    color: "white",
    fontSize: fonts.fontSmall,
    marginLeft: wp("1%"),
    marginRight: wp("2%"),
    fontFamily: fontFamily.semibold,
  },

  centerView: {
    justifyContent: "space-around",
    flexDirection: "row",
     marginLeft: wp("3%"),
    marginRight: wp("3%"),
  },
  container: {
    //flex: 1,
    marginTop: hp("1%"),
    paddingHorizontal: wp("2%"),
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    borderRadius: 10,
    minHeight: hp("8%"),
    justifyContent: "center",
  },
  innerview: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerviewExpanded: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("1%"),
  },
  innerFlatList: {
    borderWidth: 0.1,
    borderColor: "#000",
    marginBottom: hp("2%"),
  },
  buttonDeselected: {
    backgroundColor: "#D9D9D9",
    width: wp("43%"),
    height: hp("3.5%"),
    borderRadius: 5,
    marginHorizontal:wp("2%"),
    marginVertical:hp("2%")
  },

  buttonSelected: {
    backgroundColor: "#136DA3",
    width: wp("43%"),
    height: hp("3.5%"),
    borderRadius: 5,
      marginHorizontal:wp("2%"),
     marginVertical:hp("2%")
  },
  countContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#136DA5",
    height: hp("4%"),
    right: 12,
    position: "absolute",
  },
  arrowStyle: {
    marginTop: hp("1.5%"),
    marginLeft: wp("2%"),
  },
  arrowStyleRight: {
    marginRight: wp("3%"),
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: wp("15%"),
    backgroundColor: "#FFF",
    height: hp("3%"),
    borderRadius: 8,
    marginRight: wp("3%"),
    marginBottom: wp("2%"),
  },

  filterContainerGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: wp("18%"),
    //backgroundColor: "#EAF8F7",
    height: hp("4%"),
    borderRadius: 10,
    marginLeft: wp("3%"),
    marginBottom: wp("2%"),
  },
  expandImageStyle: {
    position: "absolute",
    right: -2,
    bottom: -25,
    padding: 10,
    marginBottom: hp("2%"),
  },

  xImageStyle: {
    alignSelf: "flex-end",
    marginRight: hp("2%"),
    padding: 8,
    marginTop: 10,
  },
  closeButtonCalender: {
    fontFamily: fontFamily.regular,
    fontSize:fonts.fontNormal,
    justifyContent:"center",
    alignSelf:"center"
  },
  calenderDateText: {
    fontFamily: fontFamily.regular,
    // marginRight: wp("2%"),
    // marginBottom: hp("2%"),
    // marginTop: hp("2%"),
  },
  calenderContainer: {
    // position: "absolute",
    // alignSelf: "center",
    // marginTop: hp("20%"),
    backgroundColor: "#F1F9E8",
    borderColor: "#000",

  },

  collapsedContainerHeight: {
    height: hp("15%"),
  },
  expandedContainerHeightACT: {
    height: hp("44%"),
  },
  expandedContainerHeightPending: {
    height: hp("39%"),
  },
  expandedContainerHeightFMT: {
    height: hp("31%"),
  },
});

export default DashboardStyles;

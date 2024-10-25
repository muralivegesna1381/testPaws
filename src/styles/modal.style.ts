import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts, {fontFamily} from "../fonts/fonts";



const ModelStyle = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      minWidth: wp('65%'),
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      borderWidth: wp("0.2%"),
      borderColor: '#398FC5',
      padding: 35,
      paddingTop: 10,
      alignItems: 'center',
    },
    titleTextStyle: {
      fontFamily: fontFamily.semibold,
      fontSize: fonts.fontLarge,
      color: "#000000",
      paddingTop: hp('1%')
    },
    subTitleTextStyle: {
      fontFamily: fontFamily.light,
      fontSize: fonts.fontXSmall,
      color: "#000000",
      paddingBottom: hp('1%')
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

  export default ModelStyle;
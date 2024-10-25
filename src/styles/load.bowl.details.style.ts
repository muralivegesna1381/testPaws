import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts, { fontFamily } from "../fonts/fonts";
import Colors from "./color";
import CommonStyles from "./commonstyles";

const loadBowlDetailstyles = StyleSheet.create({

    searchTextStyle: {
        backgroundColor: '#FFFFFF',
        margin: 10,
        borderRadius: 6,
        flexDirection: 'row',
        borderColor: '#242E4226',
        borderWidth: 1,
    },
    SearchUI: {
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        flex: 1,
    },
    SearchImage: {
        height: 40,
        width: 40,
        // borderRadius: 6,
        borderBottomRightRadius: 6,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    searchContainerStyle: {
        height: 40,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        // fontWeight: '400',
        fontSize: 18,
        fontFamily: "Lexend-Regular",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bowl: {
        height: 36,
        backgroundColor: '#FFFFFF',
        margin: 10,
        borderRadius: 6,
        flexDirection: 'row',
    },
    barcode: {
        height: 36,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        flex: 1,
    },

    bowlImage: {
        height: 36,
        width: 36,
        backgroundColor: '#C3CFD6',
        borderRadius: 6
    },
    scan: {
        height: 36,
        width: 36,
        backgroundColor: '#C3CFD6',
        borderRadius: 6
    },
    feeder: {
        height: 36,
        backgroundColor: '#FFFFFF',
        margin: 10,
        borderRadius: 6,
        flexDirection: 'row'
    },
    bowlItemUI: {
        alignItems: "flex-start",
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 15,
        borderRadius: 11,
        width: wp('90%'),
        alignSelf: 'center'
    },
    bowlItem: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
        alignContent: 'space-between',
        flexWrap: 'wrap',
    },
    camera: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 300,
        height: 250
    },
    bottomOverlay: {
        position: "absolute",

        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        alignItems: 'center',
    },
    scanText: {
        fontSize: 18,
        color: 'white',
    },
    input: {
        height: 36,
        padding: 10,
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    },
    submitButton: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#136DA5",
        // padding: 10,
        borderRadius: 35,
        width: wp('35%'),
        height: hp("5.2%"),
        marginTop: hp('2%')
    },
    bowlTextStyle: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 10,
    },
    bowlTextStyleLabel: {
        color: '#000000',
        fontSize: fonts.fontXSmall,
        ...CommonStyles.textStyleSemiBold,
        textAlign: 'left',
        width: 150,
    },
    bowlTextStyleValue: {
        // color: '#000000',
        fontSize: fonts.fontXSmall,
        // ...CommonStyles.textStyleRegular,
        fontWeight: '400',
        textAlign: 'right',
        flex: 1,
    },
    titleStyle: {
        color: "black",
        fontSize: 20,
        ...CommonStyles.textStyleBold,
        textAlign: "center",
        marginLeft: 45,
        fontWeight: '700',
    },
    bottomButton: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#136DA5",
        padding: 10,
        borderRadius: 35,
        minWidth: wp('80%'),
        height: hp("6%"),
        marginTop: hp('5%')
    },

    submitBtnTxtStyle: {
        fontSize: fonts.fontXMedium,
        ...CommonStyles.textStyleSemiBold,
        color: 'white'
    }
});

export default loadBowlDetailstyles;
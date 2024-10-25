import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";
import CommonStyles from "./../styles/commonstyles";
import ErrorAlert from "./../../assets/svgs/error_alert.svg";
import SuccessAlert from "./../../assets/svgs/SuccessAlert.svg";

// Usage
/*
  <AlertComponent
                    header={'Alert'}
                    subHeader={'test'}
                    message={"Bowl Location Mismatch. \n Please ensure the scanned bowl matches the selected location"}
                    // subMessage={"messagee"}
                    isLeftBtnEnable={true}
                    isRightBtnEnable={true}
                    leftBtnTilte={'NO'}
                    rightBtnTilte={'YES'}
                    popUpLeftBtnAction={() => popOkBtnAction()}
                    popUpRightBtnAction={() => popOkBtnAction()}
                />
*/

export enum AlertType {
    Success,
    Error
}

const AlertComponent = ({
    ...props
}) => {


    const popUpLeftBtnAction = () => {
        props.popUpLeftBtnAction();
    }

    const popUpRightBtnAction = () => {
        props.popUpRightBtnAction(false);
    }

    return (
        <View style={styles.componentStyle}>
            <View style={styles.popUpViewStyle}>
                <ScrollView showsHorizontalScrollIndicator={false} scrollEnabled={false} alwaysBounceHorizontal={false} style={{ width: wp('85%') }}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ height: 10 }}></View>
                        {/* <Text style={styles.headerTextStyle}>{props.header}</Text>
                        <Text style={styles.subHeaderTextStyle}>{props.subHeader}</Text> */}
                        <View style={{ height: 20 }}></View>


                        {
                            props.type == 'success' ? <SuccessAlert /> :
                                <ErrorAlert />
                        }


                        {/* {
                            props.type == 'success' ? <View style={{}}> <ErrorAlert />  </View> :
                                <View style={{}}> <SuccessAlert />  </View>
                        } */}
                        <View style={{ height: 20 }}></View>

                        <View style={{}}>
                            <Text style={styles.messageTextStyle}>{props.message}</Text>
                            <Text style={styles.subHeaderTextStyle}>{props.subMessage}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ height: 10 }}></View>
                <View style={[styles.btnsViewStyle]}>
                    {props.isLeftBtnEnable ? <TouchableOpacity testID="alertLeftButton" onPress={() => popUpLeftBtnAction()} style={props.isLeftBtnEnable && props.isRightBtnEnable ? [styles.btnLeftStyle] : [styles.singleBtnStyle]}>
                        <Text style={styles.leftBtnTextColor}>{props.leftBtnTilte}</Text>
                    </TouchableOpacity> : null}

                    {props.isRightBtnEnable ? <TouchableOpacity testID="alertRightButton" onPress={() => popUpRightBtnAction()} style={props.isLeftBtnEnable && props.isRightBtnEnable ? [styles.btnRightStyle] : [styles.singleBtnStyle]}>
                        <Text style={styles.rightBtnTextColor}>{props.rightBtnTilte}</Text>
                    </TouchableOpacity> : null}

                </View>
            </View>

        </View>

    );
};

export default AlertComponent;

const styles = StyleSheet.create({
    componentStyle: {
        width: wp('100%'),
        height: hp('100%'),
        justifyContent: "center",
        alignItems: "center",
    },
    popUpViewStyle: {
        width: wp('85%'),
        minHeight: hp('20%'),
        backgroundColor: 'white',
        borderColor: '#398FC5',
        borderRadius: 32,
        borderWidth: 2,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        justifyContent: 'center',
        alignItems: "center",
    },
    btnRightStyle: {
        flex: 1,
        height: wp('10%'),
        backgroundColor: '#FF6F0C33',
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 20,
        marginRight: wp('5%'),
        marginLeft: wp('2%'),
        borderColor: '#CF8E61',
        borderWidth: 0.5
    },
    btnLeftStyle: {
        flex: 1,
        height: wp('10%'),
        backgroundColor: '#5D708C33',
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 20,
        marginRight: wp('2%'),
        marginLeft: wp('5%'),
    },
    singleBtnStyle: {
        width: wp('40%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: '#5D708C33',
    },
    btnsViewStyle: {
        width: wp('80%'),
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: wp('4%'),
        marginBottom: wp('5%'),
        alignItems: 'center',
        color: '#5D708C33',
    },
    rightBtnTextColor: {
        fontSize: fonts.fontMedium,
        ...CommonStyles.textStyleBold,
        color: '#000000',
    },
    leftBtnTextColor: {
        fontSize: fonts.fontMedium,
        ...CommonStyles.textStyleBold,
        color: '#000000',
    },
    headerTextStyle: {
        color: "black",
        fontSize: 20,
        ...CommonStyles.textStyleBold,
        textAlign: "center",
        fontWeight: '700',
    },
    messageTextStyle: {
        color: "black",
        fontSize: 18,
        ...CommonStyles.textStyleBold,
        textAlign: "center",
        fontWeight: '500',
    },
    subHeaderTextStyle: {
        color: "black",
        fontSize: fonts.fontMedium,
        ...CommonStyles.textStyleBold,
        textAlign: "center",
        fontWeight: '300',
    },
});

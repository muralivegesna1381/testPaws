import { View, StyleSheet, TouchableOpacity, Text, ImageBackground, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoadBowlStackParamList } from "../../navigation/types";
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import BarcodeScan from "./../../../assets/svgs/barcode-scan.svg";
import LoadbowlScan from "./../../../assets/svgs/load_bowl_image.svg";
import NetworkManager from '../../network/network.manager';
import React, { useState, useEffect } from 'react';
import CommonStyles from "./../../styles/commonstyles";
import AppHeaderComponent from "../../components/appHeaderComponent";
import { enableScreens } from "react-native-screens";
import fonts from "../../fonts/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

type loadbowlScreenProps = NativeStackScreenProps<
    LoadBowlStackParamList,
    "Home"
>

const LoadBowlHomeScreen = (props: loadbowlScreenProps) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        firebaseHelper.reportScreen(firebaseHelper.Screen_Loadbowl_Home);
    }, [])


    const onPressScanBowl = () => {
        console.log("onPressScanBowl");
        firebaseHelper.logEvent(firebaseHelper.Event_Scanbowl_Button_Home, firebaseHelper.Screen_Loadbowl_Home, "");
        navigation.navigate('LoadBowlDetailsScreen', {
            selectionType: "scanbowl"
        });
    };

    const onPressLoadBowl = () => {
        console.log("onPressLoadBowl-------");
        firebaseHelper.logEvent(firebaseHelper.Event_Loadbowl_Button_Home, firebaseHelper.Screen_Loadbowl_Home, "");
        // if (Platform.OS === "ios") {
        //     enableScreens(false);
        // }
        navigation.navigate('LoadBowlDetailsScreen', {
            selectionType: "loadbowl"
        });
    };

    const backBtnAction = () => {
        console.log('Header Back Button Pressed');
    }

    return (
        <SafeAreaView style={[styles.mainContainer, { paddingTop: insets.top }]}>
            <AppHeaderComponent
                headerTitle='ATMS Load Bowl'
                isShowBackButton={false}
                isShowGridListButton={false}
                isShowNotificationButton={false}
                isShowNotesButton={false}
                notificationsAvailble={false}
                backBtnAction={backBtnAction}
            ></AppHeaderComponent>

            <View style={styles.middleBackViewStyle}>

                <View style={{ height: hp('50%'), justifyContent: 'space-between' }}>

                    <TouchableOpacity onPress={() => { onPressScanBowl(); }}>
                        <View style={styles.bowl}>
                            <BarcodeScan></BarcodeScan>
                            {/* <ImageBackground source={require("./../../../assets/svgs/load_bowl_image.svg")} borderRadius={10} tintColor={'black'} resizeMode='contain' style={{ width: wp('27%'), aspectRatio: 1, borderWidth: 2, borderColor: '#136DA5', backgroundColor: 'red' }}></ImageBackground> */}
                            <Text style={[styles.bowlText, { marginTop: hp('0.5%'), }]}>{"Scan Bowl"}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { onPressLoadBowl(); }}>
                        <View style={styles.bowl}>
                            <LoadbowlScan />
                            {/* <ImageBackground source={require("./../../../assets/svgs/barcode-scan.svg")} borderRadius={10} tintColor={'black'} resizeMode='contain' style={{ width: wp('27%'), aspectRatio: 1, borderWidth: 2, borderColor: '#136DA5' }}></ImageBackground> */}
                            <Text style={styles.bowlText}>{"Load Bowl"}</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>

        </SafeAreaView>
    );
};

//Styles used in this screen are defined here
const styles = StyleSheet.create({

    headerSelectionView: {
        flexDirection: "row",
        alignItems: "center",
    },
    mainContainer: {
        backgroundColor: "white",
        flex: 1
    },
    bowl: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bowlText: {
        fontSize: fonts.fontXXXXLarge,
        ...CommonStyles.textStyleSemiBold,
        // marginTop: hp('1%'),
        color: '#136DA5',
    },
    titleStyle: {
        color: "black",
        fontSize: 20,
        ...CommonStyles.textStyleBold,
        textAlign: "center",
        marginLeft: 45,
        fontWeight: '700',
    },

    middleBackViewStyle: {
        justifyContent: 'center',
        height: hp('75%'),
        alignSelf: 'center'
    },

});

export default LoadBowlHomeScreen;

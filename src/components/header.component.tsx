import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CommonStyles from "./../styles/commonstyles";
import NetworkIcon from "./../../assets/svgs/network_icon.svg";
import NetInfo from '@react-native-community/netinfo';
import Utils from "../utils";
import { useFocusEffect } from "@react-navigation/native";

const CommonHeaderComponent = ({
    ...props
}) => {
    const { navigation } = props;
    const [isConnected, setIsConnected] = useState(true);
    const [showOnlineMessage, setShowOnlineMessage] = useState(false);
    const isPreviousNetState = useRef(true);

    useEffect(() => {
        // Subscribe to network status updates
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                if (isPreviousNetState.current == false) {
                    setShowOnlineMessage(true);
                }
                isPreviousNetState.current = true
                setIsConnected(true);

                // Hide the "Back to online" message after 5 seconds
                setTimeout(() => {
                    setShowOnlineMessage(false);
                }, 6000);
            } else {
                isPreviousNetState.current = false
                setIsConnected(false);
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            scduleSyncData();
        }, [navigation])
    );
    async function scduleSyncData() {
        let userID = await Utils.getData("UserId");
        NetInfo.fetch().then(async (internet) => {
            let count = await Utils.getAllOfflienACTRecords(userID ?? "0");
            if (count?.length > 0 && internet?.isInternetReachable) {
                Utils.synchACTData(userID ?? "0");
            } 
        });
    }
    const backBtnAction = () => {
        props.backBtnAction();
    };
    const rightButtonAction = () => {
        props.rightButtonAction();
    };


    return (
        <View
            style={{
                backgroundColor: props.headerColor == undefined ? 'transparent' : props.headerColor,
                marginBottom: hp("2%"),
            }}
        >
            <View style={{ alignItems: 'center', flexDirection: "row" }}>
                {props.isShowBackButton == true ? <TouchableOpacity onPress={() => backBtnAction()}>
                    <View style={{
                        padding: wp("3%"),
                    }}>
                        <Image
                            source={require("./../../assets/pngs/arrow_left_black.png")}
                            style={{
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                </TouchableOpacity> : <View style={{
                    padding: wp("3%"),

                }}></View>}

                <View style={[styles.headerSelectionView]}>
                    <Text style={[styles.titleStyle]}>{props.headerTitle}</Text>
                </View>
                {props.isShowRightButton == true ? <TouchableOpacity onPress={() => rightButtonAction()}>
                    {props.rightButtonImage}
                </TouchableOpacity> : <View style={{

                    marginLeft: wp("2%"),
                    marginRight: wp("5%"),
                    marginTop: hp("1%"),


                }}></View>}

            </View>
            {isConnected == false ? <View style={{ width: wp('100%'), height: 26, backgroundColor: 'red', flexDirection: "row", alignItems: 'center', justifyContent: 'center', }}>
                <View style={{ marginLeft: 10 }}>
                    <NetworkIcon />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Offline Mode</Text>
                </View>
            </View > : showOnlineMessage ? (
                <View style={{ width: wp('100%'), height: 26, backgroundColor: 'green', flexDirection: "row", alignItems: 'center', justifyContent: 'center', }}>
                    <View style={{ marginLeft: 10 }}>

                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                        <Text style={{ color: 'white', textAlign: 'center' }}>Back Online!</Text>
                    </View>
                </View >
            ) : null}
        </View >
    );
};

export default CommonHeaderComponent;

const styles = StyleSheet.create({

    headerSelectionView: {
        flex: 1,
        minHeight: hp("4%"),
        flexDirection: "row",
        alignItems: "center",

    },
    titleStyle: {
        color: "black",
        fontSize: 20,
        ...CommonStyles.textStyleBold,
        textAlign: "center",
        fontWeight: '700',
    },
});

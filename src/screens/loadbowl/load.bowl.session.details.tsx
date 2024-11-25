import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoadBowlStackParamList } from "../../navigation/types";

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import BarcodeScan from "./../../../assets/svgs/barcode-scan.svg";
import LoadbowlScan from "./../../../assets/svgs/barcode-scan.svg";
import LoadBowlAPIManager from '../../network/load.bowl.api.manager';
import React, { useState, useEffect } from 'react';
import CommonStyles from "./../../styles/commonstyles";
import HeaderComponent from "../../components/headerComponent";
import LinearGradient from "react-native-linear-gradient";
import { MD2Colors } from "react-native-paper";
import LoadingModal from "../../components/loadingModel";
import fonts from "../../fonts/fonts";
import AppHeaderComponent from "../../components/appHeaderComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

let scanbowl = require('./../../../assets/pngs/barcode-scan.png');
let loadbowl = require('./../../../assets/pngs/loadbowl-scan.png');


type SessionDetailObject = {
    ANIMAL_TATTOO: string;
    CONTAINER_ID: number;
    CAGE_SLOT: string;
    OFFERED_FEEDING: number;
    STATUS: string;

};

type loadBowlSessionDetailsScreenProps = NativeStackScreenProps<
    LoadBowlStackParamList,
    "LoadBowlSessionDetails"
>

const LoadBowlSessionDetailScreen = (props: loadBowlSessionDetailsScreenProps) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();

    const onPressBackButton = () => {
        navigation.navigate('LoadBowlDetailsScreen', {
            selectionType: "scanbowl"
        });
    };
    const [isLoading, set_isLoading] = useState(false);
    const { sessionObject, } = props.route.params;
    const [sessionDetailsList, setSessionDetailsList] = useState<SessionDetailObject>();

    useEffect(() => {
        firebaseHelper.reportScreen(firebaseHelper.Screen_Loadbowl_SessionDetails);
        getBowlSessions();
    }, []);

    async function getBowlSessions() {
        try {
            // set_isLoading(true);
            let sessionDetails = await LoadBowlAPIManager.getfeedingAnimalSessions(sessionObject.FEEDING_SESSION_ID);
            // set_isLoading(false);
            if (sessionDetails.result && sessionDetails.result.FeedingAnimalSessions && sessionDetails.result.FeedingAnimalSessions.length) {
                let dataList: SessionDetailObject = sessionDetails.result.FeedingAnimalSessions;
                setSessionDetailsList(dataList);
            } else {

            }

        } catch (e) {
            set_isLoading(false);
        } finally {
            set_isLoading(false);
        }
    }
    const backBtnAction = () => {
        navigation.pop();
    }

    function LoadBowlSessionDetailsUI() {
        return (
            <View style={styles.loadBowlStyle}>
                <LinearGradient colors={['#FFEEDD', '#F9D1AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                    <View style={styles.loadBowlViewStyle}>
                        <Text style={{
                            flex: 1,
                            margin: 5,
                            color: '#1E1E1E',
                            fontSize: fonts.fontNormal,
                            ...CommonStyles.textStyleBold,
                        }}>
                            {sessionObject.LOCATION}
                        </Text>
                        {/*  <View style={styles.SearchImage}>
                             <SearchIcon />
                        </View>*/}
                    </View>
                </LinearGradient>
            </View>
        );
    }

    const ListItem = ({ sessionObject }: SessionDetailObject) => (
        <View>
            <View style={styles.listRow}>
                <Text style={[styles.listCell, { paddingRight: 10, paddingLeft: 2 }]}>{sessionObject.ANIMAL_TATTOO}</Text>
                <Text style={[styles.listCell, { paddingRight: 10, paddingLeft: 2 }]}>{sessionObject.CONTAINER_ID}</Text>
                <Text style={[styles.listCell, { paddingRight: 10, paddingLeft: 2 }]}>{sessionObject.CAGE_SLOT}</Text>
                <Text style={[styles.listCell, { paddingRight: 10, paddingLeft: 2 }]}>{sessionObject.OFFERED_FEEDING}</Text>
                <Text style={[styles.listCell, { flex: 0.6, textAlign: 'justify' }]}>{sessionObject.STATUS}</Text>
            </View>
        </View >
    );
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top, }}>
            <View >
                {/* <HeaderComponent
                    navigation={undefined}
                    route={undefined}
                    moduleName={"Session Details"}
                    headerColor={"#FFF"}
                    backBtnAction={backBtnAction}
                /> */}

                <AppHeaderComponent
                    headerTitle="Session Details"
                    isShowBackButton={true}
                    isShowGridListButton={false}
                    isShowNotificationButton={false}
                    isShowNotesButton={false}
                    notificationsAvailble={false}
                    backBtnAction={backBtnAction} moduleName={undefined} headerColor={undefined}
                ></AppHeaderComponent>

                <View style={{ height: 15 }}></View>
                <LoadBowlSessionDetailsUI></LoadBowlSessionDetailsUI>

                <View style={styles.headerViewStyle}>
                    <View style={{ backgroundColor: '#f4fbf6' }}>
                        <View style={styles.listHeader}>
                            <Text style={[styles.listHeading, { paddingLeft: 10 }]}>Animal Name</Text>
                            <Text style={[styles.listHeading]}>Container</Text>
                            <Text style={[styles.listHeading]}>Cage Slot</Text>
                            <Text style={[styles.listHeading]}>Offered Feeding</Text>
                            <Text style={[styles.listHeading, { flex: 0.5, textAlign: 'right' }]}>Status</Text>
                        </View>
                    </View >
                    <LinearGradient style={{ borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }} colors={['#EDF9EA', '#A5E1EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>

                        <FlatList
                            data={sessionDetailsList}
                            renderItem={({ item }) => (
                                <ListItem
                                    sessionObject={item}
                                />
                            )}
                            keyExtractor={(item) => item.CAGE_SLOT.toString()}
                        />
                    </LinearGradient >
                </View >
            </View>

            {/* {isLoading && (
                <View
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,

                        bottom: 0,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <LoadingModal visible={isLoading} text="Loading..." />
                </View>
            )} */}
        </View>
    );
};

//Styles used in this screen are defined here
const styles = StyleSheet.create({

    headerSelectionView: {
        flex: 1,
        minHeight: hp("4%"),
        flexDirection: "row",
        alignItems: "center",
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    bowl: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20%',
    },
    bowlText: {
        color: '#136DA5',
        fontSize: 34,
        fontWeight: '700',
    },
    titleStyle: {
        color: "black",
        fontSize: 20,
        ...CommonStyles.textStyleBold,
        textAlign: "center",
        marginLeft: 45,
        fontWeight: '700',
    },
    loadBowlStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderColor: '#242E4226',
        borderWidth: 1,
        marginTop: hp('-1.5%')
    },
    loadBowlViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        margin: 5,
        height: hp('6%')
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // padding: 10,
        alignItems: 'center',
        marginTop: hp('1.5%'),
        height: hp('3.5%'),
        borderWidth: 1,
        borderColor: '#FEFEFE',
        backgroundColor: 'rgba(243, 250, 247, 1.0)',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15

    },
    listHeading: {
        fontSize: fonts.fontXXTiny,
        ...CommonStyles.textStyleRegular,
        flex: 1,
        paddingRight: 10,
        paddingLeft: 2
    },
    listRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // elevation: 1,
        borderColor: '#565867',
        borderBottomWidth: 1,
        padding: 10,
        borderRadius: 15,
        alignItems: 'center'
    },
    listCell: {
        fontSize: fonts.fontXXTiny,
        ...CommonStyles.textStyleRegular,
        flex: 1,

        // textAlign: 'left'
    },
    BackButtonUI: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#136DA5",
        minWidth: wp('80%'),
        height: hp("6%"),
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },

    headerViewStyle: {
        borderRadius: 12,
        //height : hp('6%'),
        width: wp('90%'),
        alignSelf: 'center'
    }

});

export default LoadBowlSessionDetailScreen;

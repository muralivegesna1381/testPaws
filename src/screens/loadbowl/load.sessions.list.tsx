import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoadBowlStackParamList } from "../../navigation/types";
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import LoadBowlAPIManager from '../../network/load.bowl.api.manager';
import React, { useState, useEffect } from 'react';
import CommonStyles from "./../../styles/commonstyles";
import AppHeaderComponent from "../../components/appHeaderComponent";
import LinearGradient from "react-native-linear-gradient";
import LoadingModal from "../../components/loadingModel";
import fonts from "../../fonts/fonts";
import { showToast } from "../../components/custom.toast.message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

let scanbowl = require('./../../../assets/pngs/barcode-scan.png');
let loadbowl = require('./../../../assets/pngs/loadbowl-scan.png');

type SessionObject = {
    FEEDING_SESSION_ID: number;
    PLANNED_START_TIME: string;
    SESSION_STATUS_ID: string;
    START_TIME: string;
    BOWL_SESSION_ID: number;
    LOCATION: string;
};

type loadBowlSessionScreenProps = NativeStackScreenProps<
    LoadBowlStackParamList,
    "LoadBowlSession"
>

const LoadBowlSessionScreen = (props: loadBowlSessionScreenProps) => {

    const { navigation } = props;
    const [isLoading, set_isLoading] = useState(false);
    const { bowlText, sessions } = props.route.params;
    const [sessionsList, setSessionsList] = useState<SessionObject[]>([]);
    const insets = useSafeAreaInsets();

    // const handleGoBack = () => {
    //     if (onGoBack) {
    //         onGoBack(); // Execute the callback function
    //     }
    //     navigation.goBack();
    // };

    useEffect(() => {
        firebaseHelper.reportScreen(firebaseHelper.Screen_Loadbowl_SessionList);
        setSessionsList(sessions);
        // getBowlSessions();
    }, []);

    async function getBowlSessions() {
        try {
            set_isLoading(true);
            let sessionDetails = await LoadBowlAPIManager.getSessionDetail(bowlText);
            if (sessionDetails.result && sessionDetails.result.FeedingSessions && sessionDetails.result.FeedingSessions.length) {
                let dataList = sessionDetails.result.FeedingSessions;
                set_isLoading(false);
                setSessionsList(dataList);
            } else {
                set_isLoading(false);
            }

        } catch (e) {
            set_isLoading(false);
        } finally {
            set_isLoading(false);
        }

    }

    const isEnableStartSession = (currentSessionObject: SessionObject) => {
        const items = sessionsList.filter(session => session.FEEDING_SESSION_ID === currentSessionObject.FEEDING_SESSION_ID)
        if (items.length > 0) {
            if (currentSessionObject.SESSION_STATUS_ID == "P" && items[0].FEEDING_SESSION_ID == items[0].BOWL_SESSION_ID) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }

    function allowSessionStart(currentSessionObject: any) {
        let isAllow = true;
        for (let index = 0; index < sessionsList.length; index++) {
            let sessionObject = sessionsList[index] as any;
            if (sessionObject.SESSION_STATUS_ID == "I") {
                return false;
            }
        }
        return isAllow;
    }

    const updateSessionStatus = async (sessionObject: any) => {
        //TODO 
        if (sessionObject.SESSION_STATUS_ID == "P") {
            let isAllowAction = allowSessionStart(sessionObject);
            if (isAllowAction == false) {
                showToast("Please complete the 'In-progress' session before starting the next session.", "info");

                // Alert.alert("Please complete the 'In-progress' session before starting the next session.");
                return;
            }
        }
        try {
            set_isLoading(true);
            firebaseHelper.logEvent(firebaseHelper.Event_Update_Session_ListPage, firebaseHelper.Screen_Loadbowl_SessionList, "");

            if (sessionObject.SESSION_STATUS_ID == "I") {
                let bowlSessionRes = await LoadBowlAPIManager.getSessionBowlsLoaded(sessionObject.FEEDING_SESSION_ID);
                if (bowlSessionRes.result && bowlSessionRes.result.BowlsLoaded && bowlSessionRes.result.BowlsLoaded.length > 0) {
                    if (bowlSessionRes.result.BowlsLoaded[0].IS_BOWLS_LOADED && bowlSessionRes.result.BowlsLoaded[0].IS_BOWLS_LOADED == 'FALSE') {
                        set_isLoading(false);
                        showToast("Please load all food bowls before completing the session.", "info");

                        // Alert.alert("Please load all food bowls before completing the session.");
                        return;
                    }
                }
            }
            let data = [{ "feedingSession": sessionObject.FEEDING_SESSION_ID, "sessionStatusId": sessionObject.SESSION_STATUS_ID == "P" ? "I" : "C" }];
            let bowlRes = await LoadBowlAPIManager.updateSessionStatus(data);
            if (sessionObject.SESSION_STATUS_ID == "P") {
                set_isLoading(false);
                //Harika Remove onGOBack
                ////
                // if (onGoBack) {
                //     onGoBack();
                // }
                ////
                navigation.pop();
            } else {
                getBowlSessions();
            }
        } catch (e) {
            set_isLoading(false);
        } finally {
            set_isLoading(false);
        }
    };

    const backBtnAction = () => {
        navigation.pop();
    }

    const ListItem = ({ sessionObject }: SessionObject) => (

        <LinearGradient colors={['#B4F0FC', '#F0F9E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.linearStyle}>
            <View style={{ flexDirection: 'column', }}>

                <View style={{ flexDirection: 'row', alignContent: 'space-between', padding: 9 }}>
                    <Text style={styles.headerTextStyle}>Feeding Session</Text>
                    <Text style={{ marginRight: wp('2.8%'), fontSize: 14, fontWeight: '600', color: sessionObject.SESSION_STATUS_ID == "C" ? '#117A1B' : sessionObject.SESSION_STATUS_ID == "P" ? '#FB0000' : '#136DA5' }}> {sessionObject.SESSION_STATUS_ID == "C" ? 'Completed' : sessionObject.SESSION_STATUS_ID == "P" ? "Pending" : "In-progress"}</Text>
                </View>

                <View style={{ height: hp('0.15%'), backgroundColor: '#B4CFDA' }}></View>

                <View style={{ flexDirection: 'row', alignContent: 'space-between', paddingLeft: 10, paddingRight: 10, paddingBottom: 15, paddingTop: 15, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', alignContent: 'space-between', flex: 1, }}>

                        <TouchableOpacity onPress={() => {
                            firebaseHelper.logEvent(firebaseHelper.Event_Loadbowl_Button_SessionDetail, firebaseHelper.Screen_Loadbowl_SessionList, "");

                            navigation.navigate('LoadBowlSessionDetails', { 'sessionObject': sessionObject });
                        }}>
                            <Text style={{
                                fontSize: 16, fontWeight: '700',
                                color: '#000000',
                                textDecorationLine: "underline",
                                textDecorationStyle: "solid",
                                textDecorationColor: "black"
                            }}>{sessionObject.LOCATION}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: '#000000', marginTop: 10 }}>Start Time: {sessionObject.START_TIME}</Text>
                    </View>
                    {sessionObject.SESSION_STATUS_ID == "C" ? null : <TouchableOpacity onPress={() => {
                        if (sessionObject.SESSION_STATUS_ID == "P" && !isEnableStartSession(sessionObject))
                            return;
                        if (sessionObject.SESSION_STATUS_ID == "I" || sessionObject.SESSION_STATUS_ID == "P") {
                            updateSessionStatus(sessionObject)
                        }
                    }} >
                        <View style={{ height: hp('3.5%'), width: wp('30%'), backgroundColor: sessionObject.SESSION_STATUS_ID == "C" ? 'grey' : (sessionObject.SESSION_STATUS_ID == "P" && !isEnableStartSession(sessionObject)) ? 'grey' : '#136DA5', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontSize: fonts.fontTiny, ...CommonStyles.textStyleRegular, marginTop: hp('-0.2%'), textAlign: 'center', color: sessionObject.SESSION_STATUS_ID == "C" ? '#117A1B' : sessionObject.SESSION_STATUS_ID == "P" ? "#FFFFFF" : "#FFFFFF", padding: 10 }}>{sessionObject.SESSION_STATUS_ID == "C" ? 'Completed' : sessionObject.SESSION_STATUS_ID == "P" ? "START SESSION" : "COMPLETE"}</Text>
                        </View>
                    </TouchableOpacity>}
                </View>

            </View>
            {/* <View>
                <View style={{ flexDirection: 'column', margin: 10, padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignContent: 'space-between', }}>
                        <Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#000000' }}>Feeding Session</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#136DA5' }}>Status: {sessionObject.SESSION_STATUS_ID == "C" ? 'Completed' : sessionObject.SESSION_STATUS_ID == "P" ? "Pending" : "In Progress"}</Text>
                    </View>
                    <View style={{ height: 2, backgroundColor: 'black' }}>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignContent: 'space-between', flex: 1, alignItems: 'center', marginTop: 20 }}>
                    <View style={{ flexDirection: 'column', alignContent: 'space-between', flex: 1, }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('LoadBowlSessionDetails', { 'sessionObject': sessionObject });
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#000000' }}>{sessionObject.LOCATION}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: '#000000', marginTop: 10 }}>Start Time: {sessionObject.START_TIME}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (sessionObject.SESSION_STATUS_ID == "I" || sessionObject.SESSION_STATUS_ID == "P") {
                            updateSessionStatus(sessionObject)

                        }
                    }} >
                        <View style={{ backgroundColor: sessionObject.SESSION_STATUS_ID == "C" ? 'grey' : '#136DA5', borderRadius: 8 }}>
                            <Text style={{ fontSize: 14, fontWeight: '300', color: '#FFFFFF', padding: 10 }}>{sessionObject.SESSION_STATUS_ID == "C" ? 'Completed' : sessionObject.SESSION_STATUS_ID == "P" ? "START SESSION" : "Complete"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View> */}
        </LinearGradient >
    );
    return (

        <View style={{
            flex: 1, backgroundColor: 'white', paddingTop: insets.top,
        }}>
            <View style={{ flex: 1 }}>

                <AppHeaderComponent
                    headerTitle="Feeding Session Details"
                    isShowBackButton={true}
                    isShowGridListButton={false}
                    isShowNotificationButton={false}
                    isShowNotesButton={false}
                    notificationsAvailble={false}
                    backBtnAction={backBtnAction} moduleName={undefined} headerColor={undefined}>

                </AppHeaderComponent>

                <FlatList
                    data={sessionsList}
                    renderItem={({ item }) => (
                        <ListItem
                            sessionObject={item}
                        />
                    )}
                    keyExtractor={(item) => item.FEEDING_SESSION_ID.toString()}
                />
            </View>
            {isLoading && (
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
            )}
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

    linearStyle: {
        width: wp('90%'),
        margin: wp('2%'),
        borderRadius: 14,
        borderColor: '#398FC5',
        borderWidth: 1,
        alignSelf: 'center'
    },

    headerTextStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#000000'
    }

});

export default LoadBowlSessionScreen;

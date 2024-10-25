import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Keyboard, Pressable, TouchableWithoutFeedback } from 'react-native'
import CameraView from './camera.view';
import LinearGradient from 'react-native-linear-gradient';
import AppHeaderComponent from '../../components/appHeaderComponent';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoadBowlStackParamList } from '../../navigation/types';
import CommonStyles from '../../styles/commonstyles';
import fonts from '../../fonts/fonts';
import Barcode from "./../../../assets/svgs/barcode.svg";
import OpenSessionIcon from "./../../../assets/svgs/open_session_icon.svg";
import TickMark from "./../../../assets/svgs/tickmark.svg";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import loadBowlDetailstyles from '../../styles/load.bowl.details.style';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { GetLoadBowlDetail } from './loadBowlData';
import LoadBowlAPIManager from '../../network/load.bowl.api.manager';
import moment from 'moment';
import LoadingModal from '../../components/loadingModel';
import BottomButtonComponent from '../../components/button.component';
import { useFocusEffect } from '@react-navigation/native';
import Utils from '../../utils';
import { showToast } from '../../components/custom.toast.message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

type Categories = "Scan Bowl" | "Load Bowl";
type BarcodeTypes = "Bowl Barcode" | "Feeder Barcode"

type loadbowlScreenProps = NativeStackScreenProps<
    LoadBowlStackParamList,
    "LoadBowlDetailsScreen"
>

const LoadBowlDetailsScreen = (props: loadbowlScreenProps) => {
    const { navigation } = props;
    const { selectionType } = props.route.params;
    const [selectedCategory, set_selectedCategory] = useState<Categories>(selectionType == "scanbowl" ? 'Scan Bowl' : 'Load Bowl');
    const [bowlText, onChangebowlText] = React.useState<string>('');
    const [feederBarCode, onChangeFeederBarCode] = React.useState<string>('');

    const [selectedBarCodeType, set_SelectedBarCodeType] = useState<BarcodeTypes>("Bowl Barcode");
    const [bowlDetailsObj, set_bowlDetailsObj] = useState<GetLoadBowlDetail>();
    const [isLoading, set_isLoading] = useState<boolean>(false);
    const [openScanner, setOpenScanner] = useState<boolean>(true);

    const [focusedInputIndex, setFocusedInputIndex] = useState<number>(0)
    const bowlTextInputRef = useRef<TextInput>(null);
    const feederTextInputRef = useRef<TextInput>(null);
    const [enableAutoFocusCamera, set_EnableAutoFocusCamera] = useState<boolean>(false);
    const [sessionsList, setSessionsList] = useState<SessionObject[]>([]);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        console.log("bowlTextInputRef.current : ", bowlTextInputRef.current);
        if (bowlTextInputRef.current && focusedInputIndex == 0) {
            bowlTextInputRef.current.focus()
        }
    }, [bowlTextInputRef.current])

    useEffect(() => {
        firebaseHelper.reportScreen(firebaseHelper.Screen_Loadbowl_Scan);
        setFocusedInputIndex(-1);
    }, [])

    useEffect(() => {
        if (feederTextInputRef.current && focusedInputIndex == 1) {
            feederTextInputRef.current.focus()
        }

    }, [feederTextInputRef.current])

    useFocusEffect(
        React.useCallback(() => {
            console.log("useFocusEffect : ", focusedInputIndex);
            if (bowlTextInputRef.current && focusedInputIndex == 0) {
                bowlTextInputRef.current.focus()
                set_SelectedBarCodeType('Bowl Barcode');
                // setOpenScanner(true);
            }
            if (feederTextInputRef.current && focusedInputIndex == 1) {
                console.log("useFocusEffect : ", enableAutoFocusCamera);
                if (enableAutoFocusCamera) {
                    setOpenScanner(true);
                } else {
                    feederTextInputRef.current.focus()
                    set_SelectedBarCodeType('Feeder Barcode');
                }

            }
        }, [focusedInputIndex, enableAutoFocusCamera])
    )

    useEffect(() => {
        console.log("focusedInputIndex useEffect : ", focusedInputIndex);
    }, [focusedInputIndex])

    useEffect(() => {
        console.log("openScanner: ", openScanner);

    }, [openScanner])

    async function getBowlDetails(bowlId: string, navigateToSession: boolean) {
        if (bowlId.length == 0) {
            // ToastLoader("Please enter the bowl Id.");
            showToast("Please enter the bowl Id.", "info");
            return;
        }
        Keyboard.dismiss();
        try {
            set_bowlDetailsObj(undefined)
            set_isLoading(true);
            firebaseHelper.logEvent(firebaseHelper.Event_Get_Bowl_Details, firebaseHelper.Screen_Loadbowl_Scan, "");     
            let bowlRes = await LoadBowlAPIManager.getBowlDetails(bowlId);

            if (bowlRes.result && bowlRes.result.GetLoadBowlDetails && bowlRes.result.GetLoadBowlDetails.length) {
                set_bowlDetailsObj(bowlRes.result.GetLoadBowlDetails[0]);
                if (navigateToSession == true) {
                    set_selectedCategory('Load Bowl');
                    getBowlSessions(bowlId);
                } else {
                    set_isLoading(false);
                }

            } else {
                firebaseHelper.logEvent(firebaseHelper.Event_Scan_FeederId, firebaseHelper.Screen_Loadbowl_Scan, "");     
                set_isLoading(false);
                onChangebowlText("");
                onChangeFeederBarCode("");
                set_SelectedBarCodeType('Bowl Barcode');
                setOpenScanner(true);
                showToast("Sorry! Bowl not found", "info");
            }
            console.log("TEST RES------> ", bowlRes);

        } catch (e) {
            set_isLoading(false);
            console.error('Error----->', e);
        } finally {
            set_isLoading(false);
        }

    }

    const updateSessionStatus = async (sessionObject: any, feederBarCode: String) => {
        try {
            firebaseHelper.logEvent(firebaseHelper.Event_Update_Session, firebaseHelper.Screen_Loadbowl_Scan, "");

            let data = [{ "feedingSession": sessionObject.FEEDING_SESSION_ID, "sessionStatusId": sessionObject.SESSION_STATUS_ID == "P" ? "I" : "C" }];
            let bowlRes = await LoadBowlAPIManager.updateSessionStatus(data);
            let sessionDetails = await LoadBowlAPIManager.getSessionDetail(bowlText);
            console.log("sessionDetails")
            console.log(sessionDetails)

            if (sessionDetails.result && sessionDetails.result.FeedingSessions && sessionDetails.result.FeedingSessions.length) {
                let dataList = sessionDetails.result.FeedingSessions;
                setSessionsList(dataList);
                if (dataList.length == 1) {
                    submitBowlDetails(bowlText, feederBarCode);
                }
            }
            // set_isLoading(false);
            // set_SelectedBarCodeType('Feeder Barcode');
            // setOpenScanner(true);
            // setAutofocusInput(AutoFocusInput.FeederInput);
        } catch (e) {
            set_isLoading(false);
        } finally {
            set_isLoading(false);
        }
    };

    async function getBowlSessions(bowlId: string) {
        try {

            let sessionDetails = await LoadBowlAPIManager.getSessionDetail(bowlId);
            console.log("sessionDetails")
            console.log(sessionDetails)

            if (sessionDetails.result && sessionDetails.result.FeedingSessions && sessionDetails.result.FeedingSessions.length) {
                let dataList = sessionDetails.result.FeedingSessions;
                setSessionsList(dataList);
                if (dataList.length == 1) {

                    // var obj = dataList[0];
                    // if (obj.SESSION_STATUS_ID == "P") {
                    //     updateSessionStatus(obj);
                    // } else {
                    set_isLoading(false);
                    set_SelectedBarCodeType('Feeder Barcode');
                    //feederTextInputRef.current.focus();
                    setOpenScanner(true);
                    // }
                } else {

                    var isEnable = checkAnyPendingSession(dataList);

                    set_isLoading(false);
                    if (isEnable) {
                        console.log("Remove loader");
                        set_selectedCategory('Load Bowl');
                        set_SelectedBarCodeType('Feeder Barcode');
                        // setOpenScanner(true);
                        //feederTextInputRef.current.focus();
                        setFocusedInputIndex(1)
                        set_EnableAutoFocusCamera(true);
                        firebaseHelper.logEvent(firebaseHelper.Event_Loadbowl_Button_SessionList, firebaseHelper.Screen_Loadbowl_Scan, "");
                        navigation.navigate('LoadBowlSession', { 'bowlText': bowlId, "sessions": dataList, });
                    } else {
                        set_SelectedBarCodeType('Feeder Barcode');
                        setFocusedInputIndex(1)
                        //feederTextInputRef.current.focus();
                        setOpenScanner(true);
                    }
                }
            } else {
                set_isLoading(false);
            }

        } catch (e) {
            console.log(e)
            set_isLoading(false);
        } finally {
            set_isLoading(false);
        }
    }

    // const handleCallback = () => {
    // set_EnableAutoFocusCamera(true);
    //     console.log("Callback executed!");
    // };

    function checkAnyPendingSession(dataList: any) {
        for (var index = 0; index < dataList.length; index++) {
            if (dataList[index].FEEDING_SESSION_ID == dataList[index].BOWL_SESSION_ID) {
                if (dataList[index].SESSION_STATUS_ID == "P") {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    async function submitBowlDetails(bowlText: String, feederBarCode: String) {

        if (bowlText.length == 0) {
            showToast("Please enter the bowl Id.", "info");
            return;
        }
        if (feederBarCode.length == 0) {
            showToast((bowlDetailsObj != null && bowlDetailsObj.IS_FEEDER == 0) ? "Please enter cageId" : "Please enter feederCode", "info");
            return;
        }
        if (bowlDetailsObj == null) {
            return;
        }
        if (feederBarCode.toLowerCase() != bowlDetailsObj.SLOT_ID.toLowerCase()) {
            Keyboard.dismiss();
            setFocusedInputIndex(-1);
            showToast("'" + bowlText + "'" + " and " + "'" + feederBarCode + "'" + " are not associated.", "error");
            return;
        }

        try {
            firebaseHelper.logEvent(firebaseHelper.Event_Loadbowl_Button_Submit, firebaseHelper.Screen_Loadbowl_Scan, "");

            // return;
            set_isLoading(true);
            let sessionDetails = await LoadBowlAPIManager.getSessionDetail(bowlText);

            if (sessionDetails.result && sessionDetails.result.FeedingSessions && sessionDetails.result.FeedingSessions.length) {
                let dataList = sessionDetails.result.FeedingSessions;
                setSessionsList(dataList);
                if (dataList.length == 1 && dataList[0].SESSION_STATUS_ID == "P") {
                    updateSessionStatus(dataList[0], feederBarCode);
                } else {

                    let sessionDetails = await LoadBowlAPIManager.getSessionDetail(bowlText);
                    Keyboard.dismiss();
                    if (sessionDetails.result && sessionDetails.result.FeedingSessions && sessionDetails.result.FeedingSessions.length) {
                        let dataList = sessionDetails.result.FeedingSessions;
                        var isEnable = checkAnyPendingSession(dataList);

                        if (isEnable) {
                            set_isLoading(false);
                            showToast("Session not started. Please start the session.", "error");
                            return;
                        }
                    }


                    var currentDate = moment().format("MM/DD/YYYY");
                    let userID = await Utils.getData("UserId");

                    let data =
                        "scanBowlID=" +
                        bowlText +
                        "&slotId=" +
                        feederBarCode +
                        "&loadTime=" +
                        currentDate +
                        "&usr=" +
                        userID;
                    let res = await LoadBowlAPIManager.setLoadBowlDetails(data);
                    console.log(res);
                    set_isLoading(false);
                    if (res.code == -1) {
                        firebaseHelper.logEvent(firebaseHelper.Event_Submit_Bowl_Fail, firebaseHelper.Screen_Loadbowl_Scan, "");
                        var message = res.message;
                        if (res.message.includes("not associated")) {
                            message = bowlText + " and " + feederBarCode + " are not associated.";
                        }
                        showToast(message, "error");
                        setTimeout(() => {
                            onChangebowlText("");
                            onChangeFeederBarCode("");
                            set_bowlDetailsObj(undefined)
                            set_selectedCategory('Load Bowl');
                            set_SelectedBarCodeType('Bowl Barcode');
                            setOpenScanner(true);
                        }, 300);

                    } else {
                        firebaseHelper.logEvent(firebaseHelper.Event_Submit_Bowl_Success, firebaseHelper.Screen_Loadbowl_Scan, "");
                        //TO DO: 
                        // set_bowlDetailsObj(undefined);
                        showToast(res.message + "!", "success");
                        setTimeout(() => {
                            onChangebowlText("");
                            onChangeFeederBarCode("");
                            set_bowlDetailsObj(undefined)
                            set_selectedCategory('Load Bowl');
                            set_SelectedBarCodeType('Bowl Barcode');
                            setOpenScanner(true);
                        }, 300);
                    }
                }
            }

        } catch (e) {
            set_isLoading(false);
            console.error('Error----->', e);
        } finally {
            set_isLoading(false);
        }

    }

    const changeBarCodeText = (text: string) => {
        onChangeFeederBarCode("");
        set_bowlDetailsObj(undefined);
        onChangebowlText(text);
        setFocusedInputIndex(0);
    }

    async function resetDetails() {
        firebaseHelper.logEvent(firebaseHelper.Event_Loadbowl_Button_Reset, firebaseHelper.Screen_Loadbowl_Scan, "");
        set_bowlDetailsObj(undefined);
        onChangebowlText("");
        onChangeFeederBarCode("");
        set_SelectedBarCodeType('Bowl Barcode');
        setFocusedInputIndex(0);
        bowlTextInputRef.current?.focus();
        setOpenScanner(true);

    }
    const onSubmitEditingBowl = () => {
        if (bowlDetailsObj?.CONTAINER_ID != bowlText) {
            getBowlDetails(bowlText, selectedCategory == 'Load Bowl');
        }

    }

    const onTapBowlScan = () => {
        if (selectedCategory == 'Scan Bowl') {
            firebaseHelper.logEvent(firebaseHelper.Event_Scan_Barcode, firebaseHelper.Screen_Loadbowl_Scan, "");     
            set_SelectedBarCodeType('Bowl Barcode')
            setOpenScanner(true);
        } else {
            if (bowlText != "") {
                getBowlDetails(bowlText, true);
            }
        }
    }

    const onSubmitFeeder = () => {
        if (selectedCategory == 'Load Bowl') {
            // submitBowDetails()
        }
    }


    const unFocuseInputFields = () => {
        console.log("unFocuseInputFields ");
        console.log("bowlTextInputRef -----> ", bowlTextInputRef);
        console.log("feederTextInputRef -----> ", feederTextInputRef);

        Keyboard.dismiss();
        bowlTextInputRef.current?.blur();
        feederTextInputRef.current?.blur();
        console.log("bowlTextInputRef -----> ", bowlTextInputRef);
        console.log("feederTextInputRef -----> ", feederTextInputRef);

    }

    const cameraCancelCallback = () => {
        console.log("bowlDetailsObj------> ", bowlDetailsObj);
        console.log("selectedCategory -----> ", selectedCategory);
        // console.log("bowlTextInputRef -----> ", bowlTextInputRef.current);
        // console.log("feederTextInputRef -----> ", feederTextInputRef.current);
        if (selectedCategory == 'Scan Bowl') {
            set_SelectedBarCodeType('Bowl Barcode');
            setFocusedInputIndex(0);
            bowlTextInputRef.current?.focus();
        } else {
            if (bowlDetailsObj == null) {
                set_SelectedBarCodeType('Bowl Barcode');
                setFocusedInputIndex(0);
                bowlTextInputRef.current?.focus();
            } else {
                set_SelectedBarCodeType('Feeder Barcode');
                setFocusedInputIndex(1);
                feederTextInputRef.current?.focus();
            }
        }
        setOpenScanner(false);
    }


    const onBarCodeRead = (scanResult: any) => {
        if (scanResult.data) {
            unFocuseInputFields();
            setOpenScanner(false);
            if (selectedBarCodeType == 'Bowl Barcode') {
                onChangebowlText(scanResult.data);
                getBowlDetails(scanResult.data, selectedCategory == 'Load Bowl');
            } else {
                onChangeFeederBarCode(scanResult.data);
                submitBowlDetails(bowlText, scanResult.data);
            }
        }
    };

    function SegmentButtonUI() {
        return (
            <View style={{ flexDirection: 'row', height: 25, width: wp('90%'), alignSelf: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        marginRight: 2.5,
                        backgroundColor: selectedCategory == "Scan Bowl" ? '#136DA4' : '#C2C2C280',
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 6
                    }}
                    onPress={() => {
                        console.log(bowlDetailsObj)
                        if (selectedCategory == 'Scan Bowl') {
                            firebaseHelper.logEvent(firebaseHelper.Event_Loadbowl_Button_Tab, firebaseHelper.Screen_Loadbowl_Scan, "");

                            set_selectedCategory('Load Bowl');
                            if (bowlDetailsObj != null && feederBarCode.length == 0) {
                                set_SelectedBarCodeType('Feeder Barcode')
                                if (bowlDetailsObj != null && feederBarCode.length == 0) {
                                    set_SelectedBarCodeType('Feeder Barcode')
                                }
                                setOpenScanner(true)
                            } else {
                                set_SelectedBarCodeType('Bowl Barcode')
                                setOpenScanner(true)
                            }
                        } else {
                            firebaseHelper.logEvent(firebaseHelper.Event_Scanbowl_Button_Tab, firebaseHelper.Screen_Loadbowl_Scan, "");
                            set_selectedCategory('Scan Bowl');
                        }
                    }}>
                    <Text style={{
                        color: selectedCategory == "Scan Bowl" ? '#FFFFFF' : '#3A3A3A', fontSize: fonts.fontSmall,
                        ...CommonStyles.textStyleBold,
                    }}>Scan Bowl</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        marginLeft: 2.5,
                        backgroundColor: selectedCategory == "Load Bowl" ? 'rgba(19, 109, 164, 1)' : '#C2C2C280',
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 6
                    }}
                    onPress={() => {
                        console.log(bowlDetailsObj)
                        if (selectedCategory == 'Scan Bowl') {
                            firebaseHelper.logEvent(firebaseHelper.Event_Loadbowl_Button_Scan, firebaseHelper.Screen_Loadbowl_Scan, "");
                            set_selectedCategory('Load Bowl');
                            if (bowlDetailsObj != null && feederBarCode.length == 0) {
                                set_SelectedBarCodeType('Feeder Barcode')
                                if (bowlDetailsObj != null && feederBarCode.length == 0) {
                                    set_SelectedBarCodeType('Feeder Barcode')
                                }
                                setOpenScanner(true)
                            } else {
                                set_SelectedBarCodeType('Bowl Barcode')
                                setOpenScanner(true)
                            }
                        } else {
                            firebaseHelper.logEvent(firebaseHelper.Event_Scanbowl_Button_Scan, firebaseHelper.Screen_Loadbowl_Scan, "");
                            set_selectedCategory('Scan Bowl');
                        }
                    }}>
                    <Text style={{
                        color: selectedCategory == "Load Bowl" ? '#FFFFFF' : '#3A3A3A', fontSize: fonts.fontSmall,
                        ...CommonStyles.textStyleBold,
                    }}>Load Bowl</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function SubmitButton() {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={{ height: hp("8%"), marginTop: hp("2.5%") }}>
                    <View style={{}}>
                        <Pressable onPress={() => submitBowlDetails(bowlText, feederBarCode)} style={loadBowlDetailstyles.submitButton}>
                            <Text style={loadBowlDetailstyles.submitBtnTxtStyle}> {'Submit'} </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );

    }

    function ResetButton() {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={{ height: hp("8%"), marginTop: hp("2.5%") }}>
                    <View style={{}}>
                        <Pressable onPress={() => resetDetails()} style={loadBowlDetailstyles.submitButton}>
                            <Text style={loadBowlDetailstyles.submitBtnTxtStyle}> {'Reset'} </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );

    }

    function BowlItemUI() {
        return (
            <View style={loadBowlDetailstyles.bowlItemUI}>
                <View style={{ flexDirection: 'row', alignItems: "flex-start", borderBottomWidth: 1, borderRadius: 15, borderBottomColor: 'rgba(217, 217, 217, 1)', width: wp('90%'), alignSelf: 'center' }}>
                    <Text style={loadBowlDetailstyles.bowlTextStyle}>{'Food Bowl Details'}</Text>
                </View>

                <View style={[loadBowlDetailstyles.bowlItem,]}>
                    <Text style={loadBowlDetailstyles.bowlTextStyleLabel}>{"Session No.:"}</Text>
                    <Text style={loadBowlDetailstyles.bowlTextStyleValue}> {bowlDetailsObj?.SESSION_NO ? bowlDetailsObj?.SESSION_NO : 'N/A'} </Text>
                </View>
                <View style={loadBowlDetailstyles.bowlItem}>
                    <Text style={loadBowlDetailstyles.bowlTextStyleLabel}>Feeding Date: </Text>
                    <Text style={loadBowlDetailstyles.bowlTextStyleValue}>{bowlDetailsObj?.SCHEDULED_DATE ? bowlDetailsObj?.SCHEDULED_DATE : 'N/A'}</Text>
                </View>
                <View style={loadBowlDetailstyles.bowlItem}>
                    <Text style={loadBowlDetailstyles.bowlTextStyleLabel}>Feeder ID:</Text>
                    <Text style={loadBowlDetailstyles.bowlTextStyleValue}>{bowlDetailsObj?.SLOT_ID ? bowlDetailsObj?.SLOT_ID : 'N/A'}</Text>
                </View>
                <View style={loadBowlDetailstyles.bowlItem}>
                    <Text style={loadBowlDetailstyles.bowlTextStyleLabel}>Location:</Text>
                    <Text style={loadBowlDetailstyles.bowlTextStyleValue}>{bowlDetailsObj?.LOCATION_ID ? bowlDetailsObj?.LOCATION_ID : 'N/A'}</Text>
                </View>
                <View style={loadBowlDetailstyles.bowlItem}>
                    <Text style={loadBowlDetailstyles.bowlTextStyleLabel}>Description:</Text>
                    <Text style={loadBowlDetailstyles.bowlTextStyleValue}>{bowlDetailsObj?.FORMULA_DESC ? bowlDetailsObj?.FORMULA_DESC : 'N/A'}</Text>
                </View>
            </View>
        );
    }

    const _renderTextInput = () => {
        console.log("focusedInputIndex -------- : ", focusedInputIndex, focusedInputIndex == 1);

        return (
            <TextInput
                ref={feederTextInputRef}
                style={[loadBowlDetailstyles.searchContainerStyle, { backgroundColor: bowlDetailsObj == null ? '#D3D3D3' : 'transparent', marginLeft: 15, }]}
                //editable={bowlDetailsObj != null}
                maxLength={10}
                onChangeText={(text) => { onChangeFeederBarCode(text) }}
                onSubmitEditing={() => onSubmitFeeder()} // <=== here
                returnKeyType={'done'}
                value={feederBarCode}
                placeholder={(bowlDetailsObj != null && bowlDetailsObj.IS_FEEDER == 0) ? 'Scan Cage ID' : "Scan Feeder ID"}
                autoFocus={focusedInputIndex == 1 ? true : false}
            />
        )
    }

    return (
        <View style={{
            paddingTop: insets.top, flex: 1,
            backgroundColor: '#F1F9E8',
        }}>

            <View style={{
                flex: 1,

            }}>
                {openScanner ? <CameraView title={selectedBarCodeType == "Bowl Barcode" ? 'Scan Bowl ID' : (bowlDetailsObj != null && bowlDetailsObj.IS_FEEDER == 0) ? 'Scan Cage ID' : "Scan Feeder ID"} cancelCallback={() => { cameraCancelCallback() }} onBarCodeRead={(obj) => { onBarCodeRead(obj) }} /> :
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                        <LinearGradient colors={['#F1F9E8', '#ACEEFE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>


                            <AppHeaderComponent
                                headerTitle='ATMS Load Bowl'
                                isShowBackButton={true}
                                isShowGridListButton={false}
                                isShowNotificationButton={false}
                                isShowNotesButton={false}
                                notificationsAvailble={false}
                                backBtnAction={() => { navigation.pop() }} moduleName={undefined} headerColor={undefined} />

                            <SegmentButtonUI />

                            <View style={{ flex: 1 }}>
                                <View style={{
                                    backgroundColor: '#FFFFFF',
                                    marginTop: 15,
                                    width: wp('90%'),
                                    borderRadius: 6,
                                    flexDirection: 'row',
                                    borderColor: '#242E4226',
                                    borderWidth: 1,
                                    alignSelf: 'center'
                                }}>
                                    <View style={[loadBowlDetailstyles.SearchUI, { backgroundColor: 'transparent' }]}>
                                        <TextInput
                                            ref={bowlTextInputRef}
                                            style={[loadBowlDetailstyles.searchContainerStyle, { backgroundColor: 'transparent', marginLeft: 15 }]}
                                            editable={true}
                                            maxLength={10}
                                            onChangeText={(text) => { changeBarCodeText(text) }}
                                            onSubmitEditing={() => onSubmitEditingBowl()} // <=== here
                                            returnKeyType={'done'}
                                            value={bowlText}
                                            placeholder={'Scan Bowl ID'}
                                            autoFocus={focusedInputIndex == 0}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => { onTapBowlScan(); }} >
                                        <View style={[loadBowlDetailstyles.SearchImage, { backgroundColor: '#C3CFD6', borderBottomRightRadius: 6, borderRadius: !props.isEnable ? 0 : 6 }]}>
                                            {selectedCategory == "Scan Bowl" ? <Barcode width={40} height={40} /> : <OpenSessionIcon />}
                                        </View>
                                    </TouchableOpacity>
                                </View >

                                {selectedCategory == 'Scan Bowl' ? null :
                                    <View style={{
                                        backgroundColor: '#FFFFFF',
                                        marginTop: 15,
                                        width: wp('90%'),
                                        borderRadius: 6,
                                        flexDirection: 'row',
                                        borderColor: '#242E4226',
                                        borderWidth: 1,
                                        alignSelf: 'center'
                                    }}>
                                        <View style={[loadBowlDetailstyles.SearchUI, { backgroundColor: bowlDetailsObj == null ? '#D3D3D3' : 'transparent' }]}>
                                            {_renderTextInput()}
                                        </View>
                                        <TouchableOpacity onPress={() => { submitBowlDetails(bowlText, feederBarCode); }} >
                                            <View style={[loadBowlDetailstyles.SearchImage, { backgroundColor: bowlDetailsObj == null ? '#D3D3D3' : '#C3CFD6', borderBottomRightRadius: 6, borderRadius: bowlDetailsObj == null ? 0 : 6 }]}>
                                                <TickMark width={40} height={40} />
                                            </View>
                                        </TouchableOpacity>
                                    </View >
                                }

                                {selectedCategory == 'Scan Bowl' && bowlDetailsObj != undefined ?
                                    <BowlItemUI /> : <View></View>
                                }
                                {selectedCategory == 'Scan Bowl' ?
                                    <View></View> : <ResetButton />
                                }
                            </View>

                            <View style={{ alignItems: 'center' }}>
                                <View style={{ width: wp("85%"), flexDirection: "row" }}>
                                    <View style={{ flex: 1, marginTop: hp("10%"), marginBottom: hp("2%") }}>
                                        <BottomButtonComponent
                                            title={selectedCategory == 'Scan Bowl' ? 'Load Bowl' : 'Scan Bowl'}
                                            buttonClick={() => {
                                                console.log(bowlDetailsObj)
                                                if (selectedCategory == 'Scan Bowl') {
                                                    set_selectedCategory('Load Bowl');
                                                    if (bowlDetailsObj != null && feederBarCode.length == 0) {
                                                        set_SelectedBarCodeType('Feeder Barcode')
                                                        setOpenScanner(true)
                                                    } else {
                                                        set_SelectedBarCodeType('Bowl Barcode')
                                                        setOpenScanner(true)
                                                    }
                                                } else {
                                                    set_selectedCategory('Scan Bowl');
                                                }
                                            }}
                                            buttonType="loadbowl"


                                        />

                                    </View>
                                </View>
                            </View>



                        </LinearGradient>
                    </TouchableWithoutFeedback>
                }
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
        </View>
    )
}

export default LoadBowlDetailsScreen;
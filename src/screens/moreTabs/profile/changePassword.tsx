import React, { useState, useEffect } from "react";

import HeaderComponent from "../../../components/headerComponent";
import { ChangePasswordParamList } from "../../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    FlatList, Pressable, Text, View, TouchableOpacity,
    Image,
    Platform,
    TextInput,
    StyleSheet,
    Alert,
    Button,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../../../styles/commonstyles";
import Colors from "../../../styles/color";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts from "../../../fonts/fonts";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomButtonComponent from "../../../components/button.component";
import NetworkManager from "../../../network/network.manager";
import Utils, { Flow, PASSWORD_ERROR } from "../../../utils";
import { updateStack } from "../../../redux/slices/login.slicer";
import { useDispatch } from "react-redux";
import LoadingModal from "../../../components/loadingModel";
import { UserResponse } from "../../../model/user_details";
import { saveUserData } from "../../../redux/slices/user.slicer";
import CustomBottomButtonComponent from "../../../components/custom.button.component";
import { t } from "i18next";
import { showToast } from "../../../components/custom.toast.message";
import * as firebaseHelper from "../../../utilities/firebase/firebaseHelper";

let hideImg = require("./../../../../assets/pngs/hide-password.png");
let openImg = require("./../../../../assets/pngs/show-password.png");

type ChangePasswordParamListProps = NativeStackScreenProps<
    ChangePasswordParamList,
    "ChangePasswordScreen",
>;

const ChangePasswordScreen = (props: ChangePasswordParamListProps) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();
    const [old_Password, setOldPassword] = useState("");
    const [isHideOldPassword, set_isHideOldPassword] = useState(true);
    const [new_Password, setNewPassword] = useState("");
    const [isHideNewPassword, set_isHideNewPassword] = useState(true);
    const [confirm_Password, setConfirmPassword] = useState("");
    const [isHideConfirmPassword, set_isHideConfirmPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    let passwordErrors: Array<string> = [PASSWORD_ERROR.MIN_8,
    PASSWORD_ERROR.ONE_UP,
    PASSWORD_ERROR.ONE_LW,
    PASSWORD_ERROR.ONE_NUMBER,
    PASSWORD_ERROR.ONE_SPEC];

    useEffect(() => {
        firebaseHelper.reportScreen(firebaseHelper.Screen_Change_Password);
    }, []);

    async function doPasswordChange(requestBody: { oldPassword: string; newPassword: string; flow: string; }) {

        try {

            setLoading(true)
            let result = await NetworkManager.requestPasswordChange(requestBody);
            console.log("doPasswordChange", result);
            if (result?.status?.httpStatus == 200) {
                //TODO need to change token, user id, mail
                let userResponse: UserResponse = result?.response;
                await Utils.storeData("Token", userResponse?.accessToken ?? "");
                console.log(
                    "MAIN MAIN---->",
                    userResponse?.userDetails?.userInfoId
                );
                Utils.storeData(
                    "UserId",
                    String(userResponse?.userDetails?.userInfoId ?? "")
                );
                Utils.storeData(
                    "Email",
                    userResponse?.userDetails?.email ?? ""
                );

                if (props.route.params?.isFromLogin) {
                    dispatch(saveUserData(result));
                    dispatch(updateStack({ stackName: "BottomBar" }));
                } else {
                    navigation.pop();
                }

            } else if (result?.status?.httpStatus == 400) {
                console.log("doPasswordChange 400", result);
                // Utils.showToastMessage(result?.errors[0].message ?? "Please try again");
                Alert.alert(result?.errors[0].message?.length > 0 ? result?.errors[0].message : "The server was unable to process the request. Please try again after some time.")
            }
            else if (result?.status?.httpStatus == 401) {
                Alert.alert(
                    "Fail",
                    result?.errors[0]?.message ?? "",
                    [
                        {
                            text: "Login again",
                            onPress: () => {
                                dispatch(updateStack({ stackName: "Auth" }));
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }

    }
    function errorDetails(errorMessage: string) {
        let errorlist = Utils.validatePassword(new_Password);
        let index = errorlist.indexOf(errorMessage);
        return (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: index >= 0 ? Colors.TEXT_ERROR : Colors.TEXT_VALID, width: 6, height: 6, borderRadius: 4, marginRight: 5 }}>
            </View>
            <Text style={index >= 0 ? styles.errorTextStyle : styles.TxtStyle}>{errorMessage}</Text>
        </View>);

    }
    const isValidLoginInputs = () => {
        if (old_Password.length === 0 || new_Password.length === 0 || confirm_Password.length === 0) {
            return false;
        }
        return true;
    }
    return (

        <LinearGradient
            colors={[Colors.GRADENT_COLOR_LIGTH, Colors.GRADENT_COLOR_DARK]}
            style={CommonStyles.mainComponentStyle}
        >
            <View style={[CommonStyles.mainContainer, { paddingTop: insets.top }]}>
                <HeaderComponent
                    navigation={undefined}
                    route={undefined}
                    moduleName={"Change Password"}
                    headerColor={"#FFF"} />

                {/* <View style={{ alignItems: 'center', justifyContent: 'center', width: wp('100%') }}> */}
                <View style={{ justifyContent: "flex-start", width: wp("100%"), alignItems: 'center', flex: 1 }}>

                    <View
                        style={[
                            CommonStyles.textInputContainerStyle,
                            { alignSelf: "center", marginTop: hp("2%"), marginLeft: wp('10%') },
                        ]}
                    >
                        <TextInput
                            style={CommonStyles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholder={props.route.params?.isFromLogin ? "Temporary Password *" : "Old Password *"}
                            placeholderTextColor="#000"
                            autoCapitalize="none"
                            maxLength={25}
                            secureTextEntry={isHideOldPassword}
                            value={old_Password}
                            onChangeText={(userPswd) => {
                                setOldPassword(userPswd);
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                set_isHideOldPassword(!isHideOldPassword);
                            }}
                        >
                            <Image
                                source={isHideOldPassword ? hideImg : openImg}
                                style={[CommonStyles.hideOpenIconStyle, { width: wp("6%") }]}
                            />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={[
                            CommonStyles.textInputContainerStyle,
                            { alignSelf: "center", marginTop: hp("2%"), marginLeft: wp('10%') },
                        ]}
                    >
                        <TextInput
                            style={CommonStyles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholder="New Password *"
                            maxLength={25}
                            placeholderTextColor="#000"
                            autoCapitalize="none"
                            secureTextEntry={isHideNewPassword}
                            value={new_Password}
                            onChangeText={(userPswd) => {
                                setNewPassword(userPswd);
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                set_isHideNewPassword(!isHideNewPassword);
                            }}
                        >
                            <Image
                                source={isHideNewPassword ? hideImg : openImg}
                                style={[CommonStyles.hideOpenIconStyle, { width: wp("6%") }]}
                            />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={[
                            CommonStyles.textInputContainerStyle,
                            { alignSelf: "center", marginTop: hp("2%"), marginLeft: wp('10%') },
                        ]}
                    >
                        <TextInput
                            style={CommonStyles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholder="Confirm Password *"
                            placeholderTextColor="#000"
                            maxLength={25}
                            autoCapitalize="none"
                            secureTextEntry={isHideConfirmPassword}
                            value={confirm_Password}
                            onChangeText={(userPswd) => {
                                setConfirmPassword(userPswd);
                                let reulst = Utils.validatePassword(userPswd);
                                console.log("result", reulst)
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                set_isHideConfirmPassword(!isHideConfirmPassword);
                            }}
                        >
                            <Image
                                source={isHideConfirmPassword ? hideImg : openImg}
                                style={[CommonStyles.hideOpenIconStyle, { width: wp("6%") }]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: hp("2%"), width: wp("75%"), }}>
                        {passwordErrors.map((item) => errorDetails(item))}
                    </View>


                    <LoadingModal visible={loading} text="Processing..." />
                </View>
                <View style={{ width: wp('100%'), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', backgroundColor: 'white', height: hp('12%'), justifyContent: 'center', }}>
                    <View style={{ width: wp('45%'), marginLeft: wp('2%') }}>
                        <BottomButtonComponent style={{ width: 100 }} title={"Cancel"} buttonClick={function (): void {
                            navigation.pop();
                        }} buttonType={"cancel"} ></BottomButtonComponent>

                    </View>
                    <View style={{ width: wp('45%'), marginLeft: wp('1%'), marginRight: wp('2%') }}>
                        <CustomBottomButtonComponent
                            isEnable={isValidLoginInputs()}
                            title={t("loginscreen.submit")}
                            buttonClick={function (): void {

                                let flow = props.route.params?.isFromLogin ? Flow.RESET : Flow.CHANGE;
                                let bothAreEqual = new_Password === confirm_Password;
                                let errorlist = Utils.validatePassword(new_Password);
                                if (errorlist.length == 0 && bothAreEqual && old_Password.length > 7) {

                                    //Need to show alert message
                                    Alert.alert(
                                        "Are you sure you would like to Submit?",
                                        "",
                                        [
                                            {
                                                text: "No",
                                                onPress: () => {
                                                },
                                            },
                                            {
                                                text: "Yes",
                                                onPress: () => {
                                                    firebaseHelper.logEvent(firebaseHelper.Event_Change_Password, firebaseHelper.Screen_Change_Password, "");
                                                    let requestBody = {
                                                        "oldPassword": old_Password,
                                                        "newPassword": new_Password,
                                                        "flow": flow
                                                    }
                                                    doPasswordChange(requestBody);
                                                },
                                            },
                                        ],
                                        { cancelable: false }
                                    );


                                } else {
                                    if (!isValidLoginInputs()) {
                                        return;
                                    }
                                    if (old_Password.length === 0) {
                                        // Utils.showToastMessage(props.route.params?.isFromLogin ? "Please provide Temporary password!" : "Please provide Old password!")
                                        showToast(props.route.params?.isFromLogin ? "Please provide Temporary password!" : "Please provide a Old password!", "error");
                                    }
                                    if (old_Password.length <= 7) {
                                        // Utils.showToastMessage(props.route.params?.isFromLogin ? "Please provide valid Temporary password!" : "Please provide valid Old password!")
                                        showToast(props.route.params?.isFromLogin ? "Please provide valid Temporary password!" : "Please provide a valid Old password!", "error");

                                    }
                                    else if (new_Password.length === 0) {
                                        // Utils.showToastMessage("Please provide new password!")
                                        showToast("Please provide new password!", "error");

                                    }
                                    else if (confirm_Password.length === 0) {
                                        // Utils.showToastMessage("Please re-enter your new password!")
                                        showToast("Please re-enter your new password!", "error");
                                    }
                                    else if (!bothAreEqual) {
                                        //Utils.showToastMessage("Passwords do not match. Please try again.")
                                        showToast("Passwords do not match. Please try again.", "error");
                                    }

                                }

                            }}
                            textColor={!isValidLoginInputs() ? "rgba(255, 255, 255, 0.5)" : 'black'}
                            borderColor={'#FF6F0C'}
                            gradientColors={!isValidLoginInputs() ? ["rgba(0, 0, 0, 0.4)", 'rgba(0, 0, 0, 0.4)'] : ["rgba(255, 111, 12, 0.2)", "rgba(255, 111, 12, 0.2)"]}
                        />
                        {/* <BottomButtonComponent style={{ width: 100 }} title={"Submit"} buttonClick={function (): void {

                            console.log("Is from ", props.route.params?.isFromLogin)
                            let flow = props.route.params?.isFromLogin ? Flow.RESET : Flow.CHANGE;
                            let bothAreEqual = new_Password === confirm_Password;
                            let errorlist = Utils.validatePassword(new_Password);
                            if (errorlist.length == 0 && bothAreEqual && old_Password.length > 0) {

                                //Need to show alert message
                                Alert.alert(
                                    "Are you sure you would like to Submit?",
                                    "",
                                    [
                                        {
                                            text: "No",
                                            onPress: () => {
                                                console.log("OK Pressed");

                                            },
                                        },
                                        {
                                            text: "Yes",
                                            onPress: () => {
                                                console.log("OK Pressed");

                                                let requestBody = {
                                                    "oldPassword": old_Password,
                                                    "newPassword": new_Password,
                                                    "flow": flow
                                                }
                                                console.log("requestBody", requestBody);
                                                doPasswordChange(requestBody);
                                            },
                                        },
                                    ],
                                    { cancelable: false }
                                );


                            } else {
                                if (!isValidLoginInputs()) {
                                    return;
                                }
                                if (old_Password.length === 0) {
                                    Utils.showToastMessage(props.route.params?.isFromLogin ? "Please provide Temporary password!" : "Please provide Old password!")
                                }
                                else if (new_Password.length === 0) {
                                    Utils.showToastMessage("Please provide new password!")
                                }
                                else if (confirm_Password.length === 0) {
                                    Utils.showToastMessage("Please re-enter your new password!")
                                }
                                else if (!bothAreEqual) {
                                    Utils.showToastMessage("The password and confirm password fields value must be matched")
                                }

                                console.log("Please provide passowrd")
                            }

                        }} buttonType={"submit"} ></BottomButtonComponent> */}

                    </View>
                </View>
            </View>
        </LinearGradient >

    );


}


const styles = StyleSheet.create({

    TxtStyle: {
        fontSize: fonts.fontXSmall,
        ...CommonStyles.textStyleRegular,
        color: '#117A1B'
    },
    errorTextStyle: {
        fontSize: fonts.fontXSmall,
        ...CommonStyles.textStyleRegular,
        color: Colors.TEXT_ERROR,
        fontWeight: "300"
    },

});


export default ChangePasswordScreen;



/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import CommonStyles from "../styles/commonstyles";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";
import LinearGradient from "react-native-linear-gradient";
import InputText from "../components/input.text";
import BottomButtonComponent from "../components/button.component";
import NetworkManager from "../network/network.manager";
import { useTranslation } from "react-i18next";
import Utils from "./../utils";
import _ from "lodash";
import LoadingModal from "../components/loadingModel";
import HeaderComponent from "../components/headerComponent";
import Colors from "../styles/color";
import { showToast } from "../components/custom.toast.message";
type ResetPasswordProps = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

/*
This page allows the User to reset the password of their account in the PAWS digital app,
User will be authenticated via Email Id that they are entering once, the authentication is successful
then then User will be sent a temp password to their email
*/
const ResetPassword = (props: ResetPasswordProps) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const { navigation } = props;
    const [userEmail, setUserEmail] = useState("");
    const onPress = async () => {
        if (Utils.isValidEmail(userEmail)) {
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

                            _resetRequest();
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert("Please provide a valid Email ID");
        }
    };
    async function _resetRequest() {
        try {
            setLoading(true)
            let result = await NetworkManager.requestPasswordReset(userEmail);
            if (result?.status?.httpStatus === 200) {
                //Utils.showToastMessage(result?.response?.message);
                showToast(result?.response?.message, "success")
                navigation.pop();
            } else {
                // Utils.showToastMessage(result?.errors[0]?.message);
                Alert.alert(result?.errors[0]?.message ?? 'Invalid');
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <LinearGradient
            colors={["#F1F9E8", "#ACEEFE"]}
            style={styles.mainComponentStyle}
        >
            <View style={[CommonStyles.mainContainer, { paddingTop: insets.top }]}>
                <HeaderComponent
                    navigation={undefined}
                    route={undefined}
                    moduleName={"Reset Password"}
                    headerColor={"#FFF"}
                />
                <View
                    style={styles.innerView}>

                    <View style={{ justifyContent: "center", width: wp("80%") }}>
                        <Text style={styles.registerTextStyle}>Email</Text>
                        <InputText
                            value={userEmail}
                            maxLength={50}
                            placeHolder={"Enter your Email"}
                            placeholderTextColor={Colors.GRAY}
                            onChangeText={(userEmail: string) => {
                                setUserEmail(userEmail);
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignSelf: "center",
                            height: hp("10%"),
                            marginTop: hp("5%"),
                            alignContent: "center",
                        }}
                    >
                        <View
                            style={{ width: wp("40%"), alignSelf: "center", marginRight: 5 }}
                        >
                            <BottomButtonComponent
                                style={{ width: 100 }}
                                title={"Cancel"}
                                buttonClick={function (): void {
                                    navigation.pop();
                                }}
                                buttonType={"cancel"}
                            ></BottomButtonComponent>
                        </View>
                        <View
                            style={{ width: wp("40%"), alignSelf: "center", marginLeft: 5 }}
                        >
                            <BottomButtonComponent
                                style={{ width: 100 }}
                                title={"Submit"}
                                buttonClick={() => {
                                    onPress();
                                }}
                                buttonType={"submit"}
                            ></BottomButtonComponent>
                        </View>
                    </View>
                </View>
            </View>
            <LoadingModal visible={loading} text="Validating User..." />
        </LinearGradient>
    );
};

//Styles used in this screen are defined here
const styles = StyleSheet.create({
    mainComponentStyle: {
        flex: 1,
        backgroundColor: "#b3effb",
    },
    registerTextStyle: {
        ...CommonStyles.textStyleRegular,
        fontSize: fonts.fontNormal,
        color: "#000",
        marginTop: hp("1%"),

        marginLeft: wp("1%"),
    },
    innerView: {
        alignItems: "center",
        justifyContent: 'center',
        flex: 1,
        marginBottom: hp('10%')
    },
    buttonStyle: {
        flex: 1,
        marginTop: hp("5%")
    },
    buttonContainer: {
        width: wp("80%"),
        flexDirection: "row"
    },

});

export default ResetPassword;

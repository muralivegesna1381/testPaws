/* eslint-disable react-native/no-inline-styles */
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import LinearGradient from "react-native-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import fonts from "../fonts/fonts";
import { AuthStackParamList } from "../navigation/types";
import { updateStack } from "../redux/slices/login.slicer";
import CommonStyles from "../styles/commonstyles";
import PawsLogo from "./../../assets/svgs/paws_logo.svg";

import DeviceInfo from 'react-native-device-info';
import InputText from "../components/input.text";


import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBottomButtonComponent from "../components/custom.button.component";
import { showToast } from "../components/custom.toast.message";
import LoadingModal from "../components/loadingModel";
import { UserResponse } from "../model/user_details";
import NetworkManager from "../network/network.manager";
import { saveUserData } from "../redux/slices/user.slicer";
import Utils from "./../utils";
import * as firebaseHelper from "../utilities/firebase/firebaseHelper";
import CheckBoxEmpty from "./../../assets/svgs/checkbox_empty.svg";
import CheckBoxSelected from "./../../assets/svgs/checkbox_selected.svg";

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

/*
This page allows the User to log in to the PAWS digital app, initially
User will be authenticated via Biometrics once, the authentication is successful
then then User will be allowed into the app
*/
const LoginScreen = (props: LoginScreenProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isValidInputs, setIsValidInputs] = useState(false);
  const { navigation } = props;
  const [isHidePassword, set_isHidePassword] = useState(true);
  let hideImg = require("./../../assets/pngs/hide-password.png");
  let openImg = require("./../../assets/pngs/show-password.png");
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [rememberMe, set_rememberMe] = useState(true);



  const [userEmail, setUserEmail] = useState("");
  const [user_Password, setPassword] = useState("");
  // const [userEmail, setUserEmail] = useState("rrallabandi@ctepl.com");
  // const [user_Password, setPassword] = useState("Password@03");
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });
  let pawsLogo = require("./../../assets/svgs/paws_logo.svg");

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Login);
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (!keyboardVisible) {  // Ensure animation is triggered only once
        setKeyboardVisible(true);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Clean up the listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardVisible]);

  const onPress = () => {
    // if (!isValidInputs)
    //   return;
    Keyboard.dismiss();
    if (userEmail && user_Password) {
      //console.log("Condition okay");
      //Call login API
      //Navigates to dashaboard

      var reulst = doLogin();
      //console.log("Condition Login ", reulst);
    } else {
      Alert.alert("Please provide Username and Password");
    }
  };
  async function doLogin() {
    setLoading(true);
    let data = {
      Username: userEmail,
      Password: user_Password,
    };

    try {
      firebaseHelper.logEvent(firebaseHelper.Event_Login_Button, firebaseHelper.Screen_Login, "");
      let loginRes = await NetworkManager.doLogin(data);
      // console.log("TEST RES123::", JSON.stringify(loginRes));

      Utils.storeData(
        "rememberMe",
        rememberMe ? "Yes" : "No"
      );

      if (loginRes) {
        if (
          loginRes?.status?.success &&
          loginRes?.response?.userDetails?.isActive
        ) {
          firebaseHelper.logEvent(firebaseHelper.Event_Login_Sucess, firebaseHelper.Screen_Login, "");
          let userResponse: UserResponse = loginRes?.response;
          //console.log("LOGIN::::", userResponse);
          firebaseHelper.setUserId(userEmail.toLowerCase());
          firebaseHelper.setUserProperty(userEmail.toLowerCase());
          Utils.storeData("Token", loginRes?.response?.accessToken ?? "");
          Utils.storeData("firstName", userResponse.userDetails.firstName ?? "");
          Utils.storeData("lastName", userResponse.userDetails.lastName ?? "");
          Utils.storeData(
            "UserId",
            String(loginRes?.response?.userDetails?.userInfoId ?? "")
          );
          //We are considering email as userId 
          Utils.storeData(
            "UserName",
            String(userResponse?.userDetails?.userId ?? "")
          );
          Utils.storeData(
            "Email",
            loginRes?.response?.userDetails?.email ?? ""
          );

          dispatch(saveUserData(loginRes));
          if (userResponse?.userDetails?.isLoggedIn == 0) {
            //Utils.showToastMessage("Required to change password");
            showToast("Required to change password", "info");
            navigation.navigate("ChangePassword", { isFromLogin: true });
          } else dispatch(updateStack({ stackName: "BottomBar" }));
          //TODO need to show chagne password
        } else {
          if (loginRes.status.httpStatus == 400) {
            firebaseHelper.logEvent(firebaseHelper.Event_Login_Fail, firebaseHelper.Screen_Login, "StatusCode:400");
            //Invalid PAWSDIGITAL_TKN_004 -> 400
            console.error(
              "Invalid login attemp 400::::",
              loginRes.errors[0].message
            );
            Alert.alert(loginRes?.errors[0]?.message ?? "Invalid login");
          }
          else if (loginRes.status.httpStatus == 500) {
            firebaseHelper.logEvent(firebaseHelper.Event_Login_Fail, firebaseHelper.Screen_Login, "StatusCode:500");
            Alert.alert(t("loginscreen.netword_error"));
          } else {
            firebaseHelper.logEvent(firebaseHelper.Event_Login_Fail, firebaseHelper.Screen_Login, "StatusCode: Invalid");
            Alert.alert(loginRes?.errors[0]?.message ?? "Invalid login");
          }
        }
      } else {
        firebaseHelper.logEvent(firebaseHelper.Event_Login_Fail, firebaseHelper.Screen_Login, "StatusCode: Network Error");

        console.error("Error Login: undifinde", loginRes);
        Alert.alert(t("loginscreen.netword_error"));
      }
    } catch (e) {
      console.error("Error Login:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    //Authenticates user using face id (Biometrics method invocation)
    fingerPrint();
  }, []);

  const fingerPrint = async () => {
    var isBiometricsEnabled = await Utils.getData("isBiometricsEnabled");
    var accessToken = await Utils.getData("Token");
    var userId = await Utils.getData("UserId");
    var prefernce = await Utils.getData("rememberMe") ?? "No";
    if (prefernce == "Yes") {
      var userName = await Utils.getData("UserName");

      setUserEmail(userName ?? '');
    }
    if (accessToken && isBiometricsEnabled === "true") {
      rnBiometrics
        .simplePrompt({ promptMessage: "Confirm fingerprint" })
        .then(async (resultObject) => {
          const { success } = resultObject;

          if (success) {
            // Biometrics authentication successful

            if (accessToken) {
              dispatch(updateStack({ stackName: "BottomBar" }));
            } else {
              console.log("ELSE CONDITIONS");
            }
            console.log("successful biometrics provided");
          } else {
            // Biometrics authentication failed
            console.log("user cancelled biometric prompt");
          }
        })
        .catch(() => {
          //Biometrics authentication failed
          console.log("biometrics failed");
        });
    }
    //login with token , with out asking password.
    else if (accessToken && userId) {
      // Have token but biometric disabled.
      dispatch(updateStack({ stackName: "BottomBar" }));
    }
  };

  return (
    <LinearGradient
      colors={["#F1F9E8", "#ACEEFE"]}
      style={CommonStyles.mainComponentStyle}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: hp('25%') }}
        onKeyboardWillShow={(frames: Object) => {
          console.log('Keyboard event', frames)
        }}>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: hp("35%"),
            paddingTop: insets.top
          }}
        >
          <PawsLogo style={styles.image} />



          <View style={{ justifyContent: "center", width: wp("80%") }}>
            <Text style={styles.registerTextStyle}>{t("loginscreen.login")}</Text>
            <InputText
              value={userEmail}
              maxLength={50}
              placeHolder={"User Name"}
              placeholderTextColor={"#000"}
              onChangeText={(userEmail: string) => {
                setUserEmail(userEmail);
              }}
            />

            <View
              style={[
                CommonStyles.textInputContainerStyle,
                { alignSelf: "center", marginTop: hp("2%") },
              ]}
            >
              <TextInput
                style={CommonStyles.textInputStyle}
                underlineColorAndroid="transparent"
                placeholder="Password"
                placeholderTextColor="#000"
                autoCapitalize="none"
                secureTextEntry={isHidePassword}
                maxLength={25}
                value={user_Password}
                onSubmitEditing={onPress}
                onChangeText={(userPswd) => {
                  setPassword(userPswd);
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  set_isHidePassword(!isHidePassword);
                }}
              >
                <Image
                  source={isHidePassword ? hideImg : openImg}
                  style={[CommonStyles.hideOpenIconStyle, { width: wp("6%") }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: hp("0.5%"), width: wp("80%"), alignSelf: 'center', alignContent: 'flex-end', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{
                height: hp("4%"),
                flexDirection: "row",
                marginTop: hp("1.75%"),
                alignItems: 'center',
                alignSelf: 'flex-start',
                marginLeft: hp("1%")


              }}
              onPress={() => {
                if (rememberMe) {
                  set_rememberMe(false);
                }
                else {
                  set_rememberMe(true);
                }

              }}
            >
              {rememberMe ? (
                <CheckBoxSelected
                  style={[
                    {
                      width: wp("6%"),
                      height: wp("6%"),
                      marginRight: wp("1%")
                    },
                  ]}
                />
              ) : (
                <CheckBoxEmpty
                  style={[
                    {
                      width: wp("6%"),
                      height: wp("6%"),
                      marginRight: wp("1%")
                    },
                  ]}
                />
              )}
              <Text style={styles.forgotPaswdTextStyle}>
                {t("loginscreen.remeber_me")}
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{
                height: hp("4%"),
                justifyContent: "flex-end",
                marginRight: wp('2%'),
              }}
              onPress={() => {
                navigation.navigate("ResetPassword");
              }}
            >
            </TouchableOpacity> */}
            <TouchableOpacity
              style={{
                height: hp("4%"),
                justifyContent: "center",
                marginLeft: wp("5%"),
                marginTop: hp("1.75%"),

              }}
              onPress={() => {
                navigation.navigate("ResetPassword");
              }}
            >
              <Text style={styles.forgotPaswdTextStyle}>
                {t("loginscreen.forgotpassword")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: wp("80%"), flexDirection: "row" }}>
            <View style={{ flex: 1, marginTop: hp("2%") }}>
              <CustomBottomButtonComponent
                isEnable={userEmail.length > 0 && user_Password.length > 0}
                title={t("loginscreen.submit")}
                buttonClick={onPress}
                textColor={!(userEmail.length > 0 && user_Password.length > 0) ? "rgba(255, 255, 255, 0.5)" : 'black'}
                borderColor={'#FF6F0C'}
                gradientColors={!(userEmail.length > 0 && user_Password.length > 0) ? ["rgba(0, 0, 0, 0.4)", 'rgba(0, 0, 0, 0.4)'] : ["rgba(201, 214, 202, 1)", "rgba(192, 219, 215, 1)"]}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Text style={styles.versionTextStyle}>
        Version: {DeviceInfo.getBuildNumber()}
      </Text>
      <LoadingModal visible={loading} text="Logging in..." />
    </LinearGradient>
  );
};

//Styles used in this screen are defined here
const styles = StyleSheet.create({
  mainComponentStyle: {
    flex: 1,
    backgroundColor: "white",
  },

  forgotPaswdTextStyle: {
    ...CommonStyles.textStyleRegular,
    fontSize: fonts.fontXSmall,
    marginRight: wp("2.5%"),
    color: "#000",
  },

  versionTextStyle: {
    ...CommonStyles.textStyleRegular,
    fontSize: fonts.fontSmall,
    color: "#000",
    position: "absolute",
    bottom: 30,
    alignSelf: "center"


  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    width: wp("75%"),
    height: hp("8%"),
    marginTop: hp("5%"),
    borderColor: "#FF6F0C",
    borderWidth: wp("0.2%"),
  },

  registerTextStyle: {
    ...CommonStyles.textStyleRegular,
    fontSize: fonts.fontNormal,
    color: "#000",
    // marginTop: hp("1%"),
    //marginBottom: hp("1%"),
    marginLeft: wp("5%"),
  },

  image: {
    height: hp("20%"),
    width: wp("50%"),
    resizeMode: "contain",
    marginTop: hp("25%"),
  },
});

export default LoginScreen;

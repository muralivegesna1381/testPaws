import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MoreTabsStackParamList } from "../../../navigation/types";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../../../styles/commonstyles";
import HeaderComponent from "../../../components/headerComponent";
import fonts from "../../../fonts/fonts";
import RightArrow from "../../../../assets/svgs/rightArrow.svg";
import RoomPreference from "../../../../assets/svgs/room_preference.svg";
import ChangePassword from "../../../../assets/svgs/change_password.svg";
import ProfileCircleIcon from "../../../../assets/svgs/profile_Icon_circle.svg";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Utils from "../../../utils";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import NetworkManager from "../../../network/network.manager";
import { updateStack } from "../../../redux/slices/login.slicer";
import { saveUserData } from "../../../redux/slices/user.slicer";
import { showToast } from "../../../components/custom.toast.message";
import * as firebaseHelper from "../../../utilities/firebase/firebaseHelper";


type moreTabsScreenProps = NativeStackScreenProps<
  MoreTabsStackParamList,
  "MyProfileScreen"
>;

const MyProfileScreen = (props: moreTabsScreenProps) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  //const globalState = useSelector((state: RootState) => state.userData);
  const [firstName, setFirstName] = useState("-");
  const [lastName, setLastName] = useState("-");
  const [email, setEmail] = useState("-");
  const t = useTranslation();
  const dispatch = useDispatch();

  const onPressLogOut = async () => {

    //TODO need to logout
    console.log("onPressLogOut ---- ");
    try {
      firebaseHelper.logEvent(firebaseHelper.Event_Logout, firebaseHelper.Screen_My_Profile, "");
      let result = await NetworkManager.doLogout();
      //In any case logout the user for now.
      //if (result?.status?.httpStatus == 200) {
      //Alert.alert("Logout", result?.response?.message);
      //Utils.showToastMessage(result?.response?.message);
      showToast(result?.response?.message, "success");
      // Utils.storeData("Token", "");
      // Utils.storeData("UserId", "");
      // Utils.storeData("Email", "");
      // Utils.storeData("firstName", "");
      // Utils.storeData("lastName", "");
      //}
    } catch (e) {
      console.error(e);
    } finally {
      await Utils.clearUserData();
      dispatch(saveUserData(undefined));
      dispatch(updateStack({ stackName: "Auth" }));
    }
  };
  const backBtnAction = () => {
    navigation.pop();
  };

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_My_Profile);
    loadData();
  }, []);
  async function loadData() {
    const firstName = await Utils.getData("firstName");
    const lastName = await Utils.getData("lastName");
    const email = await Utils.getData("UserName");
    setFirstName(firstName ?? '');
    setEmail(email ?? '');
    setLastName(lastName ?? '');
  }
  function ChangePasswordWidget() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            firebaseHelper.logEvent(firebaseHelper.Event_Change_Password_Button, firebaseHelper.Screen_My_Profile, "");
            navigation.navigate("ChangePassword", { isFromLogin: false });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: 15,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#136DA3",
                  padding: 10,
                  borderRadius: 10,
                  marginRight: wp("5%"),
                }}
              >
                <ChangePassword width={wp("4%")} height={hp("2%")} />
              </View>
              <Text style={[styles.TxtStyle]}>Change Password</Text>
            </View>
            <RightArrow />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  function RoomPreferenceWidget() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            firebaseHelper.logEvent(firebaseHelper.Event_Room_Prefrences_Button, firebaseHelper.Screen_My_Profile, "");

            navigation.navigate("RoomPreference");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: 15,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#136DA3",
                  padding: 10,
                  borderRadius: 10,
                  marginRight: wp("5%"),
                }}
              >
                <RoomPreference width={wp("4%")} height={hp("2%")} />
              </View>
              <Text style={[styles.TxtStyle]}>Room Preferences</Text>
            </View>
            <RightArrow />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function LogoutButtonWidget() {
    return (
      <View style={{ alignItems: "center" }}>
        <Pressable onPress={onPressLogOut} 
        style={styles.logOutButtonStyle}>
          <Text style={styles.logOutTxtStyle}>{"Logout"}</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <LinearGradient
      colors={["#F1F9E8", "#ACEEFE"]}
      style={CommonStyles.mainComponentStyle}
    >
      <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
        <HeaderComponent
          navigation={undefined}
          route={undefined}
          moduleName={"My Profile"}
          headerColor={"#FFF"}
          backBtnAction={backBtnAction}
        />
        <View style={{ flexDirection: "column", marginBottom: 20 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", margin: 15 }}
          >
            <ProfileCircleIcon style={styles.imageStyle} />

            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text style={styles.nameTxtStyle}>
                {firstName} {lastName}
              </Text>
              <Text style={styles.emailTxtStyle}>{email}</Text>
            </View>
          </View>
        </View>

        <ChangePasswordWidget></ChangePasswordWidget>
        <RoomPreferenceWidget></RoomPreferenceWidget>
      </View>
      <LogoutButtonWidget></LogoutButtonWidget>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  innerView: {
    backgroundColor: "#A0D7D9",
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    borderRadius: 10,
    padding: 15,
  },
  imageStyle: {
    margin: 5,
  },
  actionsCellViewStyle: {
    width: wp("80%"),
    height: hp("5%"),
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  TxtStyle: {
    fontSize: fonts.fontXMedium,
    ...CommonStyles.textStyleBold,
  },
  moreImgStyels: {
    height: hp("2%"),
    width: hp("2%"),
  },
  instTxtStyle: {
    fontSize: fonts.fontTiny,
    ...CommonStyles.textStyleLight,
    alignItems: "center",
    alignSelf: "center",
  },
  nameTxtStyle: {
    fontSize: fonts.fontLarge,
    ...CommonStyles.textStyleBold,
  },
  emailTxtStyle: {
    fontSize: fonts.fontXMedium,
    ...CommonStyles.textStyleBold,
  },
  logOutButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#93A0B033",
    padding: 10,
    borderRadius: 35,
    minWidth: wp("80%"),
    height: hp("6%"),
    marginBottom: hp("5%"),
  },
  logOutTxtStyle: {
    fontWeight: "600",

    fontSize: fonts.fontMedium,
    ...CommonStyles.textStyleBlack,
  },
});

export default MyProfileScreen;

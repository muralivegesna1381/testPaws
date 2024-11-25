import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MoreTabsStackParamList } from "../../../navigation/types";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../../../styles/commonstyles";
import HeaderComponent from "../../../components/headerComponent";
import { Switch } from "react-native-paper";
import fonts from "../../../fonts/fonts";
import Utils from "../../../utils";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showToast } from "../../../components/custom.toast.message";
import * as firebaseHelper from "../../../utilities/firebase/firebaseHelper";


type moreTabsScreenProps = NativeStackScreenProps<
  MoreTabsStackParamList,
  "SettingsScreen"
>;

const SettingsScreen = ({ route, navigation }: moreTabsScreenProps) => {
  const insets = useSafeAreaInsets();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    Utils.storeData("isBiometricsEnabled", "" + !isSwitchOn);
    if (isSwitchOn) {
      firebaseHelper.logEvent(firebaseHelper.Event_FaceID_On, firebaseHelper.Screen_Settings, "")
      showToast("Face Scan/PIN is disabled.", "info");
      // Utils.showToastMessageInCenter("Face Scan/PIN is disabled");
    } else {
      firebaseHelper.logEvent(firebaseHelper.Event_FaceID_Off, firebaseHelper.Screen_Settings, "");
      showToast("Face Scan/PIN is enabled.", "info");
      // Utils.showToastMessageInCenter("Face Scan/PIN is enabled");
    }
  };

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Settings);
    // fetchMenu.then(result => setItems(result);
    getBiometricsStatus();
  }, []);
  const backBtnAction = () => {
    navigation.pop();
  };

  async function getBiometricsStatus() {
    var isBiometricsEnabled = await Utils.getData("isBiometricsEnabled");
    if (isBiometricsEnabled === "true") {
      setIsSwitchOn(true);
    } else {
      setIsSwitchOn(false);
    }
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
          moduleName={"Settings"}
          headerColor={"#FFF"}
          backBtnAction={backBtnAction}
        />
        <LinearGradient
          colors={["#A0D7D9", "#A0D7D9"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.innerView}
        >
          <View style={styles.actionsCellViewStyle}>
            <Text style={CommonStyles.textStyleRegular}>Face Scan/PIN </Text>
            <Switch
              color="#136DA4"
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          </View>
          <Text style={styles.instTxtStyle}>
            Enhance PAWS Digital app security with Face Scan/PIN Authentication.
          </Text>
        </LinearGradient>
      </View>
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
  actionsCellViewStyle: {
    width: wp("80%"),
    height: hp("5%"),
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  instTxtStyle: {
    fontSize: fonts.fontTiny,
    ...CommonStyles.textStyleLight,
    alignItems: "center",
    alignSelf: "center",
  },
});

export default SettingsScreen;

import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";
import CommonStyles from "./../styles/commonstyles";
import BackIcon from "./../../assets/svgs/back.svg";
import { useNavigation } from "@react-navigation/native";
import MenuIcon from "./../../assets/svgs/menu.svg";
import NetworkIcon from "./../../assets/svgs/network_icon.svg";
import NetInfo from "@react-native-community/netinfo";

const HeaderComponent = ({
  route,
  moduleName,
  headerColor,
  moduleType = "",
  isCustomNav = false,
  ...props
}) => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(true);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const isPreviousNetState = useRef(true);

  useEffect(() => {
    // Subscribe to network status updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        if (isPreviousNetState.current == false) {
          setShowOnlineMessage(true);
        }
        isPreviousNetState.current = true;
        setIsConnected(true);

        // Hide the "Back to online" message after 5 seconds
        setTimeout(() => {
          setShowOnlineMessage(false);
        }, 6000);
      } else {
        isPreviousNetState.current = false;
        setIsConnected(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const backBtnAction = () => {
    try {
      if (isCustomNav == false) {
        navigation.goBack();
      }

      props.backBtnAction();
    } catch (e) {
      console.error("Error here", e);
    }
  };
  
  return (
    <View style={{ flexDirection: "column" }}>
      <View
        style={{
          backgroundColor: "transparent",
          marginBottom: hp("3%"),
          marginLeft: wp("2%"),
          flexDirection: "row",
        }}
      >
        {moduleName !== "More" ? (
          <Pressable
            hitSlop={{ top: 10, bottom: 10 }}
            onPress={() => backBtnAction()}
          >
            <BackIcon
              style={{
                marginLeft: wp("2%"),
                marginRight: wp("2%"),
                marginTop: hp("1.5%"),
                width: wp("10%"),
                height: wp("10%"),
                color: "red",
              }}
            />
          </Pressable>
        ) : null}

        <View style={[styles.headerSelectionView]}>
          <Text style={[styles.titleStyle]}>{moduleName}</Text>
        </View>
        {moduleName === "Notifications" || moduleType === "ACT" ? (
          <Pressable
            onPress={() => {
              props.menuAction();
            }}
          >
            <MenuIcon
              style={{
                marginLeft: wp("2%"),
                marginRight: wp("5%"),
                marginTop: hp("1%"),
                width: wp("10%"),
                height: wp("10%"),
                color: "red",
              }}
            />
          </Pressable>
        ) : null}
      </View>
      {isConnected == false ? (
        <View
          style={{
            width: wp("100%"),
            height: 26,
            backgroundColor: "red",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ marginLeft: 10 }}>
            <NetworkIcon />
          </View>
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Offline Mode
            </Text>
          </View>
        </View>
      ) : showOnlineMessage ? (
        <View
          style={{
            width: wp("100%"),
            height: 26,
            backgroundColor: "green",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ marginLeft: 10 }}></View>
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Back Online!
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  headerView: {
    justifyContent: "center",
    flex: 1,
  },

  headerSelectionView: {
    flex: 1,
    minHeight: hp("4%"),
    flexDirection: "row",
    alignItems: "center",
  },

  backBtnDisableStyle: {
    marginLeft: wp("2%"),
    width: wp("8%"),
    height: wp("8%"),
    resizeMode: "contain",
  },

  backBtnEnableStyle: {
    marginLeft: wp("2%"),
    width: wp("6%"),
    height: wp("4%"),
    resizeMode: "contain",
  },

  titleStyle: {
    color: "black",
    fontSize: fonts.fontNormal,
    ...CommonStyles.textStyleBold,
    textAlign: "center",
    marginLeft: wp("2%"),
  },

  separatorViewStyle: {
    height: hp("0.1%"),
    width: wp("100%"),
    bottom: 0,
  },
});

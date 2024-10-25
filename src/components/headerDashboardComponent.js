import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";
import CommonStyles from "../styles/commonstyles";
import EditIcon from "../../assets/svgs/edit_icon.svg";
import GridIcon from "../../assets/svgs/grid_icon.svg";
import NotificationsIcon from "../../assets/svgs/notification_icon.svg";
import NotificationRedIcon from "../../assets/svgs/notification_red.svg";
import Utils, { MonitorTypes } from "../utils";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ListIcon from "../../assets/svgs/list_Icon.svg";
import NetworkIcon from "./../../assets/svgs/network_icon.svg";
import NetInfo from "@react-native-community/netinfo";
import * as firebaseHelper from "../utilities/firebase/firebaseHelper";

const HeaderComponent = ({
  route,
  moduleName,
  headerColor,
  notificationsAvailable,
  ...props
}) => {
  useEffect(() => { }, []);
  const navigation = useNavigation();

  const [isListAction, set_isListAction] = useState(true);
  const [notificationStatus, set_notificationStatus] = useState(
    notificationsAvailable
  );
  const [isConnected, setIsConnected] = useState(true);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const isPreviousNetState = useRef(true);

  useEffect(() => {
    // Subscribe to network status updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        if (isPreviousNetState.current === false) {
          setShowOnlineMessage(true);
        }
        isPreviousNetState.current = true;
        setIsConnected(true);

        // Hide the "Back to online" message after 5 seconds
        setTimeout(() => {
          setShowOnlineMessage(false);
        }, 6000);
        //TODO going to synch Records
        scduleSyncData();
      } else {
        isPreviousNetState.current = false;
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
      } else {
        //console.log("==SYNCH==", count?.length);
      }
    });
  }
  //console.log("module name", moduleName, notificationsAvailable);
  const editAction = () => {

    firebaseHelper.logEvent(firebaseHelper.Event_Notes, firebaseHelper.Screen_Dashboard_Grid, "");
    navigation.navigate("NotesScreen");
  };

  const listAction = () => {
    firebaseHelper.logEvent(firebaseHelper.Event_ListView, firebaseHelper.Screen_Dashboard_Grid, "");
    navigation.navigate("Dashboard");
  };

  const gridAction = () => {
    firebaseHelper.logEvent(firebaseHelper.Event_GridView, firebaseHelper.Screen_Dashboard_Grid, "");
    navigation.navigate("DashboardListView", {
      selectedMonitorID: MonitorTypes.PENDING_ANIMAL_TASKS,
    });
  };

  const notificationAction = async () => {
    firebaseHelper.logEvent(firebaseHelper.Event_Notifications, firebaseHelper.Screen_Dashboard_Grid, "");
    navigation.navigate("NotificationHome");
    var token = await Utils.getData("Token");

  };
  return (
    <View>
      <View
        style={{
          backgroundColor: headerColor,
          flexDirection: "row",
          height: hp("8%"),
          alignItems: "center",
          marginLeft: wp("2%"),
        }}
      >
        <View style={[styles.headerSelectionView]}>
          <Text style={[styles.titleStyle]}>Dashboard</Text>
        </View>

        <TouchableOpacity
          onPress={() => {

            if (moduleName === "Dashboard_List") {
              listAction();
            } else {

              gridAction();
            }
          }}
        >
          {moduleName === "Dashboard_List" ? (
            <GridIcon
              style={{
                marginLeft: wp("3%"),
                marginRight: wp("3%"),
                width: wp("6%"),
                height: wp("6%"),
              }}
            />
          ) : (
            <ListIcon
              style={{
                marginLeft: wp("3%"),
                marginRight: wp("3%"),
                width: wp("6%"),
                height: wp("6%"),
              }}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => editAction()}>
          <EditIcon
            style={{
              marginLeft: wp("3%"),
              marginRight: wp("3%"),
              width: wp("6%"),
              height: wp("6%"),
            }}
          />
        </TouchableOpacity>
        {notificationsAvailable ? (
          <TouchableOpacity onPress={() => notificationAction()}>
            <NotificationRedIcon
              style={{
                marginLeft: wp("3%"),
                marginRight: wp("3%"),
                width: wp("6%"),
                height: wp("6%"),
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => notificationAction()}>
            <NotificationsIcon
              style={{
                marginLeft: wp("3%"),
                marginRight: wp("3%"),
                width: wp("6%"),
                height: wp("6%"),
              }}
            />
          </TouchableOpacity>
        )}
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

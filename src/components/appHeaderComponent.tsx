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
import Utils from "../utils";
import { useNavigation } from "@react-navigation/native";
import ListIcon from "../../assets/svgs/list_Icon.svg";
import NetworkIcon from "./../../assets/svgs/network_icon.svg";
import NetInfo from '@react-native-community/netinfo';

const AppHeaderComponent = ({ headerTitle, moduleName, headerColor, isShowNotesButton, isShowNotificationButton, notificationsAvailble, isShowGridListButton, isShowBackButton, ...props }) => {

  const navigation = useNavigation<any>();
  const [isListAction, set_isListAction] = useState(true);
  const [notificationStatus, set_notificationStatus] = useState();
  const [isConnected, setIsConnected] = useState(true);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const isPreviousNetState = useRef(true);

  useEffect(() => {
    // Subscribe to network status updates
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        if (isPreviousNetState.current == false) {
          setShowOnlineMessage(true);
        }
        isPreviousNetState.current = true
        setIsConnected(true);

        // Hide the "Back to online" message after 5 seconds
        setTimeout(() => {
          setShowOnlineMessage(false);
        }, 6000);
      } else {
        isPreviousNetState.current = false
        setIsConnected(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const editAction = () => {
    //console.log("edit action");
    navigation.navigate("NotesScreen");
  };

  const listAction = () => {
    navigation.navigate("Dashboard");
  };

  const gridAction = () => {
    navigation.navigate("DashboardListView");
  };

  const notificationAction = async () => {
    //console.log("notification icon action");
    //console.log(props);
    navigation.navigate("NotificationHome");
    var token = await Utils.getData("Token");
    //console.log("TEST token", token);
  };

  const btnAction = () => {

    //console.log("grid action ", moduleName);
    if (moduleName === "Dashboard_List") {
      listAction();
    } else {
      gridAction();
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  }

  return (
    <View style={{ flexDirection: 'column' }}>
      <View style={[styles.mainViewStyle, { backgroundColor: headerColor }]}>

        {isShowBackButton ? <TouchableOpacity style={styles.backBtnStyle} onPress={() => backBtnAction()}>
          <Image style={styles.backBtnIconStyle} source={require("./../../assets/pngs/arrow_left_black.png")} />
        </TouchableOpacity> : <View style={styles.backBtnStyle}></View>}

        <View style={[styles.headerSelectionView]}>
          <Text style={[styles.titleStyle]}>{headerTitle}</Text>
        </View>

        {isShowGridListButton ? <TouchableOpacity onPress={() => { btnAction }}>
          {moduleName === "Dashboard_List" ? (
            <GridIcon style={styles.btnIconStyle} />
          ) : (
            <ListIcon style={styles.btnIconStyle} />
          )}
        </TouchableOpacity> : null}
        {isShowNotesButton ? <TouchableOpacity onPress={() => editAction()}>
          <EditIcon style={styles.btnIconStyle} />
        </TouchableOpacity> : null}

        {isShowNotificationButton ? (notificationsAvailble ? (
          <TouchableOpacity onPress={() => notificationAction()}>
            <NotificationRedIcon style={styles.btnIconStyle} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => notificationAction()}>
            <NotificationsIcon style={styles.btnIconStyle} />
          </TouchableOpacity>
        )) : null}

      </View>
      {isConnected == false ? <View style={{ width: wp('100%'), height: 26, backgroundColor: 'red', flexDirection: "row", alignItems: 'center', justifyContent: 'center', }}>
        <View style={{ marginLeft: 10 }}>
          <NetworkIcon />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Offline Mode</Text>
        </View>
      </View > : showOnlineMessage ? (
        <View style={{ width: wp('100%'), height: 26, backgroundColor: 'green', flexDirection: "row", alignItems: 'center', justifyContent: 'center', }}>
          <View style={{ marginLeft: 10 }}>

          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
            <Text style={{ color: 'white', textAlign: 'center' }}>Back Online!</Text>
          </View>
        </View >
      ) : null}
    </View>
  );
};

export default AppHeaderComponent;

const styles = StyleSheet.create({

  mainViewStyle: {
    flexDirection: "row",
    height: hp("6%"),
    alignItems: "center",
    marginLeft: wp("2%"),
  },
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
    fontSize: fonts.fontXMedium,
    ...CommonStyles.textStyleBold,
    textAlign: "center",
    marginLeft: wp("2%"),
  },

  separatorViewStyle: {
    height: hp("0.1%"),
    width: wp("100%"),
    bottom: 0,
  },

  btnIconStyle: {
    marginLeft: wp("3%"),
    marginRight: wp("3%"),
    width: wp("6%"),
    height: wp("6%"),
  },

  backBtnStyle: {
    width: wp("8%"),
    height: wp("6%"),
    justifyContent: 'center',
    alignItems: 'center'
  },

  backBtnIconStyle: {
    width: wp("3%"),
    height: wp("3%"),
    resizeMode: 'contain',
    color: 'black'
  },

});

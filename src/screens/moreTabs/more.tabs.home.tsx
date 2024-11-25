import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MoreTabsStackParamList } from "../../navigation/types";
import HeaderComponent from "../../components/headerComponent";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../../styles/commonstyles";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AuditLogImage from "../../../assets/svgs/more_icons/auditLog.svg";
import ProfileImage from "../../../assets/svgs/more_icons/profileIcon.svg";
import RoomImage from "../../../assets/svgs/more_icons/room.svg";
import SettingsImage from "../../../assets/svgs/more_icons/settings.svg";
import DataSyncImage from "../../../assets/svgs/more_icons/data_sync.svg";
import RightArrow from "../../../assets/svgs/rightArrow.svg";
import fonts from "../../fonts/fonts";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { saveUserInfo } from "../../redux/slices/userInfo.slicer";
import Utils, { RECORD_STATUS, USER_ROLE } from "../../utils";
import NetworkManager from "../../network/network.manager";
import { UserInfo } from "../../model/rooom_preference_model";
import RoomIcon from "../../../assets/svgs/more_icons/room.svg";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetch } from "@react-native-community/netinfo";
import { showToast } from "../../components/custom.toast.message";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";
import DeviceInfo from "react-native-device-info";


type moreTabsScreenProps = NativeStackScreenProps<
  MoreTabsStackParamList,
  "MoreTabs"
>;

interface ListItem {
  id: string;
  title: string;
  description: any;
}

const data: ListItem[] = [
  {
    id: "2",
    title: "Room/ User Monitor",
    description: RoomIcon,
  },
  { id: "3", title: "My Profile", description: ProfileImage },
  { id: "4", title: "Settings", description: SettingsImage },
  { id: "5", title: "Data Sync", description: DataSyncImage },
];

const adminData: ListItem[] = [
  { id: "1", title: "Audit Log", description: AuditLogImage },
  {
    id: "2",
    title: "Room/User Monitor",
    description: RoomIcon,
  },
  { id: "3", title: "My Profile", description: ProfileImage },
  { id: "4", title: "Settings", description: SettingsImage },
  { id: "5", title: "Data Sync", description: DataSyncImage },
];

const MoreTabsScreen = ({ route }: moreTabsScreenProps) => {
  // const globalState = useSelector((state: RootState) => state.userData);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  //let isACRTLead = false;
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_More_Info);
    loadData()

  }, []);

  async function loadData() {
    let userId = await Utils.getData("UserId");
    let response: UserInfo = await NetworkManager.doGetUserInfo(userId ?? "0");
    dispatch(saveUserInfo(response));
  }

  useFocusEffect(
    React.useCallback(() => {
      getOfflineRecords();
    }, [navigation])
  );

  async function getOfflineRecords() {
    let userId = await Utils.getData("UserId");
    let recodsCount = await Utils.getAllOfflienACTRecords(userId ?? "0");
    if (recodsCount?.length > 0) {
      setStatusMessage(RECORD_STATUS.PENDING);
    } else {
      setStatusMessage('');
    }
  }

  async function dataSycn() {
    let internet = await fetch();


    if (internet?.isInternetReachable) {
      setStatusMessage("In-Progresss");
      let userId = await Utils.getData("UserId");
      await Utils.synchACTData(userId ?? '0');

      setStatusMessage(RECORD_STATUS.COMPLETED);
      setTimeout(() => {
        setStatusMessage("");
      }, 1000);
    } else {
      showToast("Please check your Internet connection and try again!", "info");
    }

  }
  function renderItem(item: ListItem, needToShow: boolean) {
    return (<Pressable
      onPress={() => {
        if (item.id === "4") {
          firebaseHelper.logEvent(firebaseHelper.Event_Settings_Button, firebaseHelper.Screen_More_Info, "");
          navigation.navigate("SettingsScreen");
        } else if (item.id === "2") {
          firebaseHelper.logEvent(firebaseHelper.Event_Room_User_Monitor_Button, firebaseHelper.Screen_More_Info, "");
          navigation.navigate("RoomUserMonitor");
        } else if (item.id === "3") {
          firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Button, firebaseHelper.Screen_More_Info, "");
          navigation.navigate("MyProfileScreen");
        } else if (item.id === "1") {
          firebaseHelper.logEvent(firebaseHelper.Event_My_Profile_Button, firebaseHelper.Screen_More_Info, "");
          navigation.navigate("AuditLogScreen");
        } else
          if (item.id === "5") {
            firebaseHelper.logEvent(firebaseHelper.Event_Data_Sync_Button, firebaseHelper.Screen_More_Info, "");
            if (statusMessage === RECORD_STATUS.PENDING) {
              dataSycn();
            }

            //check navigation and change stack here
          }
      }}
    >
      {needToShow ? <View style={styles.actionsCellViewStyle}>
        <View style={{ flex: 0.2 }}>
          <item.description style={styles.itemStyles} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.instTxtStyle]}>{item.title}</Text>
        </View>
        {item.id !== "5" ? <View style={{ flex: 0.2 }} >
          <RightArrow style={styles.moreImgStyels} />
        </View> :
          <View style={{ flex: 0.3 }}>
            <Text style={statusMessage === RECORD_STATUS.PENDING ? styles.pendingText : statusMessage === RECORD_STATUS.COMPLETED ? styles.doneText : styles.inProgressText}>{statusMessage}</Text>
          </View>
        }
      </View> : null}
    </Pressable>);
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
          moduleName={"More"}
          headerColor={"#FFF"}
        />
        <FlatList
          data={userInfo?.userInfo?.response?.isAdmin ? adminData : data}
          renderItem={({ item }) => {
            ///Removed codition for ACRT lead
            // isACRTLead = userInfo?.userInfo?.response?.userRoleList?.includes(USER_ROLE.ACRT);
            //let needToShow = item.id == "2" ? isACRTLead : true;
            //return renderItem(item, needToShow);
            return renderItem(item, true);
          }}
          keyExtractor={(item) => item.id}
        />

        <Text style={styles.versionTextStyle}>
          Version: {DeviceInfo.getBuildNumber()}
        </Text>
      </View>
    </LinearGradient>
  );
};

//Styles used in this screen are defined here
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  actionsCellViewStyle: {
    width: wp("85%"),
    height: hp("8%"),
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moreImgStyels: {
    height: hp("2%"),
    width: hp("2%"),
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  versionTextStyle: {
    ...CommonStyles.textStyleRegular,
    fontSize: fonts.fontSmall,
    color: "#000",
    position: "absolute",
    bottom: 30,
    alignSelf: "center"
  },
  itemStyles: {
    // height: hp("4%"),
    // width: hp("4%"),
    // resizeMode: "contain",
    // overflow: "hidden",
    // alignSelf: "flex-start",
  },
  instTxtStyle: {
    color: "black",
    fontSize: fonts.fontXMedium,
    ...CommonStyles.textStyleMedium,
  },
  pendingText: {
    color: "red",
    fontSize: fonts.fontXXXTiny,
    ...CommonStyles.textStyleMedium,
  },
  doneText: {
    color: "green",
    fontSize: fonts.fontXXXTiny,
    ...CommonStyles.textStyleMedium,
  },
  inProgressText: {
    color: "gray",
    fontSize: fonts.fontXXXTiny,
    ...CommonStyles.textStyleMedium,
  },
});

export default MoreTabsScreen;

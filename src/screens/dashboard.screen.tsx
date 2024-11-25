import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/types";
import HeaderComponent from "../components/headerDashboardComponent";
import GradientProgressBar from "./../components/gradientProgressBar";
import ArrowSvg from "../../assets/svgs/arrrow.svg";
import fonts from "./../fonts/fonts";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import store, { RootState } from "../redux/store";
import NetworkManager from "../network/network.manager";
import ModalComponent from "../components/modal.component";
import Utils from "../utils";
import LoadingModal from "../components/loadingModel";
import { ProgressBardResult, TasksList } from "../model/progrss_count";
import { Provider, useDispatch, useSelector } from "react-redux";
import { saveMonitorCount } from "../redux/slices/monitorCounts.slicer";
import { saveUserInfo } from "../redux/slices/userInfo.slicer";
import { updateStack } from "../redux/slices/login.slicer";
import { getDBConnection, getNotificationItems } from "./notifications/notification-db";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetch } from "@react-native-community/netinfo";
import { useTranslation } from "react-i18next";
import * as firebaseHelper from "../utilities/firebase/firebaseHelper";

type DashboardScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "Dashboard"
>;

//Interface that determines all the values used by the Data item
interface DataItem {
  monitorCount: any;
  monitorId: any;
  monitorName: string;
}
const DashboardScreen = ({ route, navigation }: DashboardScreenProps) => {
  const dispatch = useDispatch();
  const [data, set_data] = useState([]);
  const [hideModel, set_hideModel] = useState(true);
  const [userSkipped, set_userSkipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHint, set_showHint] = useState(false);
  const [pendingCountDetails, set_pendingCountDetails] = useState<TasksList[]>(
    []
  );
  const [refreshing, setRefreshing] = useState(false);
  const [progressPercentage, set_progressPercentage] = useState(0);
  const [showProgressBar, set_showProgressBar] = useState(false);
  const [notificationCount, set_notificationCount] = useState(0);
  const [notificationReadCount, set_notificationReadCount] = useState(0);
  const monitorData = useSelector((state: RootState) => state.monitorCount);
  const data2 = useSelector((state: RootState) => state.userInfo);
  const insets = useSafeAreaInsets();
  const MINUTE_MS = 30000 * 1;
  const { t } = useTranslation();

  type RenderItemProps = {
    item: DataItem;
    index: number;
  };

  const RenderItem: React.FC<RenderItemProps> = (props) => {
    if (props.item.monitorId === 5) {
      return (
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            firebaseHelper.logEvent(firebaseHelper.Event_ACT_Dashboard, firebaseHelper.Screen_Dashboard_Grid, "");
            navigation.navigate("DashboardListView", {
              selectedMonitorID: props.item.monitorId,
            });
          }}
        >
          <Text style={styles.textStyle}>{props.item.monitorName}</Text>
          <Text style={styles.textStyleLarge1}>{props.item.monitorCount}</Text>
        </TouchableOpacity>
      );
    } else if (props.item.monitorId === 203) {
      return (
        <TouchableOpacity
          onPress={() => {
            firebaseHelper.logEvent(firebaseHelper.Event_Pending_Collections_Dashboard, firebaseHelper.Screen_Dashboard_Grid, "");
            navigation.navigate("DashboardListView", {
              selectedMonitorID: props.item.monitorId,
            });
          }}
          style={styles.button2}
        >
          <Text style={styles.textStyle}>{props.item.monitorName}</Text>
          <Text style={styles.textStyleLarge2}>{props.item.monitorCount}</Text>
        </TouchableOpacity>
      );
    } else if (props.item.monitorId === 9) {
      return (
        <TouchableOpacity
          onPress={() => {
            firebaseHelper.logEvent(firebaseHelper.Event_FMT_Dashboard, firebaseHelper.Screen_Dashboard_Grid, "");
            navigation.navigate("DashboardListView", {
              selectedMonitorID: props.item.monitorId,
            });
          }}
          style={styles.button3}
        >
          <Text style={styles.textStyle}>{props.item.monitorName}</Text>
          <Text style={styles.textStyleLarge3}>{props.item.monitorCount}</Text>
        </TouchableOpacity>
      );
    }
  };

  // useEffect(() => {
  //   set_showHint(false);
  //   getMonitorCounts();
  //   getNotificationReadCount();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      set_showHint(false);
      getMonitorCounts();
      getNotificationReadCount();
    }, [navigation])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      set_showHint(false);
      getMonitorCounts();
      getNotificationReadCount();
      setRefreshing(false);
    }, 1000);
  };
  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Dashboard_Grid);
    // Do something on mount
    const fetchData = async () => {
      try {
        var userSkippedBiometrics = await Utils.getData(
          "userSkippedBiometrics"
        );
        if (userSkippedBiometrics === "true") {
          set_userSkipped(true);
        } else {
          set_userSkipped(false);
        }
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };
    fetchData();
    getUserInfo();
    //scduleSyncData(); //Alredy add network change listner request for this method.
  }, []);

  async function scduleSyncData() {
    let userID = await Utils.getData("UserId");
    let internet = await fetch();
    let count = await Utils.getAllOfflienACTRecords(userID ?? '0');

    if (count?.length > 0 && internet?.isInternetReachable) {
      const interval = setInterval(async () => {


        Utils.synchACTData(userID ?? '0');
      }, MINUTE_MS);
    }
  }
  async function getUserInfo() {
    let userId = await Utils.getData("UserId");
    let res1 = await NetworkManager.doGetUserInfo(userId!);

    dispatch(saveUserInfo(res1));

    if (res1?.status?.httpStatus === 400) {
      Alert.alert(
        "Fail",
        "The server was unable to process the request. Please try again after some time.",
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
    } else if (res1?.status?.httpStatus === 401) {
      Alert.alert(
        "Fail",
        res1?.errors[0]?.message ?? "",
        [
          {
            text: "Login again",
            onPress: async () => {
              await Utils.clearUserData();
              dispatch(updateStack({ stackName: "Auth" }));
            },
          },
        ],
        { cancelable: false }
      );
    }
  }
  async function getMonitorCounts() {
    setLoading(true);
    try {
      let countRes = await NetworkManager.getDashboardMonitorCounts("", 1);
      if (countRes?.status?.success) {
        let res = countRes.response.monitors.sort(
          (a: { monitorName: number }, b: { monitorName: number }) =>
            a.monitorName < b.monitorName ? -1 : 1
        );
        //set_data(res);
        dispatch(saveMonitorCount(res));
        set_notificationCount(countRes?.response?.notificationCount);
        getDashboardPendingTasksCount();
      } else if (countRes?.status?.httpStatus === 400) {
        Alert.alert(
          "Fail",
          "The server was unable to process the request. Please try again after some time.",
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
      } else if (countRes?.status?.httpStatus === 401) {
        Alert.alert(
          "Fail",
          countRes?.errors[0]?.message ?? "",
          [
            {
              text: "Login again",
              onPress: async () => {
                await Utils.clearUserData();
                dispatch(updateStack({ stackName: "Auth" }));
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error("Invalid details", countRes?.errors?.message);
        Alert.alert(
          "Alert",
          t('network_error'),
          [
            {
              text: "Okay",
              onPress: () => {
                navigation.pop();
                // dispatch(updateStack({ stackName: "Auth" }));
              },
            },
          ],
          { cancelable: false }
        );
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.error("Error", e);
    } finally {

      //continuing loading since we are calling another service from here
    }
  }

  /**
   * get all read notification count.
   * 
   */
  async function getNotificationReadCount() {
    try {
      let db = await getDBConnection();
      let userId: string = await Utils.getData("UserId") ?? "";
      const getlist = await getNotificationItems(db, userId);
      set_notificationReadCount(getlist.length ?? 0);
    } catch (e) {
      console.error("Notificaiton Error", e);
    }

  }
  function getColorArray(percent: number) {
    if (percent <= 30) {
      return ["#00FF0A", "#00FF0A", "#00FF0A"];
    } else if (percent > 30 && percent <= 50) {
      return ["#00FF0A", "#FFB018"];
    } else if (percent > 50 && percent <= 80) {
      return ["#00FF0A", "#FFB018", "#FFB018"];
    } else {
      return ["#00FF0A", "#FFB018", "#CD1D1D"];
    }
  }

  async function getDashboardPendingTasksCount() {
    try {
      let pendingCountRes: ProgressBardResult =
        await NetworkManager.getDashboardPendingTasksCount("");
      if (pendingCountRes?.status?.success) {

        set_progressPercentage(pendingCountRes.response.progressBarCount);
        set_showProgressBar(true);
        set_pendingCountDetails(pendingCountRes?.response?.tasksList);
      } else if (pendingCountRes?.status?.httpStatus === 400) {
        Alert.alert(
          pendingCountRes?.errors[0].message ??
          "The server was unable to process the request. Please try again after some time."
        );
      } else if (pendingCountRes?.status?.httpStatus === 401) {
        Alert.alert(
          "Fail",
          pendingCountRes?.errors[0]?.message ?? "",
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
      } else {
        console.error("Invalid details", pendingCountRes?.errors[0]?.message);
        Alert.alert(
          "API faild",
          pendingCountRes?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
        setLoading(false);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  }
  //need to check readstatus.
  let notificationsAvailable = notificationCount > 0 ? notificationReadCount !== notificationCount : false;
  return (
    <Provider store={store}>
      <SafeAreaView style={[styles.mainContainer, { paddingTop: insets.top }]}>
        <HeaderComponent
          navigation={navigation}
          route={undefined}
          moduleName={"Dashboard"}
          headerColor={"#FFF"}
          notificationsAvailable={notificationsAvailable}
        ></HeaderComponent>

        <TouchableOpacity
          style={styles.progressBackground}
          onPress={() => {
            if (showHint) {
              set_showHint(false);
            } else {
              set_showHint(true);
            }
          }}
        >
          {showProgressBar ? (
            <GradientProgressBar
              progress={progressPercentage}
              colors={getColorArray(progressPercentage)}
            />
          ) : null}
        </TouchableOpacity>

        <FlatList
          data={monitorData?.monitorCount}
          renderItem={(item) => <RenderItem item={item.item} index={0} />}
          keyExtractor={(item) => item.key}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          numColumns={2}
        />

        <LoadingModal visible={loading} text="Loading..." />

        {showHint ? (
          <View style={[styles.hintStyle, { paddingTop: insets.top }]}>
            <ArrowSvg style={styles.image}></ArrowSvg>
            <View style={styles.hintbackground}>
              {pendingCountDetails.map((key) => (
                <Text style={styles.text}>
                  {key.taskBarName}: {key.count}
                </Text>
              ))}
            </View>
          </View>
        ) : null}
        <ModalComponent
          isModalVisible={false}
          title={"Alert"}
          subTitle=""
          imageSource={require("../../assets/svgs/paws_logo.svg")}
          subDescription={"Or you can enable it from settings later."}
          description="Would you like to enable Biometrics?"
          buttonText={"No"}
          buttonCallback={() => {
            set_hideModel(false);
            set_userSkipped(false);
            Utils.storeData("userSkippedBiometrics", "true");
          }}
          buttonTwoText="Yes"
          buttonTwoCallback={() => {
            set_hideModel(false);
            Utils.storeData("isBiometricsEnabled", "true");
          }}
        />
      </SafeAreaView>
    </Provider >
  );
};

//Styles used in this screen are defined here
const styles = StyleSheet.create({
  image: {
    flex: 1,
    marginLeft: wp("45%"),
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  fullFlex: {
    flex: 1,
  },
  text: {
    color: "white",
    fontSize: fonts.fontSmall,
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginTop: hp("0.75%"),
    fontFamily: "Lexend-Regular",
  },
  imageWrapper: {
    flex: 0.8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addedImage: {
    width: "100%",
    height: "80%",
  },
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#FFFFF",
    paddingHorizontal: 50,
  },
  innerview: {
    flexDirection: "row",
    justifyContent: "space-between",
    //margin:10
  },
  button1: {
    backgroundColor: "#e7f4f9",
    padding: 10,
    marginLeft: wp("3%"),
    marginRight: wp("2%"),
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    width: wp("45%"),
    height: hp("32%"),
    borderRadius: 25,
  },

  button2: {
    backgroundColor: "#ffeede",
    padding: 10,
    marginLeft: wp("1%"),
    marginRight: wp("2%"),
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    width: wp("45%"),
    height: hp("32%"),
    borderRadius: 25,
  },

  button3: {
    backgroundColor: "#f9f2de",
    padding: 10,
    marginLeft: wp("3%"),
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
    width: wp("45%"),
    height: hp("32%"),
    borderRadius: 25,
  },

  button4: {
    backgroundColor: "#eef1db",
    padding: 15,
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
    width: wp("45%"),
    height: hp("32%"),
    borderRadius: 25,
  },
  countContainer: {
    alignItems: "center",
    padding: 10,
  },
  textStyle: {
    color: "#000",
    fontSize: fonts.fontNormal,
    marginTop: hp("2%"),
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Lexend-Regular",
  },
  textStyleLarge1: {
    color: "#3c8ae6",
    fontSize: fonts.fontXXXXXLarge,
    marginTop: hp("3%"),
    fontFamily: "Lexend-Regular",
  },
  textStyleLarge2: {
    color: "#ff6f0c",
    fontSize: fonts.fontXXXXXLarge,
    marginTop: hp("3%"),
    fontFamily: "Lexend-Regular",
  },
  textStyleLarge3: {
    color: "#e29b12",
    fontSize: fonts.fontXXXXXLarge,
    marginTop: hp("3%"),
    fontFamily: "Lexend-Regular",
  },
  textStyleLarge4: {
    color: "#7d9200",
    fontSize: fonts.fontXXXXXLarge,
    marginTop: hp("3%"),
    fontFamily: "Lexend-Regular",
  },
  hintbackground: {
    backgroundColor: "#136DA3",
    width: wp("50%"),
    minHeight: hp("8%"),
    borderRadius: 12,
    alignSelf: "center",
    marginLeft: wp("2.25%"),
    marginTop: hp("-1%"),
  },
  progressBackground: {
    backgroundColor: "#D9D9D9",
    marginLeft: wp("5%"),
    marginRight: wp("6%"),
    borderRadius: 20,
    marginTop: hp("1%"),
    marginBottom: hp("1%"),
  },
  hintStyle: {
    marginLeft: wp("5%"),
    marginRight: wp("6%"),
    position: "absolute",
    top: hp("11%"),
    minHeight: hp("10%"),
  },
  progressBarStyle: {
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
  },
});

export default DashboardScreen;

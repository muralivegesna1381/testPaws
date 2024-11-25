import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  Animated,
  Alert,
  Button,
  Pressable,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  GestureHandlerRootView,
  Swipeable,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import NetworkManager from "../../network/network.manager";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import TrashIcon from "../../../assets/svgs/trash.svg";
import ReadIcon from "../../../assets/svgs/read.svg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import HeaderComponent from "../../components/headerComponent";
import CommonStyles from "../../styles/commonstyles";
import { updateStack } from "../../redux/slices/login.slicer";
import Utils from "../../utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Colors from "../../styles/color";
import {
  createTable,
  deleteAllNotificaion,
  deleteNotifyItem,
  deleteTableNotifications,
  getDBConnection,
  getNotificationItems,
  getNotificationReadStatus,
  saveNotifiyItem,
  saveNotifiyItemsList,
} from "./notification-db";
import { SQLiteDatabase } from "react-native-sqlite-storage";
import LoadingModal from "../../components/loadingModel";
import { useTranslation } from "react-i18next";
import { showToast } from "../../components/custom.toast.message";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";


type NotificationProps = {
  navigation: any;
};

export type NotificationObject = {
  notificationId: number;
  description: string;
  notificationDate: string;
  createdUser: string;
};

let db: SQLiteDatabase;
let userId = "";
const NotificationHome: React.FC<NotificationProps> = (props) => {
  const [dataListNew, setDataListNew] = useState<NotificationObject[]>();
  const [totalRecods, setTotalRecods] = useState(-1);
  const [readList, setReadList] = useState<NotificationObject[]>([]);
  const route = useRoute();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const globalState = useSelector((state: RootState) => state.userData);
  const { t } = useTranslation();
  // const [userId] = useState<number>(globalState?.userInfo?.response.userDetails.userInfoId);
  //userId = globalState?.userInfo?.response?.userDetails?.userInfoId;
  // ref
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ["25%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) setOpen(false);
  }, []);
  const [open, setOpen] = useState(false);

  async function loadAsyncData() {
    try {
      setLoading(true)
      //Store in local db
      db = await getDBConnection();
      await createTable(db);
      userId = (await Utils.getData("UserId")) ?? "";
      let response = await NetworkManager.getUserNotifications(userId, 0, 100);
      if (response?.status?.httpStatus == 200) {
        setTotalRecods(response?.response?.totalRecords ?? 0);
        let dataList: NotificationObject[] = response.response.rows;
        //Convering date formate

        dataList.forEach((element, index) => {
          var dateString = element.notificationDate; // Oct 23
          dataList[index].notificationDate = Utils.getConvertedDate(
            dateString,
            "MMM-DD-YYYY",
            "MMM-DD"
          );
        });
        try {
          //await deleteTableNotifications(db);

          //const sored = await saveNotifiyItems(db, dataList);

          const getlist = await getNotificationItems(db, userId);
          if (getlist) setReadList(getlist);
        } catch (e) {
          console.error(e);
        }

        setDataListNew(dataList);
      } else if (response?.status?.httpStatus == 401) {
        Alert.alert(
          "Fail",
          response?.errors[0]?.message ?? "",
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
  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Notifications);
    loadAsyncData();
  }, []);

  const checkReadStatus = (notificationId: number) => {
    let result = readList.find(
      (item) => item.notificationId === notificationId
    );
    return result ? true : false;
  };
  const Item = (item: NotificationObject) => (
    <Swipeable
      renderRightActions={renderRightActions(item.notificationId)}
      rightThreshold={75}
      renderLeftActions={renderLeftActions(item.notificationId)}
      leftThreshold={75}
    >
      <View style={[styles.itemStyle, { flexDirection: "column" }]}>
        <View style={styles.unreadViewStyle}>
          {
            <View
              style={
                !checkReadStatus(item.notificationId)
                  ? styles.unreadViewDotStyle
                  : styles.readViewDotStyle
              }
            />
          }
          <Text style={styles.title}>{item.description}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 10,
          }}
        >
          <Text style={styles.subContent}>{item.createdUser}</Text>
          <Text style={styles.subContent}>{item.notificationDate}</Text>
        </View>
      </View>
    </Swipeable>
  );
  //https://cquelle.com/swipe-to-delete-react-native/
  const renderRightActions =
    (notificationID: number) =>
      (
        progress: Animated.AnimatedInterpolation<any>,
        dragX: Animated.AnimatedInterpolation<any>
      ) => {
        const opacity = dragX.interpolate({
          inputRange: [-50, 0],
          outputRange: [1, 0],
          extrapolate: "clamp",
        });

        //Close menu
        bottomSheetModalRef.current?.close();
        return (
          <View style={styles.swipedRow}>
            <Animated.View style={[styles.deleteButton, { opacity }]}>
              <TouchableOpacity
                onPress={async () => {
                  //let userId = await Utils.getData("UserId") ?? "";
                  Alert.alert(
                    "",
                    t('notifications.delete_notification'),
                    [
                      {
                        text: "No",
                        onPress: () => {
                          //do nothing
                        },
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          setLoading(true);
                          (async function deleteFunction() {

                            try {
                              setLoading(true);
                              firebaseHelper.logEvent(firebaseHelper.Event_Notification_Delete, firebaseHelper.Screen_Notifications, "");
                              let response = await NetworkManager.deleteNotification(
                                userId,
                                notificationID
                              );
                              if (response?.status?.success) {
                                //Alert.alert(response?.response?.message);
                                //Delte from local db also
                                try {
                                  let result = await deleteNotifyItem(db, notificationID);
                                } catch (e) {
                                  console.error(e);
                                }
                                // Utils.showToastMessage(
                                //   "Notification is deleted and cannot be retrieved."
                                // );
                                showToast("Notification is deleted and cannot be retrieved.", "success");
                                loadAsyncData();
                              } else {
                                Alert.alert("Error:", response.errors[0]?.message ?? "");
                                console.error(
                                  "Delete Notification ",
                                  response.errors[0]?.message
                                );
                              }
                            } catch (e) {

                            } finally {
                              setLoading(false);
                            }

                          })();
                        },
                      },
                    ],
                    { cancelable: false }
                  );

                }}
              >
                <TrashIcon style={styles.imageStyle} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        );
      };
  const readAllFunction = async () => {
    firebaseHelper.logEvent(firebaseHelper.Event_Notifications_Read_All, firebaseHelper.Screen_Notifications, "");
    //let userId = await Utils.getData("UserId") ?? "";
    let result = await saveNotifiyItemsList(db, dataListNew ?? [], userId);

    if (result) {
      // Alert.alert("Notifications all are read!");
      showToast("No notifications to read.", "success");
      loadAsyncData();
    } else {
      showToast("Unable to mark all as read!", "success");
    }
  };

  const deleteAllFunction = async () => {
    try {
      setLoading(true);
      let allNotificaionIds = "";
      dataListNew?.forEach((element) => {
        allNotificaionIds = allNotificaionIds + element.notificationId + ",";
      });
      //let userId = await Utils.getData("UserId") ?? "";
      if (allNotificaionIds) {
        let response = await NetworkManager.deleteNotification(
          userId,
          allNotificaionIds
        );
        if (response?.status?.success) {
          //Alert.alert(response?.response?.message);
          try {
            let result = await deleteAllNotificaion(db, userId);
          } catch (e) {
            console.error(e);
          }
          // Utils.showToastMessage(
          //   "All Notification are deleted and cannot be retrieved."
          // );
          showToast("All Notification are deleted and cannot be retrieved.", "success");
          loadAsyncData();
        } else {
          Alert.alert("Error:", response.errors[0]?.message ?? "");
        }
      } else {
        showToast("No notifications to delete.", "success");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  //left action
  const renderLeftActions =
    (notificationID: number) =>
      (
        progress: Animated.AnimatedInterpolation<any>,
        dragX: Animated.AnimatedInterpolation<any>
      ) => {
        const opacity = dragX.interpolate({
          inputRange: [-50, 0],
          outputRange: [0, 1],
          extrapolate: "clamp",
        });
        //Close menu
        bottomSheetModalRef.current?.close();
        return (
          <View style={styles.swipedLeftRow}>
            <Animated.View style={[styles.readButton, { opacity }]}>
              <TouchableOpacity
                onPress={async () => {
                  //Need to store local db for read status.
                  if (dataListNew !== undefined) {
                    let index =
                      dataListNew?.findIndex(
                        (item) => item.notificationId === notificationID
                      ) ?? -1;
                    if (index >= 0) {
                      let readNotifcaion = dataListNew[index] ?? 0;
                      if (readNotifcaion) {
                        firebaseHelper.logEvent(firebaseHelper.Event_Notification_Read, firebaseHelper.Screen_Notifications, "");
                        let result = await saveNotifiyItem(
                          db,
                          readNotifcaion,
                          userId
                        );
                        //Notification marked as read.
                        //Utils.showToastMessage("Notification marked as read.");
                        showToast("Notification is marked as read successfully!", "success");
                        setDataListNew(dataListNew);
                        //Need to check otheway to close
                        loadAsyncData();
                        //opacity.removeAllListeners()
                      }
                    }

                  }
                }}
              >
                <ReadIcon style={styles.imageStyle} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        );
      };
  const backBtnAction = () => {
    props.navigation.pop();
  };
  const menuAction = () => {
    //bottomSheetModalRef.current?.present();
    //handlePresentModalPress();
    if (!open) {
      setOpen(true);
      bottomSheetModalRef.current?.present();
    } else {
      setOpen(false);
      bottomSheetModalRef.current?.close();
    }
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          navigation={undefined}
          route={undefined}
          moduleName={"Notifications"}
          headerColor={"#FFFFFF"}
          backBtnAction={backBtnAction}
          menuAction={menuAction}
        />
        {totalRecods == 0 ? (
          <Text
            style={[CommonStyles.subHeaderTextStyle, { textAlign: "center" }]}
          >
            No notifications available
          </Text>
        ) : (
          <FlatList
            data={dataListNew}
            renderItem={({ item }) => (
              /// Convering notification date format
              <Item
                notificationId={item.notificationId}
                description={item.description}
                notificationDate={item.notificationDate}
                createdUser={item.createdUser}
              />
            )}
            keyExtractor={(item) => item.notificationId.toString()}
          />
        )}

        <LoadingModal visible={loading} text="Loading..." />

        <BottomSheetModal
          ref={bottomSheetModalRef}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ backgroundColor: "transparent" }}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <Pressable
              onPress={() => {
                bottomSheetModalRef.current?.close();
                if (totalRecods == 0) {
                  Alert.alert("No records to delete.");
                } else {
                  Alert.alert(
                    "",
                    t('notifications.delete_all'),
                    [
                      {
                        text: "No",
                        onPress: () => {
                          //do nothing
                        },
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          firebaseHelper.logEvent(firebaseHelper.Event_Notifications_Delete_All, firebaseHelper.Screen_Notifications, "");
                          deleteAllFunction();
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }
              }}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed
                      ? CommonStyles.textPressedStyle
                      : CommonStyles.textStyleRegular,
                    { fontSize: 16, margin: 8 },
                  ]}
                >
                  Delete All
                </Text>
              )}
            </Pressable>
            {divider()}
            <Pressable
              onPress={() => {
                bottomSheetModalRef.current?.close();
                if (totalRecods == 0) {
                  Alert.alert("No records to read.");
                } else {
                  readAllFunction();
                }
              }}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed
                      ? CommonStyles.textPressedStyle
                      : CommonStyles.textStyleRegular,
                    { fontSize: 16, margin: 8 },
                  ]}
                >
                  Mark all as read
                </Text>
              )}
            </Pressable>
            {divider()}
            <Pressable
              onPress={() => {
                bottomSheetModalRef.current?.close();
              }}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed
                      ? CommonStyles.textPressedStyle
                      : CommonStyles.textStyleRegular,
                    { fontSize: 16, margin: 8 },
                  ]}
                >
                  Cancel
                </Text>
              )}
            </Pressable>
            {divider()}
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const divider = () => {
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View
        style={{
          borderBottomColor: Colors.LIGHT_GRAY,
          flex: 1,
          height: 0.5,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#FFFFFF",
  },
  itemStyle: {
    backgroundColor: "#F9F9F9",
    padding: 10,
    marginVertical: 1,
    paddingHorizontal: wp("5%"),
  },
  contentContainer: {
    marginTop: hp("2%"),
    alignItems: "center",
    borderColor: Colors.LIGHT_GRAY,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomColor: "white",
    shadowColor: Colors.LIGHT_GRAY,
    borderWidth: 2,
    justifyContent: "center",
  },
  rowItemStyle: {
    fontFamily: "Lexend-Regular",
  },

  unreadViewStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "black",
    margin: 10,
  },
  unreadViewDotStyle: {
    backgroundColor: "#3ACA51",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  readViewDotStyle: {
    backgroundColor: Colors.DISABLE_COLOR,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },

  title: {
    fontSize: 14,
    fontFamily: "Lexend-Regular",
    fontWeight: "300",
  },
  subContent: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Lexend-Regular",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingLeft: 5,
    backgroundColor: "#efefef",
    padding: 2,
  },
  swipedRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6F0C",
    margin: 2,
  },
  swipedLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B1E7BA",
    margin: 2,
  },
  swipedConfirmationContainer: {
    flex: 1,
  },
  deleteConfirmationText: {
    color: "#fcfcfc",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF6F0C",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },
  readButton: {
    backgroundColor: "#B1E7BA",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },
  deleteButtonText: {
    color: "#fcfcfc",
    fontWeight: "bold",
    padding: 3,
  },
  imageStyle: {
    width: wp("30%"),
    height: hp("20%"),
  },
});
export default NotificationHome;

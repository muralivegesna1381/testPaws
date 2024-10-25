import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimalStackParamList } from "../../navigation/types";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../../styles/commonstyles";
import HeaderComponent from "../../components/headerComponent";
import { useTranslation } from "react-i18next";
import { Keyboard } from 'react-native'


import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Colors from "../../styles/color";
import { useDispatch } from "react-redux";

import CustomChip from "../../components/custom_chip";
import fonts, { fontFamily } from "../../fonts/fonts";
import RecordIcon from "../../../assets/svgs/record.svg";
import Utils, { ACT_OPERATIONS, ACT_REQUEST_BODY } from "../../utils";
import BottomButtonComponent from "../../components/button.component";
import LoadingModal from "../../components/loadingModel";
import NetworkManager from "../../network/network.manager";
import Voice from "@react-native-voice/voice";
import moment from "moment";
import MeasurementPageStyles from "../../styles/measurments.page.style";
import DropDownButton from "./../../../assets/svgs/down_arrow.svg";
import SelectionBottomSheet, { UserType } from "../../components/bottomSelectionSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { updateStack } from "../../redux/slices/login.slicer";
import { Calendar } from "react-native-calendars";
import DashboardStyles from "../../styles/dashboard.style";
import { RecordGrpuActReponse } from "../../model/act_record_group_respons";
import { Act, RecordGrpuActRequst } from "../../model/act_save_object_model";
import { ActResultRequest } from "../../model/act_result_request";
import { showToast } from "../../components/custom.toast.message";
import { AnimalResponse } from "../../model/schedule_animals";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

type AnimalScreenProps = NativeStackScreenProps<
  AnimalStackParamList,
  "Submission"
>;

var width = Dimensions.get("window").width;
const AnimalACTSubmission = ({ route, navigation }: AnimalScreenProps) => {
  const { t } = useTranslation();
  const [chipsData, set_chipsData] = useState<ChipdDataMode[]>([]);
  const [commentsText, setCommentsText] = useState("");
  const { operation, selectedAnimals, type, onRquiredRefrs } = route.params;
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedPerformedDate, setSelectedPerformedDate] = useState<string>("");
  const [alertMsg, set_alertMsg] = useState<string>("")
  const insets = useSafeAreaInsets();
  const dateFormat = "YYYY-MM-DD";

  const [isLoading, set_isLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const today = moment().format("YYYY-MM-DD");
  const [modalVisible, setModalVisible] = useState(false);
  const [performedBy, setPerformedBy] = useState<UserType>();
  const [isBottomSheetVisible, setBottomSheetVisible] =
    useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [bottomSheetData, setBottomSheetData] = useState<
    UserType[]
  >([]);
  const [actResponse, set_actResponse] = useState<Act[]>([]);
  const [selectedAnimalsList, set_SelectedAnimalsList] = useState<AnimalResponse[]>(selectedAnimals);
  let inputTextBeforeVoice = useRef<string>('')
  const dispatch = useDispatch();


  type ChipdDataMode = {
    title: string,
    scheduleId: number
  }
  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Submit_Tasks);

    if (operation === ACT_OPERATIONS.RESCHEDULE) {
      set_alertMsg("Are you sure you want to Reschedule?");
    }
    else if (operation === ACT_OPERATIONS.MARK_AS_COMPLETE) {
      set_alertMsg("Are you sure you want to mark the task(s) as complete");
    }
    else if (operation === ACT_OPERATIONS.MARK_AS_FAILED) {
      set_alertMsg("Are you sure you want to mark the task(s) as Failed");
    }
    else if (operation === ACT_OPERATIONS.NOT_PERFORMED) {
      set_alertMsg("Are you sure you want to mark the task(s) as Not Performed");
    }
    if (type === 1) {
      prepareDatesData();
    } else if (type === 2) {
      prepareAnimalTattoData();
    } else if (type == 3) {
      prepareAnimalTattoData();
      getACTGroupResults(selectedAnimalsList);
    }
    fetchDefaultValues();

    async function fetchDefaultValues() {
      var userId = await Utils.getData("UserId") ?? '0';
      var fName = await Utils.getData("firstName") ?? '';
      var lName = await Utils.getData("lastName") ?? '';
      let defaultCurrentUser: UserType = {
        userName: fName + " " + lName,
        userInfoId: Number(userId)
      };
      setPerformedBy(defaultCurrentUser);

    }
    var currentDate = moment().format("YYYY-MM-DD");
    setSelectedDate(currentDate);
    setSelectedPerformedDate(currentDate);
    // Add event listeners when the component mounts
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    // Cleanup event listeners when the component unmounts
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    //setRecognizedText("");
    // setIsListening(true);
    try {
      await Voice.start("en-US"); // Change to your desired language
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    // setIsListening(false);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const onSpeechStart = () => {
  };

  const onSpeechEnd = () => {
    //setIsListening(false);
    inputTextBeforeVoice.current = ''
  };

  const onSpeechResults = (e: any) => {
    if (e.value && e.value.length > 0) {
      let previousText = `${inputTextBeforeVoice.current} ${e.value[0]}`;
      if (previousText.length > 500) {
        stopListening();
      }
      else if (e.value && e.value.length > 0) {
        setRecognizedText(previousText);
      }

    }
  };

  const onSpeechError = (e: any) => {
    console.error("Speech error:", e.error);
  };

  const handleDateChange = (date: Date) => {
    var currentDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(currentDate);
    setSelectedPerformedDate(currentDate);
  };

  async function getACTGroupResults(animalList: any) {
    set_isLoading(true);
    try {
      var userId = await Utils.getData("UserId");
      let actReqBody: ActResultRequest = {
        actId: animalList[0].actId,
        flow: type == 3 ? "RECORD_GROUP_ACT" : "",
        taskType: ACT_REQUEST_BODY.ACT_MEASUREMENT, //Taking 1 by deafult for ACT operation measurements
        userInfoId: Number(userId),
        animals: animalList,
      };
      let getACTGroupResults = await NetworkManager.getACTResults(actReqBody);
      if (getACTGroupResults?.status?.httpStatus === 200) {
        let results: RecordGrpuActReponse = getACTGroupResults;
        //console.log("Response", JSON.stringify(results.response.acts));
        set_actResponse(results.response.acts);
      } else if (getACTGroupResults?.status?.httpStatus == 401) {
        Alert.alert(
          "Fail",
          getACTGroupResults?.errors ? getACTGroupResults?.errors[0].message : "API error",
          [
            {
              text: "Login again",
              onPress: () => {
                // console.log("OK Pressed");
                dispatch(updateStack({ stackName: "Auth" }));
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Fail!",
          getACTGroupResults?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }
  async function rescheduleACT() {
    set_isLoading(true);
    let ids = prepareSceduleIDs();
    try {
      let rescheduleACT = await NetworkManager.actReschedule(
        commentsText,
        ids,
        selectedDate
      );
      set_isLoading(false);
      if (rescheduleACT?.status?.success && rescheduleACT?.response) {
        //console.log("Res main", rescheduleACT.response);
        Alert.alert("Alert!", rescheduleACT.response.message, [
          {
            text: "OK", onPress: () => {
              onRquiredRefrs(true);
              navigation.goBack()
            }
          },
        ]);
      }
      else if (rescheduleACT?.status?.httpStatus === 400) {
        onRquiredRefrs(false);
        if (rescheduleACT?.errors[0]?.message?.length > 0)
          Alert.alert("Alert!", rescheduleACT?.errors?.message);

      } else {
        onRquiredRefrs(false);
        Alert.alert("Alert!", rescheduleACT.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }

  async function _saveResults(actfinalList: Act[]) {
    let convertedDate = Utils.getConvertedDate(selectedDate, "YYYY-MM-DD", "DD-MMM-YYYY");
    // console.log(
    //   "act::::::: fd",
    //   JSON.stringify(actfinalList)
    // );
    let tepmActs: Act[] = [...actfinalList];
    tepmActs.forEach((item) => {
      item.isReadyForSave = true
      item.scheduleDate = convertedDate
      item.results.forEach((itemVal) => {
        itemVal.comments = commentsText;

      });
    });


    // tepmActs[0].results = [oneReulst];

    //console.log("act:::::::act tepmActs", selectedDate, convertedDate);
    var userId = await Utils.getData("UserId");
    let requestBody: RecordGrpuActRequst = {
      performedBy: performedBy?.userInfoId ?? 0,
      performedDate: convertedDate, //selectedDate,//,
      actId: selectedAnimalsList[0].actId,
      userInfoId: Number(userId),
      acts: tepmActs
    };
    try {
      set_isLoading(true)
      let result = await NetworkManager.saveGroupActResults(requestBody);
      //console.log("result", result);
      if (result?.status?.httpStatus === 200) {
        //let response: RecordGrpuActReponse = result;
        //Utils.showToastMessage("Records are saved!");
        showToast("Records are saved!", "success");
        navigation.pop();
        navigation.pop();
      } else if (result?.status?.httpStatus == 401) {
        Alert.alert(
          "Fail",
          result?.errors[0]?.message ?? "",
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
        if (result?.errors != undefined && result?.errors[0]?.message?.length > 0)
          Alert.alert("Fail!", result?.errors[0]?.message ?? "PAWS system error");
        else
          Alert.alert("Fail!", "Invalid response");
      }
    } catch (e) {
      console.error(e)
    } finally {
      set_isLoading(false)
    }
  }


  async function markAsCompleteACT() {
    let ids = prepareSceduleIDs();
    if (performedBy == null) {
      Alert.alert("Alert!", "Please select Performed By");
      return;
    }
    if (selectedPerformedDate == "") {
      Alert.alert("Alert!", "Please select Performed On");
      return;
    }

    set_isLoading(true);
    try {
      let getScheduledAnimalsList = await NetworkManager.actMarkAsComplete(
        commentsText,
        ids,
        performedBy.userInfoId,
        selectedPerformedDate
      );
      //console.log("getScheduledAnimalsList", getScheduledAnimalsList);
      set_isLoading(false);
      if (
        getScheduledAnimalsList.status.success &&
        getScheduledAnimalsList.response
      ) {
        //console.log("Res main", getScheduledAnimalsList.response);
        Alert.alert("Alert!", getScheduledAnimalsList.response.message, [
          {
            text: "OK", onPress: () => {
              onRquiredRefrs(true);
              navigation.goBack()
            }
          },
        ]);
      } else if (getScheduledAnimalsList?.status?.httpStatus == 401) {
        onRquiredRefrs(false);

        Alert.alert(
          "Fail",
          getScheduledAnimalsList?.errors ? getScheduledAnimalsList?.errors[0].message : "API error",
          [
            {
              text: "Login again",
              onPress: () => {
                // console.log("OK Pressed");
                dispatch(updateStack({ stackName: "Auth" }));
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        onRquiredRefrs(false);
        Alert.alert(
          "Alert!",
          getScheduledAnimalsList?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }
  async function notPerformedACT() {
    set_isLoading(true);
    let ids = prepareSceduleIDs();
    try {
      let getScheduledAnimalsList = await NetworkManager.actNotPerformed(
        commentsText,
        ids
      );
      set_isLoading(false);
      if (
        getScheduledAnimalsList.status.success &&
        getScheduledAnimalsList.response
      ) {
        Alert.alert("Alert!", getScheduledAnimalsList.response.message, [
          {
            text: "OK", onPress: () => {
              onRquiredRefrs(true);
              navigation.goBack()
            }
          },
        ]);
      } else if (getScheduledAnimalsList?.status?.httpStatus == 401) {
        onRquiredRefrs(false);

        Alert.alert(
          "Fail",
          getScheduledAnimalsList?.errors ? getScheduledAnimalsList?.errors[0].message : "API error",
          [
            {
              text: "Login again",
              onPress: () => {
                // console.log("OK Pressed");
                dispatch(updateStack({ stackName: "Auth" }));
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        onRquiredRefrs(false);

        Alert.alert(
          "Alert!",
          getScheduledAnimalsList?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }
  async function markAsFailedACT() {
    set_isLoading(true);
    let ids = prepareSceduleIDs();
    try {
      let markAsFailedACT = await NetworkManager.actMarkAsFailed(
        ids,
        commentsText
      );
      set_isLoading(false);
      if (markAsFailedACT.status.success && markAsFailedACT.response) {
        Alert.alert("Alert!", markAsFailedACT.response.message, [
          {
            text: "OK", onPress: () => {
              onRquiredRefrs(true);
              navigation.goBack()
            }
          },
        ]);
      } else if (markAsFailedACT?.status?.httpStatus == 401) {
        onRquiredRefrs(false);

        Alert.alert(
          "Fail",
          markAsFailedACT?.errors ? markAsFailedACT?.errors[0].message : "API error",
          [
            {
              text: "Login again",
              onPress: () => {
                // console.log("OK Pressed");
                dispatch(updateStack({ stackName: "Auth" }));
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        onRquiredRefrs(false);

        Alert.alert(
          "Alert!",
          markAsFailedACT?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }

  function prepareSceduleIDs() {
    let ids = "";
    selectedAnimalsList.forEach((ob) => {
      if (ids == "") {
        ids = ids + ob.actScheduleId;
      }
      else {
        ids = ids + "," + ob.actScheduleId;
      }

    });
    return ids;
  }

  function prepareDatesData() {
    let ids: ChipdDataMode[] = [];
    selectedAnimalsList.forEach((ob) => {
      ids.push({ scheduleId: ob.actScheduleId, title: ob.scheduledDate })

    });
    //console.log("DATES::::", ids);
    set_chipsData(ids);
  }

  function prepareAnimalTattoData() {
    let ids: ChipdDataMode[] = [];
    selectedAnimalsList.forEach((ob) => {
      //ids = ids + ob.animalNameTattoo + ",";
      ids.push({ scheduleId: ob.actScheduleId, title: ob.animalNameTattoo });
    });
    set_chipsData(ids);
  }

  async function getLookUpUsers() {
    set_isLoading(true);
    try {
      var userId = await Utils.getData("UserId");
      let getACTGroupResults = await NetworkManager.getLookUpUsers();
      if (getACTGroupResults?.status?.httpStatus === 200) {
        // set_actResponse(results.response);
        setBottomSheetData(getACTGroupResults?.response);
        handlePresentPressLocation();

      } else if (getACTGroupResults?.status?.httpStatus == 401) {
        Alert.alert(
          "Fail",
          getACTGroupResults?.errors ? getACTGroupResults?.errors[0].message : "API error",
          [
            {
              text: "Login again",
              onPress: () => {
                // console.log("OK Pressed");
                dispatch(updateStack({ stackName: "Auth" }));
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Alert!",
          getACTGroupResults?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }

  const handleHidePressLocation = () => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.dismiss();
  };
  const handlePresentPressLocation = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.present();
  };


  const performeByandDate = () => {
    return (<View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: hp("1%"),
      padding: 5,
      marginTop: hp('1%'),
    }}>
      <Pressable onPress={() => {
        getLookUpUsers();
      }}>
        <View style={MeasurementPageStyles.topTileStyle}>
          <View style={{ flexDirection: "row", alignItems: "center" }} >
            <Text style={MeasurementPageStyles.textTitle}>Performed By</Text>
            <DropDownButton style={MeasurementPageStyles.arrowStyleTopTitles} />
          </View>
          <Text style={MeasurementPageStyles.textSmall}>{performedBy?.userName ?? '-'}</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => {
        setModalVisible(true);
        Keyboard.dismiss();
      }}>
        <View style={MeasurementPageStyles.topTileStyle}>
          <View style={{ flexDirection: "row", alignItems: "center" }} >
            <Text style={MeasurementPageStyles.textTitle}>Performed On</Text>
            <DropDownButton style={MeasurementPageStyles.arrowStyleTopTitles} />
          </View>
          <Text style={MeasurementPageStyles.textSmall}>{moment(selectedDate).format("MM/DD/YYYY")}</Text>
        </View>
      </Pressable>

    </View>);
  }


  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <HeaderComponent
        navigation={undefined}
        route={undefined}
        moduleName={operation == ACT_OPERATIONS.MARK_AS_COMPLETE ? "Mark As Complete" : operation == ACT_OPERATIONS.MARK_AS_FAILED ? "Mark As Failed" : operation}
        headerColor={"#FFF"}
      />

      <LinearGradient
        colors={["#F1F9E8", "#ACEEFE"]}
        style={[CommonStyles.mainComponentStyle, { padding: 10 }]}
      >
        <View
          style={{ backgroundColor: "#A0D7D966", borderRadius: 10, padding: 5 }}
        >
          <Text style={styles.title}>{selectedAnimalsList[0].actName}</Text>
          {operation === ACT_OPERATIONS.MARK_AS_COMPLETE ? performeByandDate() : null}
          {type == 1 ? <Text style={[CommonStyles.textStyleBold, { marginLeft: 10, marginTop: 5 }]}>{selectedAnimalsList[0].animalNameTattoo}</Text> : null}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginTop: 5 }}>
            {type == 1 ? <Text style={CommonStyles.textStyleRegular}>Scheduled Date(s)</Text> : <View />}
            <Text style={[CommonStyles.textStyleRegular, { alignSelf: 'flex-end', marginRight: wp('1.5%'), marginBottom: hp('1.0%') }]}>Selected records ({chipsData.length})</Text>
          </View>
          <FlatList
            data={chipsData}
            horizontal={false}
            persistentScrollbar={true}
            scrollEnabled={true}

            showsVerticalScrollIndicator={true}
            numColumns={2}

            style={{ alignSelf: "flex-start", maxHeight: hp('10%'), width: wp('95%') }}
            renderItem={({ item, index }) => (
              <View style={{ alignItems: "center", margin: 1 }}>
                <CustomChip
                  style={{ width: width / 2.3 }}
                  textLableStyle={{ color: "black", fontFamily: "Lexend-SemiBold", fontSize: fonts.fontTiny, }}
                  textLable={item.title}
                  onClose={function (): void {
                    try {
                      let tempChipsData = [...chipsData];
                      let chipremoved = tempChipsData.splice(index, 1);
                      set_chipsData(tempChipsData);
                      //let removedOne = selectedAnimalsList.splice(index, 1);

                      let tempSelectedAnimal = [...selectedAnimalsList]
                      let finalList = [];
                      if (type === 3) {
                        finalList = tempSelectedAnimal.filter((item) => item.animalNameTattoo !== chipremoved[0].title)
                      } else {
                        finalList = tempSelectedAnimal.filter((item) => item.actScheduleId !== chipremoved[0].scheduleId)
                      }


                      // let listTemp = selectedAnimals?.filter(
                      //   (data) => data.animalNameTattoo != chipsData[index]
                      // );
                      // console.log("TEST listTemp", listTemp);
                      set_SelectedAnimalsList(finalList);

                      setTimeout(() => {
                        getACTGroupResults(finalList);
                      }, 300);

                    } catch (e) {
                      console.error("chipsData", e);
                    }
                  }}
                  isEnableClose={chipsData.length > 1 ? true : false}
                  backgroundColor={"white"}
                />
              </View>
            )}
          />
        </View>

        {operation === ACT_OPERATIONS.RESCHEDULE ? (


          <View style={styles.container}>
            <View style={styles.selectedDateContainer}>
              <Text style={styles.textStyleRegular}>
                Re-scheduled date:
              </Text>
              <Text style={CommonStyles.textStyleRegular}>
                {/* var currentDate = moment(date).format("YYYY-MM-DD");
                console.log("date currentDate", currentDate);
                setSelectedDate(currentDate);
                {selectedDate} */}
                {moment(selectedDate).format("MM/DD/YYYY")}
              </Text>
            </View>
            <Calendar
              style={styles.calenderStyle}
              minDate={today}
              theme={{
                todayTextColor: Colors.ORANGE,
                dayTextColor: Colors.BLACK,
                textDisabledColor: Colors.DISABLE_COLOR
              }}
              markedDates={{
                [selectedDate]: { selected: true },
              }}
              onDayPress={(day: { dateString: React.SetStateAction<string>; }) => {
                setSelectedDate(day.dateString)
              }}
            />
          </View>
        ) : (
          <View>

            <View style={[CommonStyles.textInputContainerStyleBigWithColor, {
              height: hp('25%'), alignItems: "flex-start",
              justifyContent: "flex-start",
              width: wp('90%'),
              flexDirection: "column",
            }]}>

              <TextInput
                style={[CommonStyles.textInputStyleBig, {
                  width: wp('84'),
                  height: hp("20%"),

                }]}
                placeholder={operation === ACT_OPERATIONS.MARK_AS_COMPLETE ? "Comments" : "Comments *"}
                blurOnSubmit={true}
                placeholderTextColor="#000"
                autoCapitalize="none"
                autoFocus={false}
                value={recognizedText}
                onChangeText={(text) => {
                  setRecognizedText(text);
                  setCommentsText(text);
                  // if (text.length == 0) {
                  //   setRecognizedText("")
                  // }
                }}
                maxLength={500}
                multiline={true}
              />
              <View style={{
                height: hp('3%'),
                marginBottom: hp('3%'),

              }}>
                <View style={{ flexDirection: 'row', width: wp('85%'), alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.titleSmall}>{recognizedText.length}/500</Text>
                  <Pressable
                    hitSlop={{ top: 25, bottom: 25, left: 15, right: 15 }}
                    style={{
                      // margin: wp("2%"),
                      //bottom: 0,
                      //  right: 0,
                      // position: "absolute",
                    }}
                    onPressIn={() => {
                      inputTextBeforeVoice.current = recognizedText
                      if (operation == ACT_OPERATIONS.MARK_AS_COMPLETE) {
                        firebaseHelper.logEvent(firebaseHelper.Event_Speech_Mark_as_Complete, firebaseHelper.Screen_Tasks, "");
                      }
                      if (operation == ACT_OPERATIONS.NOT_PERFORMED) {
                        firebaseHelper.logEvent(firebaseHelper.Event_Speech_Not_Performed, firebaseHelper.Screen_Tasks, "");
                      }
                      if (operation == ACT_OPERATIONS.MARK_AS_FAILED) {
                        firebaseHelper.logEvent(firebaseHelper.Event_Speech_Mark_as_Faild, firebaseHelper.Screen_Tasks, "");
                      }
                      startListening();
                    }
                    }
                    onPressOut={() => {
                      stopListening();
                    }}
                  >
                    <RecordIcon width={20} />

                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}


        <View
          style={{
            width: wp("100%"),
            flexDirection: "row",
            alignSelf: "center",
            height: hp("5%"),
            position: "absolute",
            bottom: 50,
            // backgroundColor:'white'
          }}
        >
          <View style={{ width: wp("40%"), marginLeft: wp("5%") }}>
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
            style={{
              width: wp("40%"),
              marginLeft: wp("5%"),
              marginRight: wp("2%"),
            }}
          >
            <BottomButtonComponent
              style={{ width: 100 }}
              title={"Submit"}
              buttonClick={function (): void {
                stopListening();
                //TODO call stop recognizing hrere
                //NOT require comments as new changes 15 OCT
                if (operation !== ACT_OPERATIONS.MARK_AS_COMPLETE) {
                  if (commentsText.length === 0 && operation !== ACT_OPERATIONS.RESCHEDULE) {
                    //show alert
                    showToast("Please enter comments", "info");
                    return;
                  }
                }


                Alert.alert(
                  "Alert!",
                  alertMsg,
                  [
                    {
                      text: "No",
                      onPress: () => {
                        // console.log("OK Pressed");
                      },
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        if (operation === ACT_OPERATIONS.RESCHEDULE) {
                          firebaseHelper.logEvent(firebaseHelper.Event_ReSchdule_ACT_Tasks, firebaseHelper.Screen_Tasks, "");

                          rescheduleACT();
                        }
                        else if (operation === ACT_OPERATIONS.MARK_AS_COMPLETE) {
                          if (type === 3) {
                            firebaseHelper.logEvent(firebaseHelper.Event_ReSchdule_Mark_as_Complete_RGA, firebaseHelper.Screen_Tasks, "");

                            _saveResults(actResponse)
                          } else {
                            firebaseHelper.logEvent(firebaseHelper.Event_ReSchdule_Mark_as_Complete, firebaseHelper.Screen_Tasks, "");

                            markAsCompleteACT();
                          }
                        } else if (operation === ACT_OPERATIONS.MARK_AS_FAILED) {
                          firebaseHelper.logEvent(firebaseHelper.Event_Mark_as_Failed_ACT_Tasks, firebaseHelper.Screen_Tasks, "");

                          markAsFailedACT();
                        } else if (operation === ACT_OPERATIONS.NOT_PERFORMED) {
                          firebaseHelper.logEvent(firebaseHelper.Event_Not_Performed_ACT_Tasks, firebaseHelper.Screen_Tasks, "");

                          notPerformedACT();
                        }

                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
              buttonType={"submit"}
            ></BottomButtonComponent>
          </View>
        </View>
        <LoadingModal visible={isLoading} text="Loading..." />
        {modalVisible ? <Calendar
          style={MeasurementPageStyles.calenderStyle}
          maxDate={today}
          theme={{
            todayTextColor: Colors.ORANGE,
            dayTextColor: Colors.BLACK,
            textDisabledColor: Colors.DISABLE_COLOR
          }}
          markedDates={{
            [selectedDate]: { selected: true },
          }}
          onDayPress={(day: { dateString: React.SetStateAction<string>; }) => {

            var currentDate = moment(day.dateString).format(dateFormat);
            setSelectedDate(currentDate);
            //setSelectedDate(day.dateString)
            setSelectedPerformedDate(currentDate);
            setModalVisible(false);

          }}
        /> : null}
        <SelectionBottomSheet
          ref={bottomSheetRef}
          title={"Performed By"}
          data={bottomSheetData}
          isVisible={isBottomSheetVisible}
          onClose={handleHidePressLocation}
          applyFilter={(val) => {
            bottomSheetRef.current?.dismiss();
            setPerformedBy(val);
          }}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container1: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  searchSuggestion: {
    backgroundColor: "#fff",
    borderColor: Colors.GRAY,
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    height: hp("20%"),
    margin: 2,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    //zIndex: -1,
    position: "absolute",
    top: hp("11%"),
    width: wp("90%"),
  },
  calenderStyle: {
    backgroundColor: "#F1F9E8",
    marginTop: hp("2%")
  },
  item: {
    padding: 1,
    marginVertical: 3,
    marginHorizontal: 5,
    borderBottomColor: Colors.GRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: fonts.fontXMedium,
    fontFamily: "Lexend-SemiBold",
    marginLeft: wp("2%"),
  },
  titleSmall: {
    fontSize: fonts.fontSmall,
    fontFamily: "Lexend-Regular",
    marginLeft: wp("2%"),
    color: '#1E1E1E'
  },
  innerView: {
    backgroundColor: "#A0D7D9",
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    borderRadius: 10,
    padding: 15,
  },
  segmentViewStyle: {
    flexDirection: "row",
    height: 25,
    marginBottom: 5,
  },
  segmentButtonStyle: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  search: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    borderRadius: 6,
    flexDirection: "row",
    borderColor: "#242E4226",
    borderWidth: 1,
  },
  SearchUI: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    flex: 1,
  },
  searchContainerStyle: {
    height: 36,
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  SearchImage: {
    height: 36,
    width: 36,
    backgroundColor: "#C3CFD6",
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  ChipStype: {
    width: width / 2.3,
  },
  DynamicChip: {
    flex: 1,
    maxWidth: "100%",
    alignItems: "center",
    padding: 0,
    backgroundColor: "rgba(208, 225, 236, 1.0)",
    borderWidth: 2,
    borderColor: "#136DA54D",
    margin: 5,
  },
  container: {
    borderRadius: 10,
    width: wp("95%"),
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    marginTop: hp("1%"),
    paddingBottom: hp("2%"),
  },
  wrapperOnpress: {
    borderRadius: 3,
    padding: 6,
  },
  todayText: {
    color: "#FFFFFF",
  },
  selectedDateContainer: {
    marginTop: hp("2%"),
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textStyleRegular: {
    fontFamily: fontFamily.light,
    fontSize: fonts.fontTiny
  },
});

export default AnimalACTSubmission;

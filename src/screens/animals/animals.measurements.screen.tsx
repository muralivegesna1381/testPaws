import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Pressable,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimalStackParamList } from "../../navigation/types";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import ACTLocationIcon from "./../../../assets/svgs/location_icon_ACT.svg";
import RightBackButton from "./../../../assets/svgs/arrow_right_back.svg";
import DropDownButton from "./../../../assets/svgs/down_arrow.svg";
import HeaderComponent from "../../components/headerComponent";
import CommonStyles from "../../styles/commonstyles";
import { AnimalResponse, ScheduleAnimalRes } from "../../model/schedule_animals";
import NetworkManager, { ANIMAL_IMAGE_LINK } from "../../network/network.manager";
import LoadingModal from "../../components/loadingModel";
import fonts, { fontFamily } from "../../fonts/fonts";
import { ActResultRequest } from "../../model/act_result_request";
import Utils, { ACT_OPERATIONS, ACT_REQUEST_BODY, ACT_SCALE_TYPES, USER_ROLE } from "../../utils";
import {
  RecordGrpuActReponse,
} from "../../model/act_record_group_respons";
import { Act, BinaryResult, NumericResult, RecordGrpuActRequst, Result, ScaleResult } from "../../model/act_save_object_model";
import { updateStack } from "../../redux/slices/login.slicer";
import { useDispatch, useSelector } from "react-redux";
import BottomSheetStyle from "../../styles/bottonsheet.style";
import CheckBoxSelected from "./../../../assets/svgs/checkbox_selected.svg";
import CheckBoxEmpty from "./../../../assets/svgs/checkbox_empty.svg";
import BottomButtonComponent from "../../components/button.component";
import Colors from "../../styles/color";
import moment from "moment";
import SelectionBottomSheet, { UserType } from "../../components/bottomSelectionSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MeasurementPageStyles from "../../styles/measurments.page.style";
import Voice, { SpeechEndEvent, SpeechResultsEvent } from "@react-native-voice/voice";
import AlertComponent from "../../components/alert.component";
import ACTScaleTypeComponent from "../../components/dropdown.optionSelection";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { showToast } from "../../components/custom.toast.message";
import { RootState } from "../../redux/store";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

import { fetch } from "@react-native-community/netinfo";
import { BASE_URL } from "../../network/api.constants";
type AnimalScreenProps = NativeStackScreenProps<AnimalStackParamList, "Tasks">;
var currentDate = moment(new Date()).format("MM/DD/YYYY");
const AnimalTasksScreen = (props: AnimalScreenProps) => {
  const dateFormat = "MM/DD/YYYY";
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const { route } = props;
  const [checked, setChecked] = React.useState(false);
  const { actId, type, selectedTypeId, locationValue, actName, animalName, isRecordGroupAct, selectedAnimalsList, actScheduleId, actScheduleDate, isFromDashboard } =
    props.route.params;
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, set_isLoading] = useState(false);
  const [animalData, set_animalData] = useState<AnimalResponse[]>([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [actResponse, set_actResponse] = useState<Act[]>([]);
  const [expandedItemIndex, setExpandedItemIndex] = useState(-1)
  let commentTextBeforeVoice = useRef<string>('')
  const dispatch = useDispatch();
  const [selectedAnimals, setSelectedAnimals] = useState<AnimalResponse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("--");
  const [performedBy, setPerformedBy] = useState<UserType>();
  const [isBottomSheetVisible, setBottomSheetVisible] =
    useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [bottomSheetData, setBottomSheetData] = useState<
    UserType[]
  >([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isMenuOptionSelected, setIsMenuOptionSelected] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertSubTitle, setAlertSubTitle] = useState("");
  const [isPopUp, set_isPopUp] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const today = moment().format("YYYY-MM-DD");
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const backBtnAction = () => {
    navigation.pop();
  };

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Measurements);
    getScheduledAnimals(true);
    //addSpeechTextListner();
    fetchDefaultValues();
    return () => {
      // Cleanup logic here
      stopListening();
    };
  }, []);

  useEffect(() => {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value[0]) {
        if (actResponse[expandedItemIndex]?.results != undefined) {
          if (e.value[0].length > 0) {
            actResponse[expandedItemIndex].isReadyForSave = true;
          }
          else {
            actResponse[expandedItemIndex].isReadyForSave = false;
          }
          updateCommentText(`${commentTextBeforeVoice.current} ${e.value[0]}`)
        }
      }
    };

    Voice.onSpeechEnd = (e: SpeechEndEvent) => {
      commentTextBeforeVoice.current = ''
    }
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [expandedItemIndex]);

  useFocusEffect(
    React.useCallback(() => {
      Voice.onSpeechResults = (e: SpeechResultsEvent) => {


        if (e.value && e.value[0]) {
          if (actResponse[expandedItemIndex]?.results != undefined) {
            if (e.value[0].length > 0) {
              actResponse[expandedItemIndex].isReadyForSave = true;
            }
            else {
              actResponse[expandedItemIndex].isReadyForSave = false;
            }
            updateCommentText(`${commentTextBeforeVoice.current} ${e.value[0]}`)
          }
        }
      };

      Voice.onSpeechEnd = (e: SpeechEndEvent) => {
        commentTextBeforeVoice.current = ''
      }

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
        // Do something that should run on blur
      };
    }, [expandedItemIndex])
  );


  useFocusEffect(
    React.useCallback(() => {
      ///This should call when ACT tasks done properly.
      // getScheduledAnimals(false);
      setIsMenuOptionSelected(false);
    }, [navigation])
  );

  const updateCommentText = (text: string) => {
    const _inputData = [...actResponse]
    const _results = [..._inputData[expandedItemIndex].results]
    _results[0].comments = text
    _inputData[expandedItemIndex] = { ..._inputData[expandedItemIndex], results: _results }
    set_actResponse(_inputData);
  }

  async function fetchDefaultValues() {
    var userId = await Utils.getData("UserId") ?? '0';
    var fName = await Utils.getData("firstName") ?? '';
    var lName = await Utils.getData("lastName") ?? '';
    let defaultCurrentUser: UserType = {
      userName: fName + " " + lName,
      userInfoId: Number(userId)
    };
    setPerformedBy(defaultCurrentUser);
    setCurrentDate();
    await requestMicrophonePermission();
  }
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to work.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // console.log('You can use the microphone');
        } else {
          // console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const startListening = async (itemIdex: number) => {

    await requestMicrophonePermission();
    try {
      await Voice.start("en-US"); // Change to your desired language
    } catch (e) {
      console.log(e);
    }
  };

  const setCurrentDate = () => {
    setSelectedDate(moment(new Date()).format(dateFormat));
  }
  const stopListening = async () => {

    setIsListening(false);
    //sttString = "";
    try {
      await Voice.stop();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDateChange = (date: moment.MomentInput) => {
    var currentDate = moment(date).format(dateFormat);
    setSelectedDate(currentDate);
    setModalVisible(false);
  };

  const handleHidePressLocation = () => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.dismiss();
  };
  const handlePresentPressLocation = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.present();
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

  const toggleExpansion = (itemId: any) => {
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === itemId ? null : itemId
    );
  };
  const getACTScheduleID = (actScheduleId: number) => {
    //console.log("ACT SCHEDULE ID", actScheduleId);
  };
  const handleCheckboxChange = (id: AnimalResponse) => {
    if (id.isSelected) {
      const newArray = [...selectedAnimals];
      newArray.push(id);
      setSelectedAnimals(newArray);
    } else {
      const newArray = [...selectedAnimals];

      let index = newArray.findIndex((ob) => ob.actScheduleId === id.actScheduleId);
      if (index >= 0) newArray.splice(index, 1);
      setSelectedAnimals(newArray);
    }
  };

  function prepareSceduleIDs() {
    let ids = "";
    selectedAnimals.forEach((ob) => {
      ids = ids + ob.actScheduleId + ",";
    });
    return ids;
  }

  async function deleteACT() {

    set_isLoading(true);
    let ids = prepareSceduleIDs();
    try {
      let deleteACT = await NetworkManager.actDelete(
        ids,
      );

      set_isLoading(false);
      if (deleteACT.status.success && deleteACT.response) {
        Alert.alert("Alert!", deleteACT.response.message, [
          {
            text: "OK", onPress: () => {
              //onRquiredRefrs(true);
              getScheduledAnimals(false);
              navigation.goBack()
            }
          },
        ]);
      } else if (deleteACT?.status?.httpStatus == 401) {
        //onRquiredRefrs(false);

        Alert.alert(
          "Fail",
          deleteACT?.errors ? deleteACT?.errors[0].message : "API error",
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

        Alert.alert(
          "Alert!",
          deleteACT?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }



  async function getScheduledAnimals(isRequiredTogetResult: boolean) {
    set_isLoading(true);
    try {
      let animalRequest: String = "";
      if (isRecordGroupAct == true) {
        for (let index = 0; index < selectedAnimalsList.length; index++) {
          if (index != 0) {
            animalRequest = animalRequest + ",";
          }
          animalRequest = animalRequest + selectedAnimalsList[index].AnimalId;
        }
      } else {
        animalRequest = selectedTypeId;
      }
      let getScheduledAnimalsList = await NetworkManager.getScheduledAnimals(
        type,
        actId,
        animalRequest,
        props.route.params.dateFilterFrom ?? "",
        props.route.params.dateFilterTo ?? ""
      );
      if (getScheduledAnimalsList?.status?.httpStatus === 200) {
        if (getScheduledAnimalsList.response) {
          let response: AnimalResponse[] = getScheduledAnimalsList.response;
          var updatedres;
          if (actScheduleId != "") {
            updatedres = response.filter(itemtemp => itemtemp.actScheduleId === actScheduleId);
          } else if (actScheduleDate != "") {
            updatedres = response.filter(itemtemp => itemtemp.actScheduleDate === actScheduleDate);
          } else {
            updatedres = response;
          }

          updatedres?.forEach((item) => {
            item.isSelected = false;
          });
          set_animalData(updatedres);
          if (updatedres.length === 1) {
            setSelectedAnimals(updatedres);
          }
          //TO GET ACT RESULTS
          if (isRequiredTogetResult) {
            getACTGroupResults(updatedres);
          }
          else {
            set_isLoading(false);
          }

        }
        else {
          setSelectedAnimals([]);
          navigation.pop();
        }

      } else if (getScheduledAnimalsList?.status?.httpStatus == 401) {
        set_isLoading(false);
        Alert.alert(
          "Fail",
          getScheduledAnimalsList?.errors ? getScheduledAnimalsList?.errors[0].message : "API error",
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
        Alert.alert(
          "Fail!",
          getScheduledAnimalsList?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      // set_isLoading(false);``
    }
  }
  async function getACTGroupResults(response: AnimalResponse[]) {
    // set_isLoading(true);
    try {
      var userId = await Utils.getData("UserId");
      let actReqBody: ActResultRequest = {
        actId: actId,
        flow: type == 3 ? "RECORD_GROUP_ACT" : "",
        taskType: ACT_REQUEST_BODY.ACT_MEASUREMENT, //Taking 1 by deafult for ACT operation measurements
        userInfoId: Number(userId),
        animals: response,
      };
      let getACTGroupResults = await NetworkManager.getACTResults(actReqBody);
      if (getACTGroupResults?.status?.httpStatus === 200) {
        let results: RecordGrpuActReponse = getACTGroupResults;
        set_actResponse(results.response.acts);
        if (results?.response?.acts?.length > 0) {
          toggleExpansion(0);
          setExpandedItemIndex(0)
        }
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


  async function getLookUpUsers() {
    set_isLoading(true);
    try {
      var userId = await Utils.getData("UserId");
      let getACTGroupResults = await NetworkManager.getLookUpUsers();
      if (getACTGroupResults?.status?.httpStatus === 200) {
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

  function LocationNameUI() {
    return (
      <View style={MeasurementPageStyles.locationNameBgStyle}>
        <LinearGradient
          colors={["#FFEEDD", "#F9D1AC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <View style={MeasurementPageStyles.locationName}>
            {type === 1 ? <Image style={MeasurementPageStyles.animalImage} source={{ uri: BASE_URL + ANIMAL_IMAGE_LINK + selectedTypeId, cache: 'force-cache' }}></Image> : <ACTLocationIcon />}
            <Text
              style={{
                flex: 1,
                margin: 5,
                color: "#1E1E1E",
                fontSize: 22,
                ...CommonStyles.textStyleBold,
              }}
            >
              {type === 1 ? animalName : locationValue}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }



  async function _saveResults(actfinalList: Act[], isInternetReachable: boolean) {
    let tepmActs: Act[] = [...actfinalList];
    let convertedDate = Utils.getConvertedDate(selectedDate, "MM/DD/YYYY", "DD-MMM-YYYY");
    if (isRecordGroupAct == true) {
      tepmActs.forEach((item) => {
        item.scheduleDate = convertedDate
      });
    }
    let results = tepmActs[0].results;
    let oneReulst = results[0];
    //To add if tempacts length == 1 show infor on alert
    // oneReulst.numericResults[0].resultValue
    tepmActs[0].results = [oneReulst];
    var userId = await Utils.getData("UserId");
    let requestBody: RecordGrpuActRequst = {
      performedBy: performedBy?.userInfoId ?? 0,
      performedDate: convertedDate,
      actId: actId,
      userInfoId: Number(userId),
      acts: tepmActs,
    };

    try {
      set_isLoading(true)
      let result = await NetworkManager.saveGroupActResults(requestBody, isInternetReachable);
      if (result == "OFFLINE") {
        // console.log("result", "OFFLINE");
      }
      if (isInternetReachable) {
        if (result?.status?.httpStatus === 200) {
          showToast("Records are saved!", "success");
          if (isRecordGroupAct == true) {
            navigation.pop();
            navigation.pop();
          } else {
            navigation.pop();
          }
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
          set_isLoading(false)
        }
      } else {
        //Offline mode
        showToast("Records are saved offline!", "success");
        if (isRecordGroupAct == true) {
          navigation.pop();
          navigation.pop();
        } else {
          navigation.pop();
          navigation.pop();
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      set_isLoading(false)
    }
  }
  const performeByandDate = () => {
    return (<View style={MeasurementPageStyles.topTilesContainer}>
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
      }}>
        <View style={MeasurementPageStyles.topTileStyle}>
          <View style={{ flexDirection: "row", alignItems: "center" }} >
            <Text style={MeasurementPageStyles.textTitle}>Performed On</Text>
            <DropDownButton style={MeasurementPageStyles.arrowStyleTopTitles} />
          </View>
          <Text style={MeasurementPageStyles.textSmall}>{selectedDate}</Text>
        </View>
      </Pressable>

    </View>);
  }
  function animalRowItem(item: AnimalResponse, itemIdex: number) {
    let actResult = type === 3 ? actResponse?.find((act) => (act.animalId === item.animalId)) : actResponse?.find((act) => (act.actScheduleId === item.actScheduleId) && (act.animalId === item.animalId));
    //console.log("TEST condition check =>>", item.actScheduleId, item.animalId, actResult)
    //TODO we have provision for show only one value as Result, here only getting first one.
    let resultValue = false;
    let actScaleTyle: ACT_SCALE_TYPES = ACT_SCALE_TYPES.UNDEFINED;

    if (actResult?.results[0]?.numericResults != undefined && (actResult?.results[0]?.numericResults?.length > 0)) {
      resultValue = actResult?.results[0]?.numericResults[0]?.resultValue?.trim()?.length ?? 0 > 0 ? true : false;
      actScaleTyle = ACT_SCALE_TYPES.NUMERIC;
    }
    else if (actResult?.results[0]?.scaleResults?.length ?? 0 > 0) {
      resultValue = actResult?.results[0]?.scaleResults[0]?.resultValue ? true : false;
      actScaleTyle = ACT_SCALE_TYPES.SCALE;
    }
    else if (actResult?.results[0]?.binaryResults?.length ?? 0 > 0) {
      resultValue = actResult?.results[0]?.binaryResults[0]?.resultValue ? true : false;
      actScaleTyle = ACT_SCALE_TYPES.BINARY;
    }
    var dateString = Utils.getConvertedDate(item.scheduledDate, "MM/DD/yyyy", "MM/DD/YY");
    var isBefore = Utils.getDateBefore(currentDate, dateString);

    return (
      <View style={MeasurementPageStyles.ListItemStyle}>
        <LinearGradient
          colors={actResult?.isReadyForSave ? ["#FFCD9E", "#F0F9E9"] : ["#B4F0FC", "#F0F9E9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 8, justifyContent: "space-around" }}
        >
          <View
            style={{
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View>

                <TouchableOpacity
                  style={MeasurementPageStyles.dropdownSelector}
                  onPress={() => {

                    toggleExpansion(itemIdex);
                    //let actResultIndex = actResponse?.findIndex((act) => act.actScheduleId == item.actScheduleId);
                    let actResultIndex = type === 3 ? actResponse?.findIndex((act) => act.animalId === item.animalId) : actResponse?.findIndex((act) => act.actScheduleId === item.actScheduleId);
                    setExpandedItemIndex(actResultIndex)
                  }}
                >
                  {type === 2 ? <Image style={MeasurementPageStyles.animalIcon} source={{ uri: BASE_URL + ANIMAL_IMAGE_LINK + item.animalId, cache: 'force-cache' }}></Image> : <View style={{ width: 0 }}></View>}

                  <Text numberOfLines={2} style={[CommonStyles.textStyleRegular, { fontWeight: "700", fontSize: fonts.fontMedium, flex: 1 }]}>
                    {isRecordGroupAct ? item.animalNameTattoo : type === 1 ? item.actName : item.animalNameTattoo}
                  </Text>

                  {item.testNum && <Text style={[{
                    fontFamily: "Lexend-Bold",
                    fontSize: fonts.fontXSmall,
                    marginLeft: wp("1%"), fontWeight: "400", marginRight: wp("2%")
                  }]}>
                    {item.testNum}
                  </Text>}

                  {item.scheduledDate == null ? null : <View style={isBefore ? MeasurementPageStyles.dateContainer : MeasurementPageStyles.dateContainerRed}>
                    <Text style={MeasurementPageStyles.textWhiteSmall}>
                      {dateString}
                    </Text>
                  </View>}

                  {animalData.length > 1 && isMenuOptionSelected ? <View style={MeasurementPageStyles.checkBoxContainer}>
                    <Pressable
                      onPress={() => {
                        //Need to update object
                        item.isSelected = !item.isSelected;
                        handleCheckboxChange(item);
                      }}
                      style={BottomSheetStyle.rowItemStyle}
                    >
                      {item.isSelected ? (
                        <CheckBoxSelected
                          style={[
                            {
                              width: wp("5%"),
                              height: wp("5%"),
                            },
                          ]}
                        />
                      ) : (
                        <CheckBoxEmpty
                          style={[
                            {
                              width: wp("5%"),
                              height: wp("5%"),
                            },
                          ]}
                        />
                      )}
                    </Pressable>
                  </View> : null}

                  {expandedItem === itemIdex ? (
                    <DropDownButton style={MeasurementPageStyles.arrowStyle} />
                  ) : (
                    <RightBackButton style={MeasurementPageStyles.arrowStyle} />
                  )}
                </TouchableOpacity>


                {expandedItem === itemIdex ? (
                  <View style={MeasurementPageStyles.DropdownArea}>

                    {actScaleTyle === ACT_SCALE_TYPES.UNDEFINED && type === 2 ? <Text style={MeasurementPageStyles.textBlackTitle}>{actName} :</Text> : null}
                    <ACTScaleTypeComponent
                      type={actScaleTyle}
                      actId={item.actId}
                      scaleObject={"data"}
                      actResult={actResult!}
                      updateActComment={(text: string) => {
                        updateCommentText(text)

                      }}
                      onReulstUpdateCallback={(updated, index, actScaleTyle) => {

                        if (actScaleTyle === ACT_SCALE_TYPES.UNDEFINED) {
                          if (actResult) {
                            if (updated.length > 0) {
                              actResult.isReadyForSave = true;
                            }
                            else {
                              actResult.isReadyForSave = false;
                            }
                          }
                        }

                        if (actScaleTyle === ACT_SCALE_TYPES.NUMERIC) {
                          let numericResults: NumericResult = updated;

                          if (actResult) {
                            if (numericResults?.resultValue.length > 0)
                              actResult.isReadyForSave = true;
                            else
                              actResult.isReadyForSave = false;

                            actResult.results[0].numericResults[index] = numericResults;

                          }

                        } else if (actScaleTyle === ACT_SCALE_TYPES.SCALE) {
                          let scalerResult = actResult?.results[0].scaleResults[index];
                          let scaleList: ScaleResult = updated;

                          if (actResult) {

                            if (scaleList?.selectedValue?.length > 0) {
                              actResult.isReadyForSave = true;
                            }
                            else {
                              actResult.isReadyForSave = false;
                            }

                            actResult.results[0].scaleResults[index] = scaleList;
                          }
                          if (type === 3) {
                            actResponse.map(itemVal => {
                              if (itemVal.actScheduleId === item.actScheduleId && itemVal.animalId == item.animalId) {
                                itemVal = actResult ?? itemVal;
                              }
                              return item;
                            });
                          } else {
                            actResponse.map(itemVal => {
                              if (itemVal.animalId == item.animalId) {
                                itemVal = actResult ?? itemVal;
                              }
                              return item;
                            });
                          }

                          const newArray = [...actResponse];
                          if (newArray) {
                            set_actResponse(newArray);
                          }


                        } else if (actScaleTyle === ACT_SCALE_TYPES.BINARY) {

                          let binaryResult: BinaryResult = updated;
                          if (actResult) {
                            if (binaryResult?.resultValue)
                              actResult.isReadyForSave = true;
                            else
                              actResult.isReadyForSave = false;

                            actResult.results[0].binaryResults[index] = binaryResult;
                            if (type === 3) {
                              actResponse.map(itemVal => {
                                if (itemVal.actScheduleId === item.actScheduleId && itemVal.animalId == item.animalId) {
                                  itemVal = actResult ?? itemVal;
                                }
                                return item;
                              });
                            } else {
                              actResponse.map(itemVal => {
                                if (itemVal.animalId == item.animalId) {
                                  itemVal = actResult ?? itemVal;
                                }
                                return item;
                              });
                            }

                            const newArray = [...actResponse];
                            if (newArray) {
                              set_actResponse(newArray);
                            }

                          }

                        }

                      }} updateDVCRequest={function (posion: number, actScaleTyle): void {

                        let dvcValue = "";
                        if (actScaleTyle === ACT_SCALE_TYPES.NUMERIC) {
                          dvcValue = actResult?.results[0].numericResults[posion].dvc ?? "";
                        } else if (actScaleTyle === ACT_SCALE_TYPES.BINARY) {
                          dvcValue = actResult?.results[0].binaryResults[posion].dvc ?? "";
                        }
                        else if (actScaleTyle === ACT_SCALE_TYPES.SCALE) {
                          dvcValue = actResult?.results[0].scaleResults[posion].dvc ?? "";
                        }
                        firebaseHelper.logEvent(firebaseHelper.Event_UpdateDVC_Button, firebaseHelper.Screen_Measurements, "");

                        navigation.navigate("UpdateDVC", {
                          dvcValue: dvcValue,
                          onReturn: (itemVal: string) => {

                            //TODO need to verify in case empty updated
                            if (actResult)
                              actResult.isReadyForSave = true
                            if (actResult) {
                              if (actScaleTyle === ACT_SCALE_TYPES.NUMERIC) {
                                actResult.results[0].numericResults[posion].dvc = itemVal;
                              }
                              else if (actScaleTyle === ACT_SCALE_TYPES.SCALE) {
                                actResult.results[0].scaleResults[posion].dvc = itemVal;
                              }
                              else if (actScaleTyle === ACT_SCALE_TYPES.BINARY) {
                                actResult.results[0].binaryResults[posion].dvc = itemVal;
                              }
                            }
                            const newArray = actResponse;
                            if (type === 3) {
                              const updatedItems = newArray.filter(itemtemp => !(itemtemp.animalId === item.animalId));
                              if (actResult) {
                                let arr = [...updatedItems, actResult];
                                if (arr) {
                                  set_actResponse(arr);
                                }
                              }

                            } else {
                              const updatedItems = newArray.filter(itemtemp => !(itemtemp.actScheduleId === item.actScheduleId && itemtemp.animalId === item.animalId));
                              if (actResult) {
                                let arr = [...updatedItems, actResult];
                                if (arr) {
                                  set_actResponse(arr);
                                }
                              }
                            }


                          },


                        });

                      }} onCommentBoxFocus={function (isFocussed: boolean, content: string): void {
                        if (actResult) {
                          if (actResult?.results[0].comments?.length > 0 || content?.length > 0) {

                            actResult.isReadyForSave = true;
                            actResult.results[0].comments = content;

                          } else {
                            actResult.isReadyForSave = false;
                          }

                        }
                      }} />
                    <View >
                      <Pressable
                        style={({ pressed }) => [{
                          margin: wp("2%"),
                          bottom: 0,
                          right: 0,
                          position: "absolute"
                        }]}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        onPressIn={() => {
                          commentTextBeforeVoice.current = actResult?.results[0].comments ?? ''
                          startListening(itemIdex);
                        }
                        }
                        onPressOut={async () => {
                          stopListening();
                        }}

                      >{({ pressed }) => (
                        <Image
                          source={require("./../../../assets/pngs/record.png")}
                          style={pressed ? MeasurementPageStyles.buttonOut : MeasurementPageStyles.buttonPressed}
                        />
                      )}

                      </Pressable>
                    </View>

                  </View>

                ) : null}
              </View>

            </View>
            {(expandedItem != itemIdex && actResult?.isReadyForSave) && (actResult?.results[0]?.numericResults[0]?.resultValue?.trim()?.length ?? 0) > 0 ? (actResult?.results[0]?.numericResults.map((res) => displayDetails(res.resultName, res.resultValue + " " + res?.unitName ?? ''))) : null}
            {(expandedItem != itemIdex && actResult?.isReadyForSave) && (actResult?.results[0]?.scaleResults?.length ?? 0) > 0 ? (actResult?.results[0]?.scaleResults.map((res) => displayDetails(res.resultName, res.selectedValue))) : null}
            {(expandedItem != itemIdex && actResult?.isReadyForSave) && (actResult?.results[0]?.binaryResults?.length ?? 0) > 0 ? (actResult?.results[0]?.binaryResults.map((res) => displayDetails(res.resultName, res.resultValue === res.firstOptionId ? res.firstOptionValue : res.resultValue === res.secondOptionId ? res.secondOptionValue : ""))) : null}
          </View>
        </LinearGradient>
      </View>
    );
  }

  const displayDetails = (title: any, value: string) => {

    return (
      <>
        {title && value ?
          <Text style={MeasurementPageStyles.textSmallLight} numberOfLines={1}>
            {title} = {value}
          </Text> : null
        }
      </>);
  }
  const validateRequest = async () => {
    let actfinalList: Act[] = [];
    //As per new requirement changed the login for saving data selection
    let actResult = actResponse?.filter((act) => act.isReadyForSave === true);
    if (actResult) {
      actfinalList = actResult;
    }
    if (actfinalList.length > 0) {
      //TODO need to show alert Would you like to Submit
      let internet = await fetch();
      if (internet?.isInternetReachable) {
        _saveResults(actfinalList, internet?.isInternetReachable ?? false);
      } else {
        Alert.alert(
          "Alert!",
          "Your connectivity to the PAWS backend is lost. Your data is saved locally and will be uploaded once online. ",
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
                // console.log("OK Pressed");
                _saveResults(actfinalList, false);
              },
            }
          ],
          { cancelable: false }
        );
      }
    } else {
      //Utils.showToastMessage("Please select act");
      Alert.alert("Enter either a DVC or value to proceed.");
    }
  }
  const popOkBtnAction = () => {
    set_isPopUp(false);
    //_saveResults(actfinalList);
    validateRequest();
  };
  const popCancelBtnACtion = () => {
    set_isPopUp(false);
    toggleExpansion(-1);
  }

  const menuAction = () => {
    if (!open) {
      setOpen(true);
      setIsMenuOptionSelected(true);
      bottomSheetModalRef.current?.present();
    } else {
      setOpen(false);
      setIsMenuOptionSelected(false);
      bottomSheetModalRef.current?.close();
    }
    changeCheckList(!open)
  };

  const changeCheckList = (isOpen: boolean) => {
    var suggestionList = [...animalData];
    if (isOpen) {
      suggestionList.map(item => {
        item.isSelected = true
      })
      setSelectedAnimals(suggestionList);
    } else {
      //TODO need to verify.
      suggestionList.map(item => {
        item.isSelected = false
      })
      setSelectedAnimals([]);
    }
  }
  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) setOpen(false);
  }, []);

  const locationNameUI = React.useMemo(() => <LocationNameUI />, []);

  return (

    <View style={[MeasurementPageStyles.mainContainer, { paddingTop: insets.top }]}>
      <HeaderComponent
        navigation={undefined}
        route={undefined}
        moduleName={actName}
        headerColor={"#FFF"}
        moduleType={isRecordGroupAct ? undefined : "ACT"}
        menuAction={menuAction}
      />
      {isRecordGroupAct == false ? locationNameUI : null}
      {performeByandDate()}
      <KeyboardAwareScrollView style={{ flex: 1 }} extraScrollHeight={250}>

        <FlatList data={animalData}
          style={open ? { marginBottom: hp("15%"), flex: 1 } : { marginBottom: hp("0%") }}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => `${item.animalId}-${item.actScheduleId}`}
          renderItem={({ item, index }) => {
            return (
              <>
                {animalRowItem(item, index)}
              </>
            )
          }} />

      </KeyboardAwareScrollView>

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

      <BottomSheetModal
        ref={bottomSheetModalRef}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: Colors.GRAY }}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={MeasurementPageStyles.contentContainer}>

          {userInfo?.userInfo?.response?.userRoleList?.includes(USER_ROLE.ACRT) || userInfo?.userInfo?.response?.isAdmin ? <Pressable
            onPress={() => {
              if (selectedAnimals.length > 0) {
                firebaseHelper.logEvent(firebaseHelper.Event_Delete_ACT_Measurements, firebaseHelper.Screen_Measurements, "");
                deleteACT();
              } else {
                Alert.alert("Alert!", "Please select atleast one animal");
              }
              bottomSheetModalRef.current?.close();
            }}
          >
            {({ pressed }) => (
              <Text
                style={[MeasurementPageStyles.operationTextStyle,
                pressed
                  ? CommonStyles.textPressedStyle
                  : CommonStyles.textStyleRegular,
                ]}
              >
                {ACT_OPERATIONS.DELETE}
              </Text>
            )}
          </Pressable>
            : null}
          {divider()}
          <Pressable
            onPress={() => {
              if (selectedAnimals.length > 0) {
                //console.log("navigation code");
                firebaseHelper.logEvent(firebaseHelper.Event_ReSchdule_ACT_Measurements, firebaseHelper.Screen_Measurements, "");

                navigation.navigate("Submission", {
                  operation: ACT_OPERATIONS.RESCHEDULE,
                  selectedAnimals: selectedAnimals,
                  type: type,
                  onRquiredRefrs(val) {

                    if (val) {
                      if (isFromDashboard) {
                        navigation.pop();
                      }
                      else {
                        setSelectedAnimals([]);
                        getScheduledAnimals(false)
                      }

                    }
                  },
                });
              } else {
                Alert.alert("Alert!", "Please select atleast one animal");
              }
              bottomSheetModalRef.current?.close();
            }}
          >
            {({ pressed }) => (
              <Text
                style={[MeasurementPageStyles.operationTextStyle,
                pressed
                  ? CommonStyles.textPressedStyle
                  : CommonStyles.textStyleRegular,
                ]}
              >
                {ACT_OPERATIONS.RESCHEDULE}
              </Text>
            )}
          </Pressable>
          {divider()}
          <Pressable
            onPress={() => {
              if (selectedAnimals.length > 0) {
                firebaseHelper.logEvent(firebaseHelper.Event_Mark_as_Failed_ACT_Measurements, firebaseHelper.Screen_Measurements, "");
                navigation.navigate("Submission", {
                  operation: ACT_OPERATIONS.MARK_AS_FAILED,
                  selectedAnimals: selectedAnimals,
                  type: type,
                  onRquiredRefrs(val) {
                    if (val) {
                      if (isFromDashboard) {
                        navigation.pop();
                      }
                      else {
                        setSelectedAnimals([]);
                        getScheduledAnimals(false)
                      }
                    }
                  },
                });
              } else {
                Alert.alert("Alert!", "Please select atleast one animal");
              }
              bottomSheetModalRef.current?.close();
            }}
          >
            {({ pressed }) => (
              <Text
                style={[MeasurementPageStyles.operationTextStyle,
                pressed
                  ? CommonStyles.textPressedStyle
                  : CommonStyles.textStyleRegular,
                ]}
              >
                {ACT_OPERATIONS.MARK_AS_FAILED}
              </Text>
            )}
          </Pressable>
          {divider()}
          <Pressable
            onPress={() => {
              if (selectedAnimals.length > 0) {
                firebaseHelper.logEvent(firebaseHelper.Event_Not_Performed_ACT_Measurements, firebaseHelper.Screen_Measurements, "");
                navigation.navigate("Submission", {
                  operation: ACT_OPERATIONS.NOT_PERFORMED,
                  selectedAnimals: selectedAnimals,
                  type: type,
                  onRquiredRefrs(val) {
                    if (val) {
                      if (isFromDashboard) {
                        navigation.pop();
                      }
                      else {
                        setSelectedAnimals([]);
                        getScheduledAnimals(false)
                      }
                    }
                  },
                });
              } else {
                Alert.alert("Alert!", "Please select atleast one animal");
              }
              bottomSheetModalRef.current?.close();
            }}
          >
            {({ pressed }) => (
              <Text
                style={[MeasurementPageStyles.operationTextStyle,
                pressed
                  ? CommonStyles.textPressedStyle
                  : CommonStyles.textStyleRegular,
                ]}
              >
                {ACT_OPERATIONS.NOT_PERFORMED}
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
                style={[MeasurementPageStyles.operationTextStyle,
                pressed
                  ? CommonStyles.textPressedStyle
                  : CommonStyles.textStyleRegular,
                ]}
              >
                Cancel
              </Text>
            )}
          </Pressable>
          {divider()}
        </View>
      </BottomSheetModal>

      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          height: hp("10%"),
          marginBottom: 5,
          alignContent: "center",
        }}
      >
        <View style={{ width: wp("40%"), alignSelf: "center", marginRight: 5 }}>
          <BottomButtonComponent
            style={{ width: 100 }}
            title={"Cancel"}
            buttonClick={function (): void {
              navigation.pop();
            }}
            buttonType={"cancel"}
          ></BottomButtonComponent>
        </View>
        <View style={{ width: wp("40%"), alignSelf: "center", marginLeft: 5 }}>
          <BottomButtonComponent
            style={{ width: 100 }}
            title={"Submit"}
            buttonClick={() => {
              firebaseHelper.logEvent(firebaseHelper.Event_Submit_Measurements, firebaseHelper.Screen_Measurements, "");
              setAlertType("success");
              setAlertMessage("Are you sure?");
              let actResult = actResponse?.filter((act) => act.isReadyForSave === true);
              if (actResult.length > 1) {
                if (type === 1) {
                  setAlertSubTitle("Would you like to submit for multiple tasks ?");
                }
                else {
                  setAlertSubTitle("Would you like to submit for multiple animals ?");
                }
              }
              else {
                setAlertSubTitle("Would you like to submit ?")

              }
              set_isPopUp(true);
              // validateRequest();
            }}
            buttonType={"submit"}
          ></BottomButtonComponent>
        </View>
      </View>

      {isPopUp ? <View style={CommonStyles.customPopUpStyle}>
        <AlertComponent
          type={alertType}
          header={alertTitle}
          subHeader={alertSubTitle}
          message={alertMessage}
          subMessage={alertSubTitle}
          isLeftBtnEnable={true}
          isRightBtnEnable={true}
          leftBtnTilte={"Review"}
          rightBtnTilte={"Submit"}
          popUpLeftBtnAction={() => popCancelBtnACtion()}
          popUpRightBtnAction={() => popOkBtnAction()}
        />
      </View> : null}
    </View>

  );
};


export default AnimalTasksScreen;
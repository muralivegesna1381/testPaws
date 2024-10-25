import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimalStackParamList } from "../../navigation/types";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";

import SearchIcon from "./../../../assets/svgs/search.svg";
import MeasurementIcon from "./../../../assets/svgs/measurementIcon.svg";
import TaskIcon from "./../../../assets/svgs/taskIcon.svg";
import RightBackButton from "./../../../assets/svgs/arrow_right_back.svg";
import ACTLocationIcon from "./../../../assets/svgs/location_icon_ACT.svg";
import MeasurementListIcon from "./../../../assets/svgs/Measurement_list_icon.svg";
import TaskListIcon from "./../../../assets/svgs/Task_list_icon.svg";
import TaskListCircleIcon from "./../../../assets/svgs/Task_list_circle.svg";
import CommonStyles from "../../styles/commonstyles";
import HeaderComponent from "../../components/headerComponent";
import fonts, { fontFamily } from "../../fonts/fonts";
import NetworkManager, { ANIMAL_IMAGE_LINK } from "../../network/network.manager";
import Utils, { ACT_OPERATIONS, MonitorTypes } from "../../utils";
import LoadingModal from "../../components/loadingModel";
import { useFocusEffect } from "@react-navigation/native";
import CustomChip from "../../components/custom_chip";
import CommonHeaderComponent from "../../components/header.component";
import Search from "./../../../assets/svgs/search.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { updateStack } from "../../redux/slices/login.slicer";
import { AnimalResponse } from "../../model/schedule_animals";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";
import { BASE_URL } from "../../network/api.constants";


let empty_animal = require("./../../../assets/pngs/empty_animal.png");
let location_icon = require("./../../../assets/pngs/location_icon.png");
let animal_dog = require("./../../../assets/pngs/animal_dog.png");

var width = Dimensions.get("window").width;

export enum AnimalSegments {
  Measurement,
  Tasks,
}

type ACTObject = {
  actCount: number;
  actId: number;
  actClassificationId: number;
  actName: string;
};

type AnimalScreenProps = NativeStackScreenProps<
  AnimalStackParamList,
  "Activities"
>;

const AnimalActivitiesScreen = (props: AnimalScreenProps) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const { type, selectedItem, selectedAnimalsList, recordGroupActivity } = props.route.params;
  const [selectedSegment, set_selectedSegment] = useState(
    AnimalSegments.Measurement
  );
  const [searchText, onSearchText] = React.useState("");
  const [recordGroupActs, set_RecordGroupActs] = useState<ACTObject[]>([]);

  const [measurements, set_Measurements] = useState<ACTObject[]>([]);
  const [tasks, set_Tasks] = useState<ACTObject[]>([]);

  const [isLoading, set_isLoading] = useState(false);
  const [selectedAnimals, set_SelectedAnimals] = useState(selectedAnimalsList);
  const [isShowSearch, set_isShowSearch] = useState(false);
  const [searchAnimalsText, setAnimalsSearchText] = React.useState("");
  const dispatch = useDispatch();
  const locationNameUI = React.useMemo(() => <LocationNameUI />, []);



  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_ACT_List);
    //   getActs();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getActs(selectedAnimals);
    }, [navigation])
  );
  async function getActs(selectedAnimals: any) {

    try {
      let userID = await Utils.getData("UserId");
      let animalRequest: String = "";
      if (recordGroupActivity == true) {
        for (let index = 0; index < selectedAnimals.length; index++) {
          if (index != 0) {
            animalRequest = animalRequest + ",";
          }
          animalRequest = animalRequest + selectedAnimals[index].AnimalId;
        }
      } else {
        animalRequest = type == 1 ? selectedAnimals.length > 0 ? selectedAnimals[0].AnimalId : selectedItem.AnimalId : selectedItem.facilityLocationId
      }
      set_isLoading(true);
      let actsList = [];

      if (recordGroupActivity == true) {
        let userID = await Utils.getData("UserId");
        actsList = await NetworkManager.getLookUpACTNames("RECORD_GROUP_ACT");
      } else {
        let animalRequest = type == 1 ? selectedItem.AnimalId : selectedItem.facilityLocationId
        actsList = await NetworkManager.getActs(type, animalRequest);
      }
      set_isLoading(false);
      if (actsList?.status?.success) {
        if (recordGroupActivity == true) {
          if (actsList?.response && actsList?.response.length > 0) {
            let dataList = actsList?.response;
            set_RecordGroupActs(dataList);

            // let measurements = actsList.response.filter(
            // (element: { actClassificationId: number }) =>
            //   element.actClassificationId == 1
            // );
            //set_RecordGroupActs(measurements);
          } else {
            set_RecordGroupActs([]);
            // Alert.alert(
            //   "Alert",
            //   "No matching records found",
            //   [
            //     {
            //       text: "OK",
            //       onPress: () => {
            //         // console.log("OK Pressed");
            //         navigateToPreviousScreen();
            //       },
            //     },
            //   ],
            //   { cancelable: false }
            // );
          }
        } else {
          if (actsList?.response && actsList?.response.length > 0) {
            let tasks = actsList?.response.filter(
              (element: { actClassificationId: number }) =>
                element.actClassificationId == 2
            );
            let measurements = actsList.response.filter(
              (element: { actClassificationId: number }) =>
                element.actClassificationId == 1
            );
            set_Tasks(tasks);
            set_Measurements(measurements);
          } else {
            set_Tasks([]);
            set_Measurements([]);
            // Alert.alert(
            //   "Alert",
            //   "No matching records found",
            //   [
            //     {
            //       text: "OK",
            //       onPress: () => {
            //         // console.log("OK Pressed");
            //         navigateToPreviousScreen();
            //       },
            //     },
            //   ],
            //   { cancelable: false }
            // );
          }
        }
      } else if (actsList?.status?.httpStatus == 401) {
        Alert.alert(
          "Fail",
          actsList?.errors ? actsList?.errors[0].message : "API error",
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
          actsList?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }

  const backBtnAction = () => {
    if (recordGroupActivity == true) {
      Alert.alert(
        "Alert",
        "The selected animals will be cleared. Reselect them?",
        [
          {
            text: "No",
            onPress: () => {
            },
          },
          {
            text: "Yes",
            onPress: () => {
              navigation.pop();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      navigateToPreviousScreen();
    }
  };

  function navigateToPreviousScreen() {

    navigation.pop();

  }
  function SegmentButtonUI() {
    return (
      <View style={styles.segmentViewStyle}>
        <TouchableOpacity
          style={[
            styles.segmentButtonStyle,
            {
              backgroundColor:
                selectedSegment == AnimalSegments.Measurement
                  ? "#136DA4"
                  : "#C2C2C280",
            },
          ]}
          onPress={() => {
            if (selectedSegment != AnimalSegments.Measurement) {
              firebaseHelper.logEvent(firebaseHelper.Event_ACT_Measurement, firebaseHelper.Screen_ACT_List, "");

              set_selectedSegment(AnimalSegments.Measurement);
            }
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor:
                selectedSegment == AnimalSegments.Measurement
                  ? "#136DA5"
                  : "#E1E7EB",
              borderRadius: 6,
            }}
          >
            <View
              style={{
                backgroundColor:
                  selectedSegment == AnimalSegments.Measurement
                    ? "#73BDD8"
                    : "#4EC571",
                height: 26,
                width: 26,
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                borderRadius: 6,
              }}
            >
              <MeasurementIcon />
            </View>
            <View style={styles.Measurement}>
              <Text
                style={{
                  color:
                    selectedSegment == AnimalSegments.Measurement
                      ? "#FFFFFF"
                      : "#3A3A3A",
                  fontSize: fonts.fontSmall,
                  ...CommonStyles.textStyleBold,
                }}
              >
                Measurement
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButtonStyle,
            {
              backgroundColor:
                selectedSegment == AnimalSegments.Tasks
                  ? "#136DA4"
                  : "#C2C2C280",
            },
          ]}
          onPress={() => {
            if (selectedSegment != AnimalSegments.Tasks) {
              firebaseHelper.logEvent(firebaseHelper.Event_ACT_Tasks, firebaseHelper.Screen_ACT_List, "");
              set_selectedSegment(AnimalSegments.Tasks);
            }
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor:
                selectedSegment == AnimalSegments.Tasks ? "#136DA5" : "#E1E7EB",
              borderRadius: 6,
            }}
          >
            <View
              style={{
                backgroundColor:
                  selectedSegment == AnimalSegments.Tasks
                    ? "#73BDD8"
                    : "#4EC571",
                height: 26,
                width: 26,
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                borderRadius: 6,
              }}
            >
              <TaskIcon />
            </View>
            <View style={styles.Measurement}>
              <Text
                style={{
                  color:
                    selectedSegment == AnimalSegments.Tasks
                      ? "#FFFFFF"
                      : "#3A3A3A",
                  fontSize: fonts.fontSmall,
                  ...CommonStyles.textStyleBold,
                }}
              >
                Tasks
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  const changeSearchText = (text: string) => {
    setAnimalsSearchText(text);
  };

  function LocationNameUI() {
    return (
      <View style={styles.locationNameBgStyle}>
        <LinearGradient
          colors={["#FFEEDD", "#F9D1AC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <View style={styles.locationName}>
            {type === 1 ? <Image style={styles.animalImage} source={{ uri: BASE_URL + ANIMAL_IMAGE_LINK + selectedAnimals[0].AnimalId, cache: 'force-cache' }}></Image> : <ACTLocationIcon />}
            {/* <ACTLocationIcon /> */}
            <Text
              style={{
                flex: 1,
                margin: 5,
                color: "#1E1E1E",
                fontSize: 22,
                ...CommonStyles.textStyleBold,
              }}
            >
              {type == 1
                ? selectedAnimals.length > 0 ? selectedAnimals[0].AnimalNameTattoo : selectedItem.AnimalNameTattoo
                : selectedItem.locationDesc}
            </Text>
            <Pressable
              onPress={() => {
                set_isShowSearch(true);
              }}
            >
              <View style={[styles.SearchImage, { backgroundColor: '#FFB186', }]}>
                <Search />
              </View>
            </Pressable>

          </View>

        </LinearGradient >
      </View >
    );
  }

  function MeasurementListUI() {
    if (measurements != undefined && measurements.length > 0) {
      var suggestionList = measurements;

      if (searchAnimalsText.length > 0) {
        suggestionList = measurements.filter((result) => result?.actName.toLowerCase().includes(searchAnimalsText.toLowerCase()));
      }

      return (
        <FlatList
          data={suggestionList}
          renderItem={({ item, index }) => RowItem(item)}
          keyExtractor={(item) => item.actId.toString()}
        />
      );
    }
    else {
      return isLoading ? <View></View> : <Text style={styles.header}> No measurement tasks available</Text>;
    }
  }

  function RowItem(item: any) {
    return (
      <View style={styles.ListItemStyle}>
        <LinearGradient
          colors={["#F1F9E8", "#CDF4F5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 8 }}
        >
          <TouchableOpacity
            testID="renderItem"
            onPress={() => {
             // console.log("tasks main-->", item.actClassificationId, item.actId, type, selectedItem, item);
              firebaseHelper.logEvent(firebaseHelper.Event_Select_Measurement_ACT, firebaseHelper.Screen_Animals, "");

              navigation.navigate("Tasks", {
                actId: item.actId,
                type: type,
                selectedTypeId:
                  type == 1
                    ? selectedItem.AnimalId
                    : selectedItem.facilityLocationId,
                locationValue:
                  type == 1
                    ? selectedItem.LocationName
                    : selectedItem.locationDesc,
                actName: item.actName,
                animalName: selectedItem.AnimalNameTattoo,
                selectedAnimalsList: [],
                isRecordGroupAct: false,
                actScheduleId: "",
                actScheduleDate: "",
                isFromDashboard: false,
                dateFilterFrom:"",
                dateFilterTo:""
              });
            }}
          >
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <Text style={styles.animalNameSemiBoldStyle}>
                    {item.actName}
                  </Text>
                </View>
                <View style={styles.NumberStyle}>
                  <Text style={styles.countBoldStyle}>{item.actCount}</Text>
                </View>
                <RightBackButton />
              </View>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  function TasksListUI() {
    if (tasks != undefined && tasks.length > 0) {
      var suggestionList = tasks;
      if (searchAnimalsText.length > 0) {
        suggestionList = tasks.filter((result) => result?.actName.toLowerCase().includes(searchAnimalsText.toLowerCase()));
      }
      return (
        <FlatList
          data={suggestionList}
          renderItem={({ item, index }) => TaskRowItem(item)}
          keyExtractor={(item) => item.actId.toString()}
        />
      );
    } else {
      return <Text style={styles.header}>No tasks available</Text>;

      // <Text style={styles.header}>No matching records found</Text>;
    }
  }

  function ACTSLISTUI() {

    if (recordGroupActs != undefined && recordGroupActs.length > 0) {
      var suggestionList = recordGroupActs;
      if (searchText.length > 0) {
        suggestionList = recordGroupActs.filter((result) => result?.actName.toLowerCase().includes(searchText.toLowerCase()));
      }

      if (suggestionList != undefined && suggestionList.length > 0) {
        return (
          <FlatList
            data={suggestionList}
            renderItem={({ item, index }) => <View style={styles.ListItemStyle}>
              <LinearGradient
                colors={["#F1F9E8", "#CDF4F5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 8 }}
              >
                <TouchableOpacity
                  testID="renderItem"
                  onPress={async () => {
                    //actClassificationId 2 Tasks naviagte to Operations
                    //actClassificationId 1 Measurements navigate to Tasks
                    if (item.actClassificationId == 2) {
                      firebaseHelper.logEvent(firebaseHelper.Event_Select_RGA_Task_ACT, firebaseHelper.Screen_Animals, "");

                      // navigation.navigate("Operations", {
                      //   actId: item.actId,
                      //   type: 3,
                      //   animalName: selectedItem.AnimalNameTattoo,
                      //   selectedTypeId:
                      //     type == 1
                      //       ? selectedItem.AnimalId
                      //       : selectedItem.facilityLocationId,
                      //   locationValue:
                      //     type == 1
                      //       ? selectedItem.LocationName
                      //       : selectedItem.locationDesc,
                      //   selectedAnimalsList: selectedAnimals,
                      //   isRecordGroupAct: true,
                      //   actName: item.actName,
                      // });
                      set_isLoading(true);
                      let animalRequest: String = "";
                      for (let index = 0; index < selectedAnimals.length; index++) {
                        if (index != 0) {
                          animalRequest = animalRequest + ",";
                        }
                        animalRequest = animalRequest + selectedAnimals[index].AnimalId;
                      }

                      let getScheduledAnimalsList = await NetworkManager.getScheduledAnimals(
                        3,
                        item.actId,
                        animalRequest,
                        "", ""
                      );
                      set_isLoading(false);
                      if (getScheduledAnimalsList?.status?.httpStatus === 200) {

                        if (getScheduledAnimalsList.response && getScheduledAnimalsList.response.length > 0) {
                          let response: AnimalResponse[] = getScheduledAnimalsList.response;
                          navigation.navigate("Submission", {
                            operation: ACT_OPERATIONS.MARK_AS_COMPLETE,
                            selectedAnimals: response,
                            type: 3,
                            onRquiredRefrs(val) {
                             // console.log("onRquiredRefrs", val);
                              if (val) {
                                // getScheduledAnimals()
                              }
                            },
                          });
                        }

                      }

                    } else {
                      firebaseHelper.logEvent(firebaseHelper.Event_Select_RGA_Measurement_ACT, firebaseHelper.Screen_Animals, "");

                      navigation.navigate("Tasks", {
                        actId: item.actId,
                        type: 3,
                        selectedTypeId:
                          type == 1
                            ? selectedItem.AnimalId
                            : selectedItem.facilityLocationId,
                        locationValue:
                          type == 1
                            ? selectedItem.LocationName
                            : selectedItem.locationDesc,
                        actName: item.actName,
                        animalName: selectedItem.AnimalNameTattoo,
                        selectedAnimalsList: selectedAnimals,
                        isRecordGroupAct: true,
                        actScheduleId: "",
                        actScheduleDate: "",
                        isFromDashboard: false
                      });
                    }

                  }}
                >
                  <View style={{ padding: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={styles.animalNameSemiBoldStyle}>
                          {item.actName}
                        </Text>
                      </View>

                      <RightBackButton />
                    </View>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View >}
            keyExtractor={(item) => item.actId.toString()}
          />
        );
      } else {
        return !isLoading ? <Text style={styles.header}>No matching records found</Text> : <View></View>;
      }
    } else {
      return !isLoading ? <Text style={styles.header}>No matching records found</Text> : <View></View>;
    }
  }
  function TaskRowItem(item: any) {
    return (
      <View style={styles.ListItemStyle}>
        <LinearGradient
          colors={["#F1F9E8", "#CDF4F5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 8 }}
        >
          <TouchableOpacity
            testID="renderItem"
            onPress={() => {
              firebaseHelper.logEvent(firebaseHelper.Event_Select_Task_ACT, firebaseHelper.Screen_Animals, "");
              navigation.navigate("Operations", {
                actId: item.actId,
                type: type,
                animalName: selectedItem.AnimalNameTattoo,
                selectedTypeId:
                  type == 1
                    ? selectedItem.AnimalId
                    : selectedItem.facilityLocationId,
                locationValue:
                  type == 1
                    ? selectedItem.LocationName
                    : selectedItem.locationDesc,
                selectedAnimalsList: [],
                isRecordGroupAct: false,
                actName: item.actName,
                actScheduleId: "",
                actScheduleDate: "",
                isFromDashboard: false,
                dateFilterFrom:"",
                dateFilterTo:""
              });
            }}
          >
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <Text style={styles.animalNameSemiBoldStyle}>
                    {item.actName}
                  </Text>
                </View>
                <View style={styles.NumberStyle}>
                  <Text style={styles.countBoldStyle}>{item.actCount}</Text>
                </View>
                <RightBackButton />
              </View>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* <HeaderComponent
        navigation={undefined}
        route={undefined}
        moduleName={"ACT"}
        headerColor={"#FFF"}
      /> */}
      <CommonHeaderComponent navigation={undefined} route={undefined} moduleName={"undefined"}
        headerTitle='ACT'
        isShowBackButton={true}
        backBtnAction={backBtnAction}
        isShowRightButton={false}
      ></CommonHeaderComponent>

      {recordGroupActivity == true ?

        selectedAnimals.length == 0 ?
          <View style={{ alignItems: 'center', }}> isLoading ? <View></View> : <Text> No matching records found</Text></View>
          :
          <View style={{ marginLeft: 10, flex: 1 }}>
            <View>
              <FlatList
                data={selectedAnimals}
                horizontal={false}
                numColumns={2}
                style={{ alignSelf: 'flex-start', maxHeight: hp('15%'), width: wp('100%') }}
                renderItem={({ item, index }) => (
                  <View style={{ alignItems: "center", margin: 2 }}>

                    <CustomChip style={{ width: width / 2.3 }} textLableStyle={{ color: 'black', }} textLable={item.AnimalNameTattoo} onClose={function (): void {
                      const updatedItems = selectedAnimals.filter(item => item.AnimalId !== selectedAnimals[index].AnimalId);
                      set_SelectedAnimals(updatedItems);
                      //   setTimeout(() => {
                      getActs(updatedItems);
                      // }, 500);

                    }
                    } isEnableClose={selectedAnimals.length > 1 ? true : false}

                      backgroundColor={"#136DA533"} />


                  </View>
                )}
                keyExtractor={(item) => item.AnimalId.toString()}
              />

              {recordGroupActs.length > 0 &&
                <View style={styles.searchTextStyle}>
                  <View style={[styles.SearchUI, { backgroundColor: 'transparent', borderRadius: 10 }]}>
                    <TextInput
                      style={[styles.searchContainerStyle, { backgroundColor: 'transparent', marginLeft: 10 }]}
                      editable={true}
                      placeholder={"Search ACT"}
                      placeholderTextColor={"#000000"}
                      maxLength={20}
                      onChangeText={onSearchText}
                    />
                  </View>
                  <TouchableOpacity onPress={() => { }}>
                    <View style={[styles.SearchImage, { backgroundColor: '#C3CFD6', }]}>
                      <Search />
                    </View>
                  </TouchableOpacity>
                </View>}
            </View>
            <ACTSLISTUI></ACTSLISTUI>

          </View>

        : <View>
          <SegmentButtonUI />
          {!isShowSearch ? locationNameUI :
            <View style={styles.locationNameBgStyle}>
              <LinearGradient
                colors={["#FFEEDD", "#F9D1AC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, paddingTop: 5, paddingBottom: 5 }}
              >
                <SearchUI
                  placeHolder={
                    "Search"
                  }
                  changeSearchText={changeSearchText}
                  searchText={searchAnimalsText}
                  addToList={() => {
                    set_isShowSearch(false);
                  }}
                  isInProgress={false}
                />
              </LinearGradient>
            </View>}
          {selectedSegment == AnimalSegments.Measurement ? <MeasurementListUI /> : <TasksListUI />}
        </View>}

      <LoadingModal visible={isLoading} text="Loading..." />

    </View >
  );
};

type SerachUIProps = {
  placeHolder: string;
  changeSearchText: (text: string) => void;
  addToList: () => void;
  searchText: string;
  isInProgress: boolean;
};
///Search UI
const SearchUI: React.FC<SerachUIProps> = (props) => {
  return (
    <View style={styles.search}>
      <View style={styles.SearchUI}>
        <TextInput
          style={styles.searchContainerStyle}
          onChangeText={(text) => {
            props.changeSearchText(text);
          }}
          value={props.searchText}
          placeholder={props.placeHolder}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          //console.log("TEST", props.searchText);
          props.addToList();
        }}
      >
        <View style={styles.SearchImage}>
          {props.isInProgress ? <ActivityIndicator /> : <Search />}
        </View>

      </TouchableOpacity>

    </View>
  );
};


//Styles used in this screen are defined here
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  segmentViewStyle: {
    flexDirection: "row",
    height: 25,
    marginBottom: 10,
  },
  searchTextStyle: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 6,
    flexDirection: 'row',
    borderColor: '#242E4226',
    borderWidth: 1,
  },
  SearchUI: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    flex: 1,

  },
  search: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    borderRadius: 6,
    flexDirection: "row",
    borderColor: "#242E4226",
    borderWidth: 1,
  },
  header: {
    fontSize: fonts.fontMedium,
    marginTop: hp("2%"),
    justifyContent: "center",
    alignSelf: "center",
    fontFamily: fontFamily.bold

  },
  locationNameBgStyle: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderColor: "#242E4226",
    borderWidth: 1,
    marginBottom: hp("1%")
  },
  SearchImage: {
    height: 40,
    width: 40,
    backgroundColor: '#FFB186',
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  NumberStyle: {
    height: 33,
    width: 34,
    backgroundColor: "#136DA5",
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  ListItemStyle: {
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginBottom: hp("0.5%"),
    marginTop: wp("1%"),
    flex: 1,
  },
  searchContainerStyle: {
    height: 36,
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  headerSelectionView: {
    flex: 1,
    minHeight: hp("4%"),
    flexDirection: "row",
    alignItems: "center",
  },
  titleStyle: {
    color: "black",
    fontSize: 20,
    ...CommonStyles.textStyleBold,
    textAlign: "center",
    marginLeft: 45,
    fontWeight: "700",
  },
  locationImage: {
    width: 34,
    height: 34,
    marginRight: 10,
  },
  animalImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25
  },
  segmentButtonStyle: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  Measurement: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  locationName: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    margin: 10,
  },
  animalNameSemiBoldStyle: {
    color: '#000000',
    fontSize: fonts.fontMedium,
    ...CommonStyles.textStyleSemiBold,
    textAlign: 'left',
  },

  countBoldStyle: {
    color: '#FFF',
    fontSize: fonts.fontXSmall,
    ...CommonStyles.textStyleSemiBold,
    textAlign: 'left',
  },
});

export default AnimalActivitiesScreen;

function navigateToPreviousScreen() {
  throw new Error("Function not implemented.");
}


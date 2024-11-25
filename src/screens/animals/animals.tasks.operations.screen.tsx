import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  act,
  useEffect,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  Alert,
  Image,
  TextInput
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimalStackParamList } from "../../navigation/types";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import ACTLocationIcon from "./../../../assets/svgs/location_icon_ACT.svg";
import HeaderComponent from "../../components/headerComponent";
import CommonStyles from "../../styles/commonstyles";
import BottomSheetStyle from "../../styles/bottonsheet.style";
import CheckBoxSelected from "./../../../assets/svgs/checkbox_selected.svg";
import CheckBoxEmpty from "./../../../assets/svgs/checkbox_empty.svg";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Colors from "../../styles/color";
import fonts, { fontFamily } from "../../fonts/fonts";
import Utils, { ACT_OPERATIONS, MonitorTypes, USER_ROLE } from "../../utils";
import LoadingModal from "../../components/loadingModel";
import NetworkManager, { ANIMAL_IMAGE_LINK } from "../../network/network.manager";
import {
  AnimalResponse,
  ScheduleAnimalRes,
} from "../../model/schedule_animals";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { updateStack } from "../../redux/slices/login.slicer";
import MeasurementPageStyles from "../../styles/measurments.page.style";
import { RootState } from "../../redux/store";
import Search from "./../../../assets/svgs/search.svg";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

import moment from "moment";
import DashboardStyles from "../../styles/dashboard.style";
import { BASE_URL } from "../../../App";


type AnimalScreenProps = NativeStackScreenProps<
  AnimalStackParamList,
  "Operations"
>;

let animal_dog = require("./../../../assets/pngs/animal_dog.png");

const AnimalTasksOperationsScreen = (props: AnimalScreenProps) => {
  const { navigation } = props;
  const { actId, type, selectedTypeId, locationValue, animalName, isRecordGroupAct, selectedAnimalsList, actName, actScheduleId, isFromDashboard } = props.route.params;
  const [isLoading, set_isLoading] = useState(false);
  const [selectedAnimals, setSelectedAnimals] = useState<AnimalResponse[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [animalData, set_animalData] = useState<AnimalResponse[]>([]);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isMenuOptionSelected, setIsMenuOptionSelected] = useState(false);
  const snapPoints = useMemo(() => [hp("30%")], []);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [isShowSearch, set_isShowSearch] = useState(false);
  const [searchAnimalsText, setAnimalsSearchText] = React.useState("");
  var currentDate = moment(new Date()).format("MM/DD/YYYY");
  const [open, setOpen] = useState(false);

  const [searchAnimalData, set_SearchAnimalData] = useState<AnimalResponse[]>([]);
  const locationNameUI = React.useMemo(() => <LocationNameUI />, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      setOpen(false);
    }
    else {
      setOpen(true);
    }
  }, []);

  const backBtnAction = () => {
    // navigation.pop();
  };
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
  const singleSelection = () => {
    setOpen(true);
    setIsMenuOptionSelected(true);
    bottomSheetModalRef.current?.present();
  }
  const changeCheckList = (isOpen: boolean) => {
    var suggestionList = [...animalData];
    if (searchAnimalsText.length > 0) {
      if (type === 1) {
        suggestionList = animalData.filter((result) => result?.actName.toLowerCase().includes(searchAnimalsText.toLowerCase()));
      } else {
        suggestionList = animalData.filter((result) => result?.animalNameTattoo.toLowerCase().includes(searchAnimalsText.toLowerCase()));
      }
    }
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

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Tasks);
    // getScheduledAnimals();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getScheduledAnimals();
      setIsMenuOptionSelected(false);
      setSelectedAnimals([]);
    }, [navigation])
  );

  function prepareSceduleIDs() {
    let ids = "";
    selectedAnimals.forEach((ob) => {
      ids = ids + ob.actScheduleId + ",";
    });
    return ids;
  }

  async function deleteACT() {
    set_isLoading(true);
    firebaseHelper.logEvent(firebaseHelper.Event_Delete_ACT_Tasks, firebaseHelper.Screen_Tasks, "");

    let ids = prepareSceduleIDs();
    try {
      let deleteACT = await NetworkManager.actDelete(
        ids,
      );
      set_isLoading(false);
      if (deleteACT?.status?.success && deleteACT?.response) {
        Alert.alert("Alert!", deleteACT.response.message, [
          {
            text: "OK", onPress: () => {
              //onRquiredRefrs(true);
              getScheduledAnimals();
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
        //onRquiredRefrs(false);

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

  async function getScheduledAnimals() {
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
        if (getScheduledAnimalsList.response && getScheduledAnimalsList.response.length > 0) {
          let response: AnimalResponse[] = getScheduledAnimalsList.response;
          var updatedres;
          if (actScheduleId != "") {
            //updatedres = response;
            updatedres = response.filter(itemtemp => itemtemp.actScheduleId === actScheduleId);
          } else {
            updatedres = response;
          }
          set_animalData(updatedres);
          set_SearchAnimalData(updatedres);
        }
        else {
          set_animalData([]);
          set_SearchAnimalData([]);
          if (isFromDashboard) {
            navigation.navigate("DashboardListView", {
              selectedMonitorID: MonitorTypes.PENDING_ANIMAL_TASKS,
            });
          }
          else {
            navigation.pop();
          }

          //navigate the user back show an alert
          //navigation.pop();

        }
      } else if (getScheduledAnimalsList?.status?.httpStatus == 401) {
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

  function LocationNameUI1() {
    return (
      <View style={styles.locationNameBgStyle}>
        <LinearGradient
          colors={["#FFEEDD", "#F9D1AC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <View style={styles.locationName}>
            {type === 1 ? <Image style={styles.animalImage} source={{ uri: BASE_URL + ANIMAL_IMAGE_LINK + selectedTypeId, cache: 'force-cache' }}></Image> : <ACTLocationIcon />}

            <Text
              style={styles.locationTextStyle}
            >
              {type === 1 ? animalName : locationValue}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
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
            {type === 1 ? <Image style={styles.animalImage} source={{ uri: BASE_URL + ANIMAL_IMAGE_LINK + selectedTypeId, cache: 'force-cache' }}></Image> : <ACTLocationIcon />}

            <Text
              style={styles.locationTextStyle}
            >
              {type === 1 ? animalName : locationValue}
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


  const AnimalNameUI = () => {

    var suggestionList = animalData;
    if (searchAnimalsText.length > 0) {
      if (type === 1) {
        suggestionList = animalData.filter((result) => result?.actName.toLowerCase().includes(searchAnimalsText.toLowerCase()));
      } else {
        suggestionList = animalData.filter((result) => result?.animalNameTattoo.toLowerCase().includes(searchAnimalsText.toLowerCase()));
      }
    }
    return (
      <FlatList
        style={open ? { marginBottom: hp("21%"), flex: 1 } : { marginBottom: hp("0%") }}
        data={searchAnimalData}
        renderItem={({ item, index }) => animalRowItem(item)}
        keyExtractor={(item) => `${item.animalId}-${item.actScheduleId}-${item.animalNameTattoo}`}
      // ListHeaderComponent={() => {
      //   return searchAnimalData.length === 0 ? (
      //     <Text style={DashboardStyles.textLargeCenter}>
      //       No matching records found
      //     </Text>
      //   ) : null;
      // }}
      />
    );
  }
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

  function animalRowItem(item: AnimalResponse) {

    var dateString = Utils.getConvertedDate(item.scheduledDate, "MM/DD/yyyy", "MM/DD/YY");
    var isBefore = Utils.getDateBefore(currentDate, dateString);
    return (
      <View style={styles.ListItemStyle}>
        <LinearGradient
          colors={["#B4F0FC", "#F0F9E9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 8, justifyContent: "center" }}
        >
          <View>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => {
                setIsClicked(!isClicked);
                //By defult set
                item.isSelected = !item.isSelected;
                handleCheckboxChange(item);
                singleSelection();
              }}
            >
              {type === 2 ? <Image style={styles.animalICon} source={{ uri: BASE_URL + ANIMAL_IMAGE_LINK + item.animalId, cache: 'force-cache' }}></Image> : null}

              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={[styles.textStyleRegular, { fontWeight: "700", fontSize: fonts.fontXSmall, marginLeft: wp("1%") }]}>
                  {isRecordGroupAct ? item.animalNameTattoo : type === 1 ? item.actName : item.animalNameTattoo}
                </Text>
              </View>

              {item.testNum && <Text style={[styles.textStyleRegular, { fontWeight: "400", fontSize: fonts.fontSmall, marginRight: wp("2%") }]}>
                {item.testNum}
              </Text>}

              {item.scheduledDate && <View style={isBefore ? MeasurementPageStyles.dateContainer : MeasurementPageStyles.dateContainerRed}>
                <Text style={styles.textWhiteSmall}>
                  {dateString}
                </Text>
              </View>}

              {isMenuOptionSelected ? <View style={{ marginRight: wp("2%") }}>
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
                      style={styles.checkBoxStyle}
                    />
                  ) : (
                    <CheckBoxEmpty
                      style={styles.checkBoxStyle}
                    />
                  )}
                </Pressable>
              </View> : null}
            </TouchableOpacity>
          </View>
        </LinearGradient >
      </View >
    );
  }
  const changeSearchText = (text: string) => {
    setAnimalsSearchText(text);
    var suggestionList = [...animalData];
    if (text.length > 0) {
      if (type === 1) {
        suggestionList = animalData.filter((result) => result?.actName.toLowerCase().includes(text.toLowerCase()));
      } else {
        suggestionList = animalData.filter((result) => result?.animalNameTattoo.toLowerCase().includes(text.toLowerCase()));
      }
    }
    set_SearchAnimalData(suggestionList);
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <HeaderComponent
        navigation={undefined}
        route={undefined}
        moduleName={type === 3 || isFromDashboard == true ? actName : actName}
        headerColor={"#FFF"}
        moduleType={type === 3 ? undefined : "ACT"}
        backBtnAction={backBtnAction}
        menuAction={menuAction}
      />
      {isRecordGroupAct == false ?
        !isShowSearch ? locationNameUI :
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
          </View>
        : null}
      {searchAnimalData.length === 0 && !isLoading ? <Text style={DashboardStyles.textLargeCenter}>
        No matching records found
      </Text> : null}
      <FlatList
        style={open ? { marginBottom: hp("21%"), flex: 1 } : { marginBottom: hp("0%") }}
        data={searchAnimalData}
        renderItem={({ item, index }) => animalRowItem(item)}
        keyExtractor={(item) => `${item.animalId}-${item.actScheduleId}-${item.animalNameTattoo}`}
      />
      {/* <AnimalNameUI></AnimalNameUI> */}

      <LoadingModal visible={isLoading} text="Loading..." />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: Colors.GRAY }}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >

        <View style={styles.contentContainer}>
          <Pressable
            onPress={() => {
              if (selectedAnimals.length > 0) {
                navigation.navigate("Submission", {
                  operation: ACT_OPERATIONS.MARK_AS_COMPLETE,
                  selectedAnimals: selectedAnimals,
                  type: type,
                  onRquiredRefrs(val) {
                    if (val) {
                      if (isFromDashboard) {
                        navigation.pop();
                      }
                      else {
                        getScheduledAnimals();
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
                style={[styles.operationTextStyle,
                pressed
                  ? CommonStyles.textPressedStyle
                  : CommonStyles.textStyleRegular,
                ]}
              >
                {ACT_OPERATIONS.MARK_AS_COMPLETE}
              </Text>
            )}
          </Pressable>


          {divider()}
          <Pressable
            onPress={() => {
              if (selectedAnimals.length > 0) {
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
                        getScheduledAnimals();
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
                style={[styles.operationTextStyle,
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
                        getScheduledAnimals();
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
                style={[styles.operationTextStyle,
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
                        getScheduledAnimals();
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
                style={[styles.operationTextStyle,
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
          {divider()}
          {userInfo?.userInfo?.response?.userRoleList?.includes(USER_ROLE.ACRT) || userInfo?.userInfo?.response?.isAdmin ? <Pressable
            onPress={() => {
              if (selectedAnimals.length > 0) {
                deleteACT();
                // navigation.navigate("Submission", {
                //   operation: ACT_OPERATIONS.RESCHEDULE,
                //   selectedAnimals: selectedAnimals,
                //   type: type,
                //   onRquiredRefrs(val) {
                //     if (val) {
                //       getScheduledAnimals(false)
                //     }
                //   },
                // });
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
          <Pressable
            onPress={() => {
              bottomSheetModalRef.current?.close();
            }}
          >
            {({ pressed }) => (
              <Text
                style={[styles.operationTextStyle,
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


      </BottomSheetModal >
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
    marginBottom: hp("0.5%")
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  gradientContainer: {
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    marginTop: hp("1%"),
  },
  heading: {
    fontSize: 18,
  },
  dropdownSelector: {
    borderColor: "#B4CFDA",
    alignItems: "center",
    flexDirection: "row",
    height: hp('8%'),
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
    justifyContent: "space-between",
  },
  FecalScore1: {
    height: 44,
    width: 353,
    borderColor: "#B4CFDA",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: "center",
    justifyContent: "space-between",
    borderRadius: 0.5,
  },
  countContainer: {
    alignItems: "center",
    padding: 10,
  },

  textStyleRegular: {
    fontFamily: "Lexend-Bold",
    fontSize: fonts.fontXSmall,
    marginLeft: wp("1%")
  },
  textWhiteSmall: {
    textAlign: "center",
    color: "white",
    fontSize: fonts.fontTiny,
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    fontFamily: fontFamily.semibold,
  },
  button: {
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#136DA533",
    marginTop: 5,
    height: 35,
    width: 323,
  },
  countText: {
    color: "#ED0505",
    fontSize: 24,
  },
  animalImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25
  },
  animalICon: {
    width: 25,
    height: 25,
    marginRight: 5,
    borderRadius: 10.5
  },

  locationNameBgStyle: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderColor: "#242E4226",
    borderWidth: 1,
  },
  locationName: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    margin: 10,
  },
  ListItemStyle: {
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    marginTop: hp("0.5%"),
    height: hp("7%"),
    justifyContent: "space-evenly",
  },
  DropdownArea: {
    height: 370,
    width: 353,
    borderRadius: 10,
    borderColor: "#B4CFDA",
    elevation: 5,
    alignSelf: "center",
    borderTopWidth: 2,
  },
  CommentsInput: {
    height: 35,
    width: 323,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
    alignSelf: "center",
    margin: 10,
    alignItems: "center",
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    paddingLeft: 10,
  },
  contentContainer: {
    alignItems: "center",
    borderColor: Colors.LIGHT_GRAY,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomColor: "white",
    shadowColor: Colors.LIGHT_GRAY,
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: hp("2%"),
    marginTop: hp("2%"),
  },
  locationTextStyle: {
    flex: 1,
    margin: 5,
    color: "#1E1E1E",
    fontSize: 22,
    ...CommonStyles.textStyleBold,
  },
  animalRowItemStyle: {
    borderRadius: 15,
    // marginTop: hp('1%')
  },
  checkBoxStyle: {
    width: wp("6%"),
    height: wp("6%"),
  },
  operationTextStyle: {
    fontSize: 16,
    margin: 8
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
  SearchImage: {
    height: 40,
    width: 40,
    backgroundColor: '#FFB186',
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  searchContainerStyle: {
    height: 36,
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
});

export default AnimalTasksOperationsScreen;

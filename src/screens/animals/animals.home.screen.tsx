import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
  Pressable,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimalStackParamList } from "../../navigation/types";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommonStyles from "./../../styles/commonstyles";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts from "./../../fonts/fonts";
import LinearGradient from "react-native-linear-gradient";
import CommonHeaderComponent from "./../../components/header.component";

import RightBackButton from "./../../../assets/svgs/arrow_right_back.svg";
import NetworkManager, { ANIMAL_IMAGE_LINK } from "../../network/network.manager";
import Utils from "../../utils";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch } from "react-redux";
import { updateStack } from "../../redux/slices/login.slicer";
import { useFocusEffect } from "@react-navigation/native";
import Search from "./../../../assets/svgs/search.svg";
import Colors from "../../styles/color";
import CustomChip from "../../components/custom_chip";
import MenuIcon from "./../../../assets/svgs/menu.svg";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import LoadingModal from "../../components/loadingModel";

import CheckBoxEmpty from "./../../../assets/svgs/checkbox_empty.svg";
import CheckboxSelected from "./../../../assets/svgs/checkbox_selected.svg";
import BottomButtonComponent from "../../components/button.component";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";
import { BASE_URL } from "../../network/api.constants";
import { useDebounce } from "../../utilities/useDebounce";
import { MultiSelect } from 'react-native-element-dropdown';




let close_icon = require("./../../../assets/icons/close.png");

let animal_dog = require("./../../../assets/pngs/animal_dog.png");
let location_icon = require("./../../../assets/pngs/location_icon.png");

const pageLimit = 0;
export enum AnimalSegments {
  Name,
  Location,
}

type LocationObject = {
  facilityLocationId: number;
  locationDesc: string;
  speciesId: number;
  speciesName: string;
};
type AnimalObject = {
  AnimalId: number;
  AnimalName: string;
  AnimalNameTattoo: string;
  LocationId: number;
  LocationName: string;
  SpeciesId: number;
  SpeciesName: string;
  TattooNumber: string;
};


var width = Dimensions.get("window").width;

type AnimalScreenProps = NativeStackScreenProps<AnimalStackParamList, "Home">;

const AnimalHomeScreen = (props: AnimalScreenProps) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const [selectedSegment, set_selectedSegment] = useState(AnimalSegments.Name);
  const [searchText, setSearchText] = React.useState("");
  const [isLoading, set_isLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [inSearchProgress, setInSearchProgress] = useState(false);
  const [animals, set_Animals] = useState<AnimalObject[]>([]);

  const [selectedAnimalsList, set_SelectedAnimalsList] = useState<AnimalObject[]>([]);
  const [filteredAnimalsList, set_FilteredAnimalsList] = useState<AnimalObject>();
  const [selectedAnimalsForRGA, set_SelectedAnimalsForRGA] = useState<AnimalObject[]>([]);

  const [locations, set_Locations] = useState<LocationObject[]>([]);

  const [selectedLocationsList, set_SelectedLocationsList] = useState<LocationObject[]>([]);
  const [filteredLocationsList, set_FilteredLocationsList] = useState<LocationObject>();
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [isRecordGroupActSelected, setIsRecordGroupActSelected] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["18%"], []);
  const [selectedAnimalLocations, setSelectedAnimalLocations] = useState([]);
  const [animalLocations, setAnimalLocations] = useState([]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) setOpen(false);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Animals);
  }, []);

  useEffect(() => {
    const minLength = (selectedSegment === AnimalSegments.Location) ? 1 : 3
    if (searchText.length >= minLength) {
      onChangeDebounced();
    }
  }, [searchText])

  useFocusEffect(
    React.useCallback(() => {
      if (selectedSegment == AnimalSegments.Name) {
        getAnimals("");
      } else {
        getLocations("");
      }
      setIsRecordGroupActSelected(false);
      set_SelectedAnimalsForRGA([]);
    }, [navigation])
  );

  async function getAnimals(searchText: string) {
    set_isLoading(true);
    let userID = await Utils.getData("UserId");
    try {
      let animalsRes = await NetworkManager.getAnimalsByName(
        0,
        0, //unlimited
        userID,
        searchText,
        "AnimalName",
        "ASC"
      );
      set_isLoading(false);
      if (animalsRes?.status?.success && animalsRes?.response?.animalList) {
        //console.error("animalsRes.response", animalsRes?.response?.animalList);
        let dataList: AnimalObject = animalsRes?.response?.animalList;
        // let res = dataList.sort((a, b) =>
        //   a.AnimalName < b.AnimalName ? -1 : 1
        // );
        getLocations("");
        console.log("hari")
        console.log(dataList)

        // var locations = [];
        // for (let index = 0; index < dataList.length; index++) {
        //   console.log(dataList[index].LocationName)
        //   locations.push(dataList[index].LocationName)
        //   console.log(locations)

        // }
        // const uniqueData = [...new Set(locations)];
        // setAnimalLocations(uniqueData)
        set_Animals(dataList);

        // set_Animals(dataList);
      } else if (animalsRes?.status?.httpStatus == 401) {

        Alert.alert(
          "Fail",
          animalsRes?.errors ? animalsRes?.errors[0].message : "API error",
          [
            {
              text: "Login again",
              onPress: async () => {
                // console.log("OK Pressed");
                await Utils.clearUserData();
                dispatch(updateStack({ stackName: "Auth" }));
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Fail!",
          animalsRes?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }

  async function getLocations(searchText: string) {
    set_isLoading(true);
    let userID = await Utils.getData("UserId");
    try {
      let locationRes = await NetworkManager.getLocationsByName(
        0,
        0,
        userID,
        searchText,
        "ASC",
        "act"
      );
      set_isLoading(false);
      if (locationRes.status.success && locationRes.response.locationlist) {

        let dataList: LocationObject = locationRes.response.locationlist;
        // let res = dataList.sort((a, b) =>
        //   a.locationDesc < b.locationDesc ? -1 : 1
        // );
        set_Locations(dataList);
      } else if (locationRes?.status?.httpStatus == 401) {
        Alert.alert(
          "Fail",
          locationRes?.errors ? locationRes?.errors[0].message : "API error",
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
          locationRes?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
        );
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      set_isLoading(false);
    }
  }

  const clearSearchSuggestions = () => {
    set_FilteredLocationsList([]);
    setInSearchProgress(false);
    setIsSuggestionVisible(false);
  }
  /**
  * Add to Search History.
  */
  const addToList = async () => {

    if (searchText) {
      setInSearchProgress(true);

      if (selectedSegment === AnimalSegments.Name) {
        firebaseHelper.logEvent(firebaseHelper.Event_Search_Animal, firebaseHelper.Screen_Animals, "");
        let userID = await Utils.getData("UserId");
        try {
          let animalsRes = await NetworkManager.getAnimalsByName(
            0,
            0,
            userID,
            searchText,
            "AnimalName",
            "ASC"
          );
          if (animalsRes?.status?.success && animalsRes?.response?.animalList) {
            //  console.error("animalsRes.response", animalsRes?.response?.animalList);
            let dataList = animalsRes?.response?.animalList;
            // let res = dataList.sort((a, b) =>
            //   a.AnimalName < b.AnimalName ? -1 : 1
            // );
            if (dataList.length) {
              set_FilteredAnimalsList(dataList);
              setInSearchProgress(false);
              setIsSuggestionVisible(true);
            } else {
              clearSearchSuggestions();

              Alert.alert(
                "Alert!",
                "No animals found."
              );
            }
          } else if (animalsRes?.status?.httpStatus == 401) {
            Alert.alert(
              "Fail",
              animalsRes?.errors ? animalsRes?.errors[0].message : "API error",
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
              animalsRes?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
            );
          }
        }
        catch (e) {
          console.error("Error", e);
        } finally {
          set_isLoading(false);
        }
      } else {

        firebaseHelper.logEvent(firebaseHelper.Event_Search_Location, firebaseHelper.Screen_Animals, "");
        let userID = await Utils.getData("UserId");
        try {
          let locationRes = await NetworkManager.getLocationsByName(
            0,
            0,
            userID,
            searchText,
            "ASC",
            "act"
          );
          if (locationRes.status.success && locationRes.response.locationlist) {
            let dataList = locationRes.response.locationlist;
            // let res = dataList.sort((a, b) =>
            //   a.locationDesc < b.locationDesc ? -1 : 1
            // );
            if (dataList.length > 0) {
              set_FilteredLocationsList(dataList);
              setInSearchProgress(false);
              setIsSuggestionVisible(true);

            } else {
              clearSearchSuggestions();

              Alert.alert(
                "Alert!",
                "No locations found."
              );

            }
          } else if (locationRes?.status?.httpStatus == 401) {
            Alert.alert(
              "Fail",
              locationRes?.errors ? locationRes?.errors[0].message : "API error",
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
              locationRes?.errors[0]?.message ?? "The server was unable to process the request. Please try again after some time."
            );
          }
        }
        catch (e) {
          console.error("Error", e);
        } finally {
          set_isLoading(false);
        }
      }
    }
  };

  const rightButtonAction = () => {

    if (!open) {
      firebaseHelper.logEvent(firebaseHelper.Event_Record_Group_Act, firebaseHelper.Screen_Animals, "");
      setOpen(true);
      bottomSheetModalRef.current?.present();
    } else {
      setOpen(false);
      bottomSheetModalRef.current?.close();
    }
  }

  function HeaderUI() {
    return (
      <CommonHeaderComponent navigation={undefined} route={undefined} moduleName={"undefined"}
        headerTitle='Animals'
        isShowBackButton={false}
        backBtnAction={null}
        isShowRightButton={selectedSegment == AnimalSegments.Name}
        rightButtonAction={rightButtonAction}
        rightButtonImage={<MenuIcon
          style={{
            marginLeft: wp("2%"),
            marginRight: wp("5%"),
            marginTop: hp("1%"),
            width: wp("10%"),
            height: wp("10%"),
          }}
        />}

      ></CommonHeaderComponent>
    );
  }

  function SegmentButtonUI() {
    return (
      <View style={styles.segmentViewStyle}>
        <TouchableOpacity
          style={[
            styles.segmentButtonStyle,
            {
              backgroundColor:
                selectedSegment == AnimalSegments.Name
                  ? "#136DA4"
                  : "#C2C2C280",
            },
          ]}
          onPress={() => {
            if (selectedSegment != AnimalSegments.Name) {
              clearSearchSuggestions();
              firebaseHelper.logEvent(firebaseHelper.Event_Search_By_Animal, firebaseHelper.Screen_Animals, "");
              set_selectedSegment(AnimalSegments.Name);
              getAnimals("");
            }
          }}
        >
          <Text
            style={{
              color:
                selectedSegment == AnimalSegments.Name ? "#FFFFFF" : "#3A3A3A",
              fontSize: fonts.fontXSmall,
              ...CommonStyles.textStyleBold,
            }}
          >
            Animal Name
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButtonStyle,
            {
              backgroundColor:
                selectedSegment == AnimalSegments.Location
                  ? "#136DA4"
                  : "#C2C2C280",
            },
          ]}
          onPress={() => {
            if (selectedSegment != AnimalSegments.Location) {
              clearSearchSuggestions();
              firebaseHelper.logEvent(firebaseHelper.Event_Search_By_Location, firebaseHelper.Screen_Animals, "");
              setSearchText("");
              set_selectedSegment(AnimalSegments.Location);
              getLocations("");
            }
          }}
        >
          <Text
            style={{
              color:
                selectedSegment == AnimalSegments.Location
                  ? "#FFFFFF"
                  : "#3A3A3A",
              fontSize: fonts.fontXSmall,
              ...CommonStyles.textStyleBold,
            }}
          >
            Living Location
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        onPress={() => {
          setOpen(false);
          bottomSheetModalRef.current?.close();
        }}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );
  const onChangeDebounced = useDebounce(addToList);

  const changeSearchText = (text: string) => {
    setSearchText(text);
  };



  function animalRowItem(item: AnimalObject) {
    var isExistsInList: boolean = false;

    var updatedTempItems = selectedAnimalsForRGA.filter(itemVal => itemVal.AnimalId === item.AnimalId);
    if (updatedTempItems.length > 0) {
      isExistsInList = true;
    }

    return (
      <View style={styles.ListItemStyle}>
        <LinearGradient
          colors={["#B4F0FC", "#F0F9E9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 20 }}
        >
          <TouchableOpacity
            testID="renderItem"
            onPress={() => {
              if (isRecordGroupActSelected) {
                const updatedItems = selectedAnimalsForRGA.filter(itemVal => itemVal.AnimalId === item.AnimalId);
                if (updatedItems.length == 0) {
                  set_SelectedAnimalsForRGA([...selectedAnimalsForRGA, item]);
                } else {
                  const updatedItems = selectedAnimalsForRGA.filter(itemtemp => itemtemp.AnimalId !== item.AnimalId);
                  set_SelectedAnimalsForRGA(updatedItems);
                }
              } else {
                firebaseHelper.logEvent(firebaseHelper.Event_Select_Animal, firebaseHelper.Screen_Animals, "");
                navigation.navigate("Activities", {

                  type: 1,
                  selectedItem: item,
                  selectedAnimalsList: [item],
                  recordGroupActivity: false,

                });
              }

            }}
          >
            <View style={{ padding: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>

                <Image
                  style={styles.animalImage} source={{ uri: BASE_URL + ANIMAL_IMAGE_LINK + item.AnimalId, cache: 'force-cache' }}></Image>
                <View style={{ flex: 1 }}>
                  <Text style={styles.animalNameSemiBoldStyle} >
                    <Text style={{}}>{item.AnimalName}</Text>
                    <Text style={{}}> - </Text>
                    <Text style={{}}>{item.TattooNumber}</Text>
                  </Text>
                  <Text style={styles.animalNameLightTextStyle}>{item.LocationName}</Text>
                </View>
                {isRecordGroupActSelected ?

                  isExistsInList == true ? <CheckboxSelected
                    style={
                      [
                        {
                          width: wp("6%"),
                          height: wp("6%"),
                        },
                      ]
                    }
                  /> : <CheckBoxEmpty
                    style={[
                      {
                        width: wp("6%"),
                        height: wp("6%"),
                      },
                    ]}
                  />
                  : <RightBackButton />}
                {/* <CheckBoxEmpty
                  style={[
                    {
                      width: wp("6%"),
                      height: wp("6%"),
                    },
                  ]}
                /> */}

              </View>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }



  function locationRowItem(item: any) {
    return (
      <View style={styles.ListItemStyle}>
        <LinearGradient
          //colors={["#B4F0FC", "#F0F9E9"]}
          colors={["#F0F9E9", "#B4F0FC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 20 }}
        >
          <TouchableOpacity
            testID="renderItem"
            onPress={() => {
              firebaseHelper.logEvent(firebaseHelper.Event_Select_Location, firebaseHelper.Screen_Animals, "");
              navigation.navigate("Activities", {
                type: 2,
                selectedItem: item,
                selectedAnimalsList: null,
                recordGroupActivity: false,

              });
            }}
          >
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={styles.locationImage}
                  source={location_icon}
                ></Image>
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <Text style={styles.animalNameSemiBoldStyle}>{item.locationDesc}</Text>
                </View>
                <RightBackButton />
              </View>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  const FilteredListUI: React.FC<any> = (props) => {
    const Item = (data: any) => {
      return (
        <Pressable
          onPress={() => {
            if (selectedSegment == AnimalSegments.Name) {
              const updatedItems = selectedAnimalsList.filter(item => item.AnimalId === data.AnimalId);
              if (updatedItems.length == 0) {
                set_SelectedAnimalsList([...selectedAnimalsList, data]);
              }
            } else {
              const updatedItems = selectedLocationsList.filter(item => item.facilityLocationId === data.facilityLocationId);
              if (updatedItems.length == 0) {
                set_SelectedLocationsList([...selectedLocationsList, data]);
              }
            }
            setSearchText("");
            setIsSuggestionVisible(false);
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? Colors.PRESS : "white",
            },
            styles.wrapperOnpress,
          ]}
        >
          <View style={styles.item}>
            <Text style={styles.title}>{selectedSegment == AnimalSegments.Name ? data.AnimalNameTattoo : data.locationDesc}</Text>
          </View>
        </Pressable>
      );
    };

    return (
      <View style={[styles.searchSuggestion]}>
        <Pressable
          onPress={() => {
            console.log("onPress");
            setSearchText("");
            setIsSuggestionVisible(false);
          }}
        >
          <Image
            style={{ alignSelf: "flex-end", height: 15, width: 15, margin: 2 }}
            source={close_icon}
          />
        </Pressable>
        <FlatList
          ItemSeparatorComponent={() => { return (<View style={{ height: 1, backgroundColor: Colors.LIGHT_GRAY }} />) }}
          data={props.data}
          renderItem={({ item }) => Item(item)}
          keyExtractor={(item) => item.AnimalName}
        />
      </View>
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
            borderBottomColor: 'black',
            flex: 1,
            height: 0.5,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
    );
  };
  function AnimalsDefaultList() {
    let list = selectedAnimalLocations.length == 0 ? animals : animals?.filter((item) => selectedAnimalLocations.includes(item.LocationName));
    return (<FlatList
      data={list}
      renderItem={({ item, index }) => animalRowItem(item)}
      keyExtractor={(item) => item.AnimalId.toString()}
    />);
  }

  const renderLocationDropDownItem = (item) => {
    console.log("selectedAnimalLocations")

    console.log(selectedAnimalLocations)
    const updatedItems = selectedAnimalLocations.filter(item1 => item1 === item.locationDesc);
    return (
      <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center' }}>
        {updatedItems.length > 0 ? (
          <CheckboxSelected
            style={[
              {
                width: wp("6%"),
                height: wp("6%"),
              },
            ]}
          />
        ) : (<CheckBoxEmpty
          style={[
            {
              width: wp("6%"),
              height: wp("6%"),
            },
          ]}
        />)}
        <Text style={[CommonStyles.textStyleRegular, { paddingLeft: 5 }]}>{item.locationDesc}</Text>

      </View>
    );
  };
  return (

    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <HeaderUI />
      <SegmentButtonUI />
      <View style={{ backgroundColor: selectedSegment == AnimalSegments.Name ? selectedAnimalsList.length > 0 ? 'rgba(160, 215, 217, 0.4)' : "#ffffff" : selectedLocationsList.length > 0 ? 'rgba(160, 215, 217, 0.4)' : "#ffffff", borderRadius: 10, margin: 10 }}>


        {selectedSegment == AnimalSegments.Name ?


          (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <SearchUI
                  placeHolder={
                    "Search animal by name"
                  }
                  segmentType={selectedSegment}
                  changeSearchText={changeSearchText}
                  searchText={searchText}
                  addToList={addToList}
                  isInProgress={inSearchProgress}
                />
              </View>
              <View style={{
                padding: 8, width: wp('40%'),

              }}>
                <MultiSelect
                  style={{
                    height: 40,
                    backgroundColor: 'transparent',
                    borderRadius: 6,
                    borderColor: "#242E4226",
                    borderWidth: 1,
                    padding: 8
                    // borderBottomColor: 'gray',
                    // borderBottomWidth: 0.5,
                  }}
                  visibleSelectedItem={false}
                  placeholderStyle={{ fontSize: 16, }}
                  // selectedTextStyle={{ fontSize: 14, }}
                  // inputSearchStyle={styles.inputSearchStyle}
                  // iconStyle={styles.iconStyle}
                  activeColor='white'
                  data={locations}
                  search={false}
                  labelField="locationDesc"
                  valueField="locationDesc"
                  placeholder="Location"
                  searchPlaceholder="Search..."
                  value={selectedAnimalLocations}
                  onChange={item => {
                    setSelectedAnimalLocations(item);
                  }}
                  renderItem={renderLocationDropDownItem}


                  selectedStyle={{ backgroundColor: "blue" }}
                />
              </View>
            </View>

          )
          : <SearchUI
            placeHolder={
              "Search by living location"
            }
            segmentType={selectedSegment}
            changeSearchText={changeSearchText}
            searchText={searchText}
            addToList={addToList}
            isInProgress={inSearchProgress}
          />}
        {selectedSegment == AnimalSegments.Name ?
          <FlatList
            data={selectedAnimalsList}
            horizontal={false}
            numColumns={2}
            style={{ alignSelf: 'flex-start' }}
            renderItem={({ item, index }) => (
              <View style={{ alignItems: "center", margin: 2 }}>
                <CustomChip style={{ width: width / 2.3 }} textLableStyle={{ color: 'black', }} textLable={item.AnimalNameTattoo} onClose={function (): void {

                  const updatedItems = selectedAnimalsList.filter(item => item.AnimalId !== selectedAnimalsList[index].AnimalId);
                  set_SelectedAnimalsList(updatedItems);
                }
                } isEnableClose={true} backgroundColor={"white"} />
              </View>
            )}
          /> : <FlatList
            data={selectedLocationsList}
            horizontal={false}
            numColumns={2}
            style={{ alignSelf: 'flex-start' }}
            renderItem={({ item, index }) => (
              <View style={{ alignItems: "center", margin: 2 }}>

                <CustomChip style={{ width: width / 2.3 }} textLableStyle={{ color: 'black', }} textLable={item.locationDesc} onClose={function (): void {

                  const updatedItems = selectedLocationsList.filter(item => item.facilityLocationId !== selectedLocationsList[index].facilityLocationId);
                  set_SelectedLocationsList(updatedItems);
                }
                } isEnableClose={true} backgroundColor={"white"} />
              </View>
            )}
          />}
      </View>

      <View style={{ flex: 1 }}>

        {selectedSegment == AnimalSegments.Name ? (
          selectedAnimalsList.length > 0 ?
            <FlatList
              data={selectedAnimalsList}
              renderItem={({ item, index }) => animalRowItem(item)}
              keyExtractor={(item) => item.AnimalId.toString()}
            /> :

            <AnimalsDefaultList></AnimalsDefaultList>

        ) :
          selectedLocationsList.length > 0 ?
            <FlatList
              data={selectedLocationsList}
              renderItem={({ item, index }) => locationRowItem(item)}
              keyExtractor={(item) => item.facilityLocationId.toString()} /> :
            <FlatList
              data={locations}
              renderItem={({ item, index }) => locationRowItem(item)}
              keyExtractor={(item) => item.facilityLocationId.toString()}
            />
        }
      </View>

      {
        isRecordGroupActSelected && selectedSegment == AnimalSegments.Name ? <View style={{
          width: wp("100%"),
          height: hp("10%"),
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: "center",
          justifyContent: 'center'

        }}>
          <View style={{ width: wp("40%"), marginRight: 5 }}>

            <BottomButtonComponent
              style={{ width: 100 }}
              title={"Cancel"}
              buttonClick={function (): void {

                set_SelectedAnimalsForRGA([]);
                setIsRecordGroupActSelected(false);
                navigation.pop();
              }}
              buttonType={"cancel"}
            ></BottomButtonComponent>
          </View>
          <View style={{ width: wp("40%"), marginLeft: 5 }}>
            <BottomButtonComponent
              style={{ width: 100 }}
              title={"Next"}
              buttonClick={function (): void {
                //navigation.pop();
                if (selectedAnimalsForRGA.length > 0) {
                  firebaseHelper.logEvent(firebaseHelper.Event_Record_Group_Act_Next, firebaseHelper.Screen_Animals, "");
                  navigation.navigate("Activities", {
                    type: 1,
                    selectedItem: selectedAnimalsForRGA[0],
                    selectedAnimalsList: selectedAnimalsForRGA,
                    recordGroupActivity: true,

                  });
                }

              }}
              buttonType={"submit"}
            ></BottomButtonComponent>
          </View>
        </View> : null
      }

      {/* {isLoading == true ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
        <View></View>
      )} */}
      {/* {selectedSegment == AnimalSegments.Name ? (
        <AnimalsListUI></AnimalsListUI>
      ) : (
        <LocationListUI></LocationListUI>
      )} */}

      {
        isSuggestionVisible ?
          <FilteredListUI
            data={selectedSegment == AnimalSegments.Name ? filteredAnimalsList : filteredLocationsList}
          />
          : null
      }
      <LoadingModal visible={isLoading} text="Loading..." />

      <BottomSheetModal
        snapPoints={snapPoints}
        ref={bottomSheetModalRef}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        backgroundStyle={{ backgroundColor: "#ffffff" }}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Pressable
            style={{ padding: 10 }}
            onPress={() => {
              setIsRecordGroupActSelected(true);
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
                Record Group ACT
              </Text>
            )}
          </Pressable>
          {divider()}

          <Pressable
            style={{ padding: 10 }}
            onPress={() => {
              set_SelectedAnimalsForRGA([]);
              setIsRecordGroupActSelected(false);
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

        </View>
      </BottomSheetModal>
    </View >
  );

};


type SerachUIProps = {

  placeHolder: string;
  changeSearchText: (text: string) => void;
  addToList: () => void;
  searchText: string;
  isInProgress: boolean;
  segmentType: AnimalSegments;
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
          placeholderTextColor={Colors.GRAY}
        />
      </View>

    </View>
  );
};

//Styles used in this screen are defined here
const styles = StyleSheet.create({
  contentContainer: {
    marginTop: hp("1%"),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomColor: "white",
    shadowColor: Colors.LIGHT_GRAY,
    justifyContent: "center",
    marginBottom: hp("2%"),
  },
  searchSuggestion: {
    backgroundColor: "#fff",
    borderColor: Colors.GRAY,
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    minHeight: hp("10%"),
    maxHeight: hp("25%"),
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    padding: 2,
    position: "absolute",
    top: hp("22.5%"),
    width: wp("90%"),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  segmentViewStyle: {
    flexDirection: "row",
    height: 25,
    marginLeft: wp("2%"),
    marginRight: wp("2%")
  },
  Header: {
    backgroundColor: "#FFF",
    marginBottom: hp("2%"),
    marginLeft: wp("2%"),
    flexDirection: "row",
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
  ListItemStyle: {
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    marginBottom: hp("1%"),
    // marginTop: hp("1%"),
    flex: 1,
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
    borderRadius: 25,
  },
  segmentButtonStyle: {
    flex: 1,
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  wrapperOnpress: {
    borderRadius: 3,
    padding: 5,
  },
  item: {
    marginVertical: hp("0.5%"),
    marginHorizontal: wp("0.5%"),
    borderBottomColor: Colors.GRAY,


  },
  title: {
    fontSize: 14,
  },
  operationTextStyle: {
    fontSize: 16,
    margin: 8
  },

  animalNameSemiBoldStyle: {
    color: '#000000',
    fontSize: fonts.fontXSmall,
    ...CommonStyles.textStyleSemiBold,
    textAlign: 'left',
  },
  animalNameLightTextStyle: {
    fontSize: fonts.fontMedium,
    ...CommonStyles.textStyleLight,
    textAlign: 'left',
  },
});

export default AnimalHomeScreen;



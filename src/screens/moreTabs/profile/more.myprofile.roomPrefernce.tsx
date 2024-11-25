import React, { useRef } from "react";
import { useEffect, useState } from "react";
import HeaderComponent from "../../../components/headerComponent";
import { useTranslation } from "react-i18next";
import { RoomPreferenceParamList } from "../../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Alert,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import RoomStyles from "../../../styles/roomPreference.style";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../../../styles/commonstyles";
import Colors from "../../../styles/color";
import { Provider, useDispatch, useSelector } from "react-redux";
import NetworkManager from "../../../network/network.manager";
import store, { RootState } from "../../../redux/store";
import { saveUserInfo } from "../../../redux/slices/userInfo.slicer";
import BottomButtonComponent from "../../../components/button.component";
import BottomSheetStyle from "../../../styles/bottonsheet.style";
import CheckBoxEmpty from "../../../../assets/svgs/checkbox_empty.svg";
import CheckBoxSelected from "../../../../assets/svgs/checkbox_selected.svg";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
//import LocationsModel from "../../../model/location_model";
import Utils from "../../../utils";
import { ScrollView } from "react-native-gesture-handler";
import { Species } from "../../../model/species_model";
import DropDownComponent, {
  RoomType,
  SpeciesType,
} from "../../../components/dropdown.component";
import _ from "lodash";
import LoadingModal from "../../../components/loadingModel";
import CustomChip from "../../../components/custom_chip";
import { updateStack } from "../../../redux/slices/login.slicer";
import { UserInfo } from "../../../model/rooom_preference_model";
import { AlertType } from "../../../components/alert.component";
import { showToast } from "../../../components/custom.toast.message";
import * as firebaseHelper from "../../../utilities/firebase/firebaseHelper";
import fonts, { fontFamily } from "../../../fonts/fonts";

type MoreRoomPreferenceProps = NativeStackScreenProps<RoomPreferenceParamList>;

const RoomPreferenceScreen = ({
  route,
  navigation,
}: MoreRoomPreferenceProps) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const data = useSelector((state: RootState) => state.userInfo);
  const { t } = useTranslation();
  const [valueSpecies, setValueSpecies] = useState("Default Species");

  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [buildings, setBuildings] = useState<LocationResponse[]>([]);
  const [buildingList, setBuildingList] = useState<string[]>([]);
  const [selectedBuildingList, setSelectedBuildingList] = useState<string[]>([]);


  const [isOpened, setDropDownOpened] = useState(false);
  const [isRoomOpened, setRoomDropDownOpened] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [roomdata, setRoomData] = useState<RoomType[]>([]);
  const [roomdataGlobal, setRoomDataGlobal] = useState<RoomType[]>([]);
  const [roomdataFIlter, setRoomDataFIlter] = useState<RoomType[]>([]);
  const [roomSelectedList, setRoomSelctedList] = useState<RoomType[]>([]);
  const [speciesData, setSpeciesData] = useState<SpeciesType[]>([]);
  const scrollViewRef = useRef(null);
  const [lastScrollX, setLastScrollX] = useState(0);

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Room_Preference);
    loadData();
  }, []);

  // useEffect(() => {
  //   let count = roomdata.filter((item) => item.isSelected === true);
  //   setRoomSelctedList(count);
  // }, [roomdata]);
  async function loadData() {
    let userId = await Utils.getData("UserId");
    let response = await NetworkManager.doGetUserInfo(userId ?? "0");
    dispatch(saveUserInfo(response));

    let name = response?.response?.preferences?.speciesPreferences?.speciesName;
    setValueSpecies(name ?? "Select Default Species");
    let preferedSpeciesId =
      response?.response?.preferences?.speciesPreferences?.speciesId ?? '0';
    let speciesResponse: Species = await NetworkManager.getSpeciesList();
    let speciesList: SpeciesType[] = speciesResponse?.response;
    speciesList.forEach((t) => {
      t.type = "species";
    });

    let speciesIndex = speciesList.findIndex(
      (item) => item.speciesId === preferedSpeciesId
    );

    setSelectedIndex(speciesIndex);

    setSpeciesData(speciesList);
    //It's not taking from redx
    getRoomLocations(preferedSpeciesId, response);
  }

  async function getRoomLocations(speciesId: number, response: UserInfo) {
    try {
      setLoading(true);
      let locationRes = await NetworkManager.getRoomsListBasedOnSpecies(
        speciesId
      );
      let rooms: RoomType[] = locationRes?.response?.locationlist;



      var tempSelectedList: RoomType[] = [];

      var _rooms = response?.response?.preferences?.locationPreferences;
      rooms.forEach((t) => {
        t.type = "room";
        let counter = _rooms?.filter(
          (item: RoomType) => item.room === t.room).length;
        if (counter > 0) {
          t.isSelected = true;

          tempSelectedList.push(t);

        }
      });

      setRoomSelctedList(tempSelectedList);
      setRoomData(rooms);
      //TODO need udpate global data
      setRoomDataGlobal(rooms);
      //setRoomDataFIlter(rooms);

      setLocations(rooms);

      var temp: any[] = [];
      rooms.map((item: RoomType) => {
        temp = [...temp, item.buildingCode]
      })
      const uniqueData = [...new Set(temp)];
      setBuildingList(uniqueData)

      var temp2: any[] = [];
      tempSelectedList.map((item: RoomType) => {
        temp2 = [...temp2, item.buildingCode]
      })
      const uniqueData2 = [...new Set(temp2)];
      setSelectedBuildingList(uniqueData2)
      let pp = rooms.filter((ele, ind) => ind === rooms.findIndex(elem => elem.buildingCode === ele.buildingCode))

      setBuildings(pp)
      var temp3: RoomType[] = [];
      uniqueData2.forEach(item => {
        const updatedItems = rooms.filter(itemVal => itemVal.buildingCode === item);
        temp3 = [...temp3, ...updatedItems];
      })
      setRoomDataFIlter(temp3)
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

  }

  const chipsVies = (ob: RoomType) => {
    return (

      <CustomChip
        textLable={ob?.room ?? ""}
        textLableStyle={[CommonStyles.textStyleRegular, { fontSize: 14 }]}
        onClose={function (): void {
          const updatedItems = roomSelectedList.filter(itemVal => itemVal.facilityLocationId !== ob.facilityLocationId);
          setRoomSelctedList(updatedItems);

        }}
        isEnableClose={true}
        backgroundColor={Colors.CHIP_COLOR}
      />

    );
  };

  function rederItem(item: any) {
    return (
      <Pressable
        onPress={() => {
          let tempRoom = [...roomdataGlobal];

          if (selectedBuildingList.includes(item)) {
            const updatedItems = selectedBuildingList.filter(itemVal => itemVal !== item);
            const data = tempRoom.filter((filterItem) => {
              return updatedItems.includes(filterItem.buildingCode ?? "")
            })
            setSelectedBuildingList(updatedItems)
            if (data.length > 0) {
              setRoomDataFIlter(data);
            } else {

              setRoomDataFIlter(tempRoom);
            }
            const updatedSelectedItems = roomSelectedList.filter(itemVal => itemVal.buildingCode !== item);
            setRoomSelctedList(updatedSelectedItems);
          }
          else {
            var temp = [...selectedBuildingList, item]
            const data = tempRoom.filter((filterItem) => {
              return temp.includes(filterItem.buildingCode ?? "")
            })
            if (data.length > 0) {
              setRoomDataFIlter(data);
            } else {

              setRoomDataFIlter(tempRoom);
            }
            setSelectedBuildingList(temp)
          }

        }}
        style={BottomSheetStyle.rowItemStyle}
      >
        <View style={{ flexDirection: "row", marginLeft: wp('2%') }}>
          {selectedBuildingList.includes(item) ? (
            <CheckBoxSelected
              style={[
                {
                  width: wp("6%"),
                  height: wp("6%"),
                },
              ]}
            />
          ) : (
            <CheckBoxEmpty
              style={[
                {
                  width: wp("6%"),
                  height: wp("6%"),
                },
              ]}
            />
          )}
          <Text style={{
            fontFamily: fontFamily.semibold,
            fontSize: fonts.fontSmall,
            marginLeft: wp("2%"),
          }}>{item}</Text>
        </View>
      </Pressable>
    );
  }

  const itemSelectionUpdate = (index: number) => {
    setSelectedIndex(index);
    setDropDownOpened(false);
    setValueSpecies(speciesData[index]?.speciesName);
    getRoomLocations(speciesData[index]?.speciesId, data?.userInfo);
  };



  const isAllRoomsSelected = () => {
    if (selectedBuildingList.length == 0) {
      return roomSelectedList.length == roomdataFIlter.length ? true : false;
    }

    const updatedItems1 = roomSelectedList.filter(itemVal => selectedBuildingList.includes(itemVal.buildingCode ?? ""));
    const updatedItems2 = roomdataFIlter.filter(itemVal => selectedBuildingList.includes(itemVal.buildingCode ?? ""));
    return updatedItems1.length == updatedItems2.length ? true : false
  }
  return (
    <LinearGradient
      colors={[Colors.GRADENT_COLOR_LIGTH, Colors.GRADENT_COLOR_DARK]}
      style={CommonStyles.mainComponentStyle}
    >
      <View style={[CommonStyles.mainContainer, { paddingTop: insets.top }]}>
        <HeaderComponent
          navigation={undefined}
          route={undefined}
          moduleName={"Room Preferences"}
          headerColor={"red"}
        />

        <ScrollView contentContainerStyle={{ paddingBottom: hp("10%") }}>
          <View style={RoomStyles.mainContainer}>
            <Text
              style={[
                CommonStyles.textStyleMedium,
                { color: "#2F3148", fontSize: 20, marginLeft: 5 },
              ]}
            >
              {t("more.current_mapp")}
            </Text>

            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <FlatList
                data={
                  data?.userInfo?.response?.preferences?.locationPreferences
                }
                numColumns={2}
                style={{ flex: 2 }}
                keyExtractor={(item) => item.room.toString()}
                renderItem={({ item }) => {
                  return (
                    <View style={{ width: wp("40%") }}>
                      <CustomChip
                        textLableStyle={[
                          CommonStyles.textStyleRegular,
                          { fontSize: 14 },
                        ]}
                        textLable={item.room}
                        onClose={function (): void {
                        }}
                        isEnableClose={false}
                        backgroundColor={Colors.CHIP_COLOR}
                      />
                    </View>
                  );
                }}
              />
            </View>

            <View style={{ marginBottom: 5, marginTop: 15 }}>
              <DropDownComponent
                title={valueSpecies}
                type="species"
                isAllRoomsSelected={false}
                selectedIndex={selectedIndex}
                data={speciesData}
                allSelectedData={[]}
                allFilterdData={[]}
                dropDownType={"normal"}
                isOpened={isOpened}
                onButtonCallback={() => {
                  setDropDownOpened(!isOpened);
                }}
                onSelectionCallback={(index) => {
                  itemSelectionUpdate(index);
                }}
                onSelectionAllCallback={() => {
                }}
              />
            </View>

            <View style={{ marginBottom: 5, marginTop: 10 }}>
              <View style={{

                backgroundColor: 'white',
                borderColor: '#C8CDD6',
                borderWidth: 1,
                maxHeight: hp('35%'),
                borderRadius: 10,
                flexDirection: 'column',
                //  alignItems: 'center',
                height: hp('10%'),
                paddingLeft: wp('5%'),
                paddingRight: wp('5%'),
                paddingTop: hp('1%'),
                paddingBottom: hp('1%'),
              }}>
                <Text
                  style={[
                    CommonStyles.textStyleMedium,
                    { color: "#2F3148", fontSize: 20, marginLeft: 5 },
                  ]}
                >
                  {("Building")}
                </Text>

                <FlatList
                  data={buildingList}
                  horizontal={true}
                  renderItem={({ item }) => {
                    return (
                      <View style={{}}>{rederItem(item)}</View>
                    );
                  }}
                />
              </View>
            </View>


            <View style={{ marginBottom: 5, marginTop: 10 }}>
              <DropDownComponent
                title={"Rooms"}
                type="room"
                data={roomdataFIlter}
                allSelectedData={roomSelectedList}
                allFilterdData={roomdataFIlter}
                isAllRoomsSelected={isAllRoomsSelected()}
                dropDownType={"checkbox"}
                isOpened={isRoomOpened}
                onButtonCallback={() => {
                  setRoomDropDownOpened(!isRoomOpened);
                }}
                onSelectionCallback={(index) => {
                  let list = roomSelectedList?.filter((itemChild) => itemChild.facilityLocationId === roomdataFIlter[index].facilityLocationId);
                  if (list.length == 0) {
                    var temp = [...roomSelectedList, roomdataFIlter[index]]
                    setRoomSelctedList(temp);
                  } else {
                    const updatedItems = roomSelectedList.filter(itemVal => itemVal.facilityLocationId !== roomdataFIlter[index].facilityLocationId);
                    setRoomSelctedList(updatedItems);
                  }
                }}
                onSelectionAllCallback={() => {
                  if (isAllRoomsSelected()) {
                    if (selectedBuildingList.length == 0) {
                      setRoomSelctedList([])
                    } else {
                      const updatedItems = roomSelectedList.filter(itemVal => !selectedBuildingList.includes(itemVal.buildingCode ?? ""));
                      setRoomSelctedList(updatedItems)
                    }
                  } else {

                    if (selectedBuildingList.length == 0) {
                      var temp1 = [...roomdataFIlter];

                      setRoomSelctedList(temp1)

                    } else {
                      var temp = [...roomSelectedList];
                      temp = [...roomSelectedList, ...roomdataFIlter]
                      const ids = temp.map(({ facilityLocationId }) => facilityLocationId);
                      const filtered = temp.filter(({ facilityLocationId }, index) => !ids.includes(facilityLocationId, index + 1));

                      setRoomSelctedList(filtered)
                    }


                  }
                }}

              />
            </View>

            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <FlatList
                data={roomSelectedList}
                numColumns={2}
                style={{ flex: 2 }}
                renderItem={({ item }) => {
                  return (
                    <View style={{ width: wp("40%") }}>{chipsVies(item)}</View>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            width: "100%",
            height: hp("12%"),
            flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0, //Here
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              height: hp("10%"),
              marginBottom: 5,
              alignContent: "center",
            }}
          >
            <View
              style={{ width: wp("40%"), alignSelf: "center", marginRight: 5 }}
            >
              <BottomButtonComponent
                style={{ width: 100 }}
                title={"Cancel"}
                buttonClick={function (): void {
                  Alert.alert(
                    "Are you sure?",
                    "Changes won't be saved. Proceed?",
                    [
                      {
                        text: "No",
                        onPress: () => { },
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          firebaseHelper.logEvent(firebaseHelper.Event_Cancel_Room_Preference, firebaseHelper.Screen_Room_Preference, "");
                          navigation.pop();
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }}
                buttonType={"cancel"}
              ></BottomButtonComponent>
            </View>
            <View
              style={{ width: wp("40%"), alignSelf: "center", marginLeft: 5 }}
            >
              <BottomButtonComponent
                style={{ width: 100 }}
                title={"Submit"}
                buttonClick={() => {
                  //TODO need to verify empty
                  // let result = roomdata?.filter((d) => d.isSelected);
                  if (roomSelectedList.length > 0) {
                    Alert.alert(
                      "",
                      "Are you sure you would like to Submit?",
                      [
                        {
                          text: "No",
                          onPress: () => { },
                          style: "cancel",
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            firebaseHelper.logEvent(firebaseHelper.Event_Submit_Room_Preference, firebaseHelper.Screen_Room_Preference, "");
                            submitRequest(speciesData[selectedIndex]);
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  } else {
                    // Utils.showToastMessage("At least one room is required.")
                    Alert.alert("At least one room is required.");
                  }
                }}
                buttonType={"submit"}
              ></BottomButtonComponent>
            </View>
          </View>
        </View>
      </View>

      <LoadingModal visible={loading} text="Loading..." />
    </LinearGradient>
  );
  async function submitRequest(species: SpeciesType) {
    //let result = data.filter((d) => d.isSelected);

    let selectedIds: number[] = [];
    roomSelectedList?.forEach((element) => {
      selectedIds.push(element.facilityLocationId ?? 0);
    });
    //if (result.length > 0) {
    let userID = (await Utils.getData("UserId")) ?? "0";
    let requestObject = {
      UserId: Number(userID),
      FacilityLocationId: selectedIds,
      SpeciesId: species?.speciesId ?? 0,
    };
    try {
      setLoading(true);
      let result = await NetworkManager.setRoomPreference(requestObject);
      if (result && result?.status?.httpStatus === 200) {
        // Alert.alert(result?.response?.message);
        // Utils.showToastMessage(result?.response?.message);
        showToast(result?.response?.message, "success");

        //navigation.pop(); //as per feedback not navigating to previous scren
        //roomSelectedList=[];
        setRoomSelctedList([])
        loadData();
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
        showToast(result?.response?.error[0]?.message ??
          "The server was unable to process the request. Please try again after some time", "info");
      }
    } catch {
    } finally {
      setLoading(false);
    }

    // }
  }
};

export default RoomPreferenceScreen;

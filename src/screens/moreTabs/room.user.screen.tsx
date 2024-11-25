import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MoreTabsStackParamList } from "../../navigation/types";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../../styles/commonstyles";
import HeaderComponent from "../../components/headerComponent";
import { useTranslation } from "react-i18next";
import Close from "../../../assets/svgs/X.svg";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { ActivityIndicator, Chip } from "react-native-paper";
import fonts from "../../fonts/fonts";
import NetworkManager from "../../network/network.manager";
import { Response, Rooms } from "../../model/rooms_model";
import Search from "./../../../assets/svgs/search.svg";
import Colors from "../../styles/color";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { updateStack } from "../../redux/slices/login.slicer";
import { ERROR_CODES } from "../../utils";
import CustomChip from "../../components/custom_chip";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";
import { useDebounce } from "../../utilities/useDebounce";

let close_icon = require("./../../../assets/icons/close.png");
type moreTabsScreenProps = NativeStackScreenProps<
  MoreTabsStackParamList,
  "RoomUserMonitor"
>;
export enum RoomSegments {
  Room,
  User,
}
type Data = {
  key: string;
  value: Response[];
};
var width = Dimensions.get("window").width;
const RoomUserMonitor = ({ route }: moreTabsScreenProps) => {

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedSegment, set_selectedSegment] = useState(RoomSegments.Room);
  const [searchText, setSearchText] = React.useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [roomList, setRoomList] = useState<Data[] | undefined>();
  const [usersList, setUsersList] = useState<Data[]>();
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [inSearchProgress, setInSearchProgress] = useState(false);

  const [roomListDisplay, setRoomListDisplay] = useState<Data[] | undefined>();
  const [usersListDisplay, setUsersListDisplay] = useState<Data[]>();
  const dispatch = useDispatch();

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Room_User_Monitor);

  }, []);

  useEffect(() => {
    const minLength = 2; //(selectedSegment === AnimalSegments.Location) ? 1 : 3
    if (searchText.length >= minLength) {
      onChangeDebounced();
    }
  }, [searchText])




  function SegmentButtonUI() {
    return (
      <View style={styles.segmentViewStyle}>
        {/* Rooms */}
        <TouchableOpacity
          style={[
            styles.segmentButtonStyle,
            {
              backgroundColor:
                selectedSegment == RoomSegments.Room ? "#136DA4" : "#C2C2C280",
            },
          ]}
          onPress={() => {
            if (selectedSegment != RoomSegments.Room) {
              firebaseHelper.logEvent(firebaseHelper.Event_Select_Room_Tab, firebaseHelper.Screen_Room_User_Monitor, "");
              set_selectedSegment(RoomSegments.Room);
              setIsSuggestionVisible(false);
              setSearchText("");
            }
          }}
        >
          <Text
            style={{
              color:
                selectedSegment == RoomSegments.Room ? "#FFFFFF" : "#3A3A3A",
              fontSize: fonts.fontSmall,
              ...CommonStyles.textStyleBold,
            }}
          >
            {t("more.room")}
          </Text>
        </TouchableOpacity>

        {/* Users */}
        <TouchableOpacity
          style={[
            styles.segmentButtonStyle,
            {
              backgroundColor:
                selectedSegment == RoomSegments.User ? "#136DA4" : "#C2C2C280",
            },
          ]}
          onPress={() => {
            if (selectedSegment != RoomSegments.User) {
              firebaseHelper.logEvent(firebaseHelper.Event_Select_User_Tab, firebaseHelper.Screen_Room_User_Monitor, "");
              set_selectedSegment(RoomSegments.User);
              setIsSuggestionVisible(false);
              setSearchText("");
            }
          }}
        >
          <Text
            style={{
              color:
                selectedSegment == RoomSegments.User ? "#FFFFFF" : "#3A3A3A",
              fontSize: fonts.fontSmall,
              ...CommonStyles.textStyleBold,
            }}
          >
            {t("more.user")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  const changeSearchText = (text: string) => {
    setSearchText(text);
  };
  /**
   * Add to Search History.
   */


  const addToList = async () => {
    if (searchText) {
      try {
        setInSearchProgress(true);
        if (selectedSegment == RoomSegments.Room) {
          let list: Rooms = await NetworkManager.getRoomAndUserList(
            searchText,
            1
          );

          if (list?.status?.httpStatus == 200) {
            let temp: Data[] = [];
            for (const key in list.response) {
              // Get the strongly typed value with this name:
              const value1 = list.response[key];

              temp.push({ key: key, value: value1 });
            }
            setRoomList(temp);
            if (temp.length > 0) {

              setIsSuggestionVisible(true);
            } else {
              // setIsSuggestionVisible(false);
            }
          } else {
            setIsSuggestionVisible(false);
            console.error("Empty response", list?.errors[0]);
            if (list?.status?.httpStatus == ERROR_CODES.INVALID_JWT_TOKE) {
              Alert.alert(
                "Error",
                list?.errors[0]?.message ?? "Please try again.",
                [
                  {
                    text: "OK",
                    onPress: () => {

                      dispatch(updateStack({ stackName: "Auth" }));
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          }
        } else {
          //setUsers([...users, searchText]);

          let list = await NetworkManager.getRoomAndUserList(searchText, 2);
          let temp: Data[] = [];
          for (const key in list.response) {
            // Get the strongly typed value with this name:
            const value = list.response[key];

            temp.push({ key: key, value: value });
          }
          setUsersList(temp);
          if (temp.length > 0) {
            //setUsersList(temp);
            setIsSuggestionVisible(true);
          }
        }
        //setSearchText("");
      } finally {
        setInSearchProgress(false);
      }
    }
  };

  const onChangeDebounced = useDebounce(addToList);

  type SuggestionProps = {
    data: Data | undefined;
  };
  const SuggestionList: React.FC<SuggestionProps> = (props) => {
    /**
     *  List Item for suggestions.
     * @param data
     * @returns
     */
    const Item = (data: Data) => {
      return (
        <Pressable
          onPress={() => {

            if (selectedSegment == RoomSegments.Room) {
              if (!rooms.includes(data.key)) {

                setRooms([...rooms, data.key]);
              }

              const dupCopy = JSON.parse(JSON.stringify(roomListDisplay ?? []));
              const isKeyContain = dupCopy.map(
                (item: Data) => item.key == data.key
              );
              if (!isKeyContain[0] || isKeyContain.length == 0) {
                const listData: Data = data;
                const updatedData = [...dupCopy, listData];
                setRoomListDisplay(updatedData);
                //setRoomListDisplay([listData]);
              }
            } else {
              if (!users.includes(data.key)) {
                setUsers([...users, data.key]);
              }
              const dupCopy = JSON.parse(
                JSON.stringify(usersListDisplay ?? [])
              );
              //const keysList = dupCopy.map((item: Data) => item.key);
              const isKeyContain = dupCopy.map(
                (item: Data) => item.key == data.key
              );
              if (!isKeyContain[0] || isKeyContain.length == 0) {

                const listData: Data = data;
                const updatedData = [...dupCopy, listData];
                setUsersListDisplay(updatedData);
                //setRoomListDisplay([listData]);
              }
            }

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
            <Text style={styles.title}>{data.key}</Text>
          </View>
        </Pressable>
      );
    };

    return (
      <View style={[styles.searchSuggestion]}>
        <Pressable
          onPress={() => {
            setIsSuggestionVisible(false);
          }}
        >
          <Image
            style={{ alignSelf: "flex-end", height: 15, width: 15, margin: 2 }}
            source={close_icon}
          />
        </Pressable>
        {props?.data?.length == 0 ? <Text style={[CommonStyles.textStyleLight, { alignSelf: 'center' }]}>No matching records found!</Text> : null}
        <FlatList
          ItemSeparatorComponent={() => { return (<View style={{ height: 1, backgroundColor: Colors.LIGHT_GRAY }} />) }}
          data={props.data}
          renderItem={({ item }) => Item(item)}
          keyExtractor={(item) => item.key}
        />
      </View>
    );
  };

  return (

    <LinearGradient
      colors={["#F1F9E8", "#ACEEFE"]}
      style={[CommonStyles.mainComponentStyle]}
    >
      <View
        style={[
          styles.mainContainer,
          {
            paddingTop: insets.top
          },
        ]}
      >
        <HeaderComponent
          navigation={undefined}
          route={undefined}
          moduleName={t("more.room_title")}
          headerColor={"#FFF"}
        />
        <SegmentButtonUI />
        <View style={{ backgroundColor: "#A0D7D966", borderRadius: 10, }}>
          <SearchUI
            placeHolder={
              selectedSegment == RoomSegments.Room
                ? "Search by Room"
                : "Search by User"
            }
            changeSearchText={changeSearchText}
            searchText={searchText}
            addToList={addToList}
            isInProgress={inSearchProgress}
          />

          <View style={{ alignItems: "center", marginBottom: 5 }}>
            {selectedSegment === RoomSegments.Room ? (
              <SearchItemsUI
                segment={selectedSegment}
                data={rooms}
                onClose={(index, key) => {
                  let dupRooms = [...rooms];
                  dupRooms.splice(index, 1);
                  setRooms([...dupRooms]);

                  // const dupCopy = JSON.parse(JSON.stringify(roomListDisplay ?? []));;

                  let listTemp = roomListDisplay?.filter(
                    (data) => data.key != key
                  );


                  setRoomListDisplay(listTemp);
                  //TODO need to update Display list
                }}
              />
            ) : (
              <SearchItemsUI
                segment={selectedSegment}
                data={users}
                onClose={(index, key) => {

                  console.error("ON Close ", key);
                  let dupUsers = [...users];
                  dupUsers.splice(index, 1);
                  setUsers([...dupUsers]);

                  let listTemp = usersListDisplay?.filter(
                    (data) => data.key != key
                  );
                  setUsersListDisplay(listTemp);
                  //TODO need to update Display list
                }}
              />
            )}
          </View>
        </View>
        {selectedSegment == RoomSegments.Room ? (
          <RoomListUI roomList={roomListDisplay} />
        ) : (
          <UserListUI usersList={usersListDisplay} />
        )}

        {isSuggestionVisible && (
          <SuggestionList
            data={selectedSegment == RoomSegments.Room ? roomList : usersList}
          />
        )}

      </View>
    </LinearGradient>

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
        {/* <View style={styles.SearchImage}>
          <Search />
        </View> */}
        <TextInput
          style={styles.searchContainerStyle}
          onChangeText={(text) => {
            props.changeSearchText(text);
          }}
          value={props.searchText}
          placeholder={props.placeHolder}
        />
      </View>

      {/* <TouchableOpacity
        onPress={() => {
          //props.addToList();
        }}
      >
        <View style={styles.SearchImage}>
          {props.isInProgress ? <ActivityIndicator /> : <Search />}
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

type SearchUIProps = {
  segment: RoomSegments;
  data: String[];
  onClose: (index: number, key: String) => void;
};

const SearchItemsUI: React.FC<SearchUIProps> = (props) => {
  return (
    <FlatList
      data={props.data}
      horizontal={false}
      numColumns={2}
      style={{ alignSelf: 'flex-start' }}
      renderItem={({ item, index }) => (
        <View style={{ alignItems: "center", margin: 2 }}>

          <CustomChip style={{ width: width / 2.3 }} textLableStyle={{ color: 'black', }} textLable={item} onClose={function (): void {

            props.onClose(index, item);

          }
          } isEnableClose={true} backgroundColor={"white"} />
        </View>
      )}
    />
  );
};

type UsersListUIProps = {
  usersList?: Data[];
};
/**
 *
 * @returns User list group by Rooms
 */
const UserListUI: React.FC<UsersListUIProps> = (props) => {
  return (
    <FlatList
      data={props.usersList}
      renderItem={({ item, index }) => <RowUserItem data={item} />}
    />
  );
};

type RoomListUIProps = {
  roomList?: Data[];
};

const RoomListUI: React.FC<RoomListUIProps> = (props) => {
  return (
    <FlatList
      data={props.roomList}
      // renderItem={({ item, index }) => (
      //     rowItem(item)
      // )
      renderItem={({ item, index }) => <RowRoomItem data={item} />}
    />
  );
};

type RowItemProps = {
  data: Data;
};

const RowRoomItem: React.FC<RowItemProps> = (props) => {
  return (
    <View style={[styles.container]}>
      <Text style={[CommonStyles.subHeaderTextStyle, { margin: 10, fontSize: 20 }]}>
        {props.data.key}
      </Text>

      <FlatList
        data={props.data.value}
        numColumns={3}
        renderItem={(item) => (
          <View>
            {item.item.userName ? <CustomChip style={{ width: wp('29%'), alignSelf: 'flex-start' }} textLable={item.item.userName} onClose={function (): void {
            }} isEnableClose={false} backgroundColor={Colors.CHIP_COLOR} /> : <Text style={[CommonStyles.textStyleLight, { marginLeft: 10, marginBottom: 5, fontSize: 14 }]}>No matching records found</Text>}
          </View>
        )}
        keyExtractor={(item) => item.userName}
      />
    </View>
  );
};
const RowUserItem: React.FC<RowItemProps> = (props) => {
  return (
    <View style={[styles.container]}>
      <Text style={[CommonStyles.subHeaderTextStyle, { margin: 10, fontSize: 20 }]}>
        {props.data.key}
      </Text>

      <FlatList
        data={props.data.value}
        numColumns={3}
        renderItem={(item) => (
          <View>
            {item.item.room ? <CustomChip style={{ width: wp('29%'), alignSelf: 'flex-start' }} textLable={item.item.room} onClose={function (): void {
            }} isEnableClose={false} backgroundColor={Colors.CHIP_COLOR} /> : <Text style={[CommonStyles.textStyleLight, { marginLeft: 10, marginBottom: 5, fontSize: 14 }]}>No matching records found.</Text>}
          </View>
        )}
        keyExtractor={(item) => item.userName}
      />
    </View>
  );
};

const ChipItem = () => {
  return <View></View>;
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  searchSuggestion: {
    backgroundColor: "#fff",
    borderColor: Colors.GRAY,
    marginLeft: wp("3%"),
    minHeight: hp("10%"),
    maxHeight: hp("25%"),
    margin: 2,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    // padding: 2,
    position: "absolute",
    top: hp("22.8%"),
    width: wp("90%"),
  },
  item: {
    // backgroundColor: '#f9c2ff',
    //  padding: 1,
    marginVertical: hp("0.5%"),
    marginHorizontal: wp("0.5%"),
    borderBottomColor: Colors.GRAY,
  },
  title: {
    fontSize: fonts.fontXSmall,
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
   // justifyContent: "center",

  },
  ChipStype: {
    width: width / 2.3,
  },
  DynamicChip: {
    flex: 1,
    maxWidth: "100%", // 100% devided by the number of rows you want
    alignItems: "center",
    // my visual styles; not important for the grid
    padding: 0,
    backgroundColor: "rgba(208, 225, 236, 1.0)",
    borderWidth: 2,
    borderColor: "#136DA54D",
    margin: 5,
  },
  container: {
    //borderRadius: 10,
    //backgroundColor: "#fff",
    width: wp("95%"),
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    marginTop: hp("0.5%"),
    paddingBottom: hp("2%"),
  },
  wrapperOnpress: {
    borderRadius: 3,
    padding: 5,
  },
});

export default RoomUserMonitor;

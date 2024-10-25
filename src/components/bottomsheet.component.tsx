import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetModalProps,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

import React, {
  forwardRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
  Alert,
} from "react";
import { Text, View, Image, Pressable } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts, { fontFamily } from "../fonts/fonts";
import BottomButtonComponent from "./button.component";
import { useTranslation } from "react-i18next";
import CheckBoxEmpty from "../../assets/svgs/checkbox_empty.svg";
import CheckBoxSelected from "../../assets/svgs/checkbox_selected.svg";
import BottomSheetStyle from "../styles/bottonsheet.style";
import _ from "lodash";
import Colors from "../styles/color";
import CloseIcon from "../../assets/svgs/X.svg";
import { ScrollView } from "react-native-gesture-handler";
import LeftScrollArrow from "../../assets/svgs/left_scroll.svg";
import RightScrollArrow from "../../assets/svgs/right_scroll.svg";
import NetworkManager from "../network/network.manager";
type ACT = "ACT";
type LOC = "LOC";
type TEST = "TEST";
type SAMPLE = "SAMPLE";
type FMT = "FMT";
type EntityType = "EntityType";
type Entity = "Entity";
type User = "User";
type Status = "Status";
//type CalendarKey = 'sameDay' | 'nextDay' | 'lastDay' | 'nextWeek' | 'lastWeek' | 'sameElse' | string;

export type FilterType = ACT | LOC | TEST | SAMPLE | FMT | Entity | EntityType | User | Status;

export type ActFilterType = {
  actName: string;
  actId: number;
  actCategoryId: string;
  name: string;
  isSelected?: boolean;
  type?: ACT;
};

export type LocationFilterType = {
  facilityId: number;
  locationDesc: string;
  facilityLocationId: number;
  isSelected?: boolean;
  type?: LOC;
};

export type TestFilterType = {
  testNo: number;
  testId: number;
  isSelected?: boolean;
  type?: TEST;
};
export type SampleFilterType = {
  sampleTypeId: number;
  name: string;
  isSelected?: boolean;
  type?: SAMPLE;
};
export type FMTFilterType = {
  fmtName: string;
  fmtId: number;
  fmtTypeId: number;
  fmtTypeName: string;
  isSelected?: boolean;
  type?: FMT;
};

export type EntityTypeFilter = {
  entityTypeName: string;
  entityTypeId: number;
  isSelected?: boolean;
  type?: EntityType;
};

export type EntityFilter = {
  entityTypeName: string;
  isSelected?: boolean;
  type?: Entity;
};

export type UserFilter = {
  userName: string;
  userInfoId: number;
  isSelected?: boolean;
  type?: User;
};

export type StatusFilter = {
  status: string;
  statusId: number;
  isSelected?: boolean;
  type?: Status;
};


export type DataItemType =
  | ActFilterType
  | LocationFilterType
  | TestFilterType
  | SampleFilterType
  | FMTFilterType
  | EntityTypeFilter
  | EntityFilter
  | UserFilter
  | StatusFilter;

type Props = {
  title: string;
  data: DataItemType[];
  isVisible: boolean;
  onClose: () => void;
  applyFilter: (val: DataItemType[]) => void;
  //kind: FilterType;
  searchHint: string;
};
type Ref = BottomSheetModal;

const BottomSheetComponent = forwardRef<BottomSheetModal, Props>(
  (props, ref) => {
    const { t } = useTranslation();
    const snapPoints = useMemo(() => ["50%"], []);
    const { title, isVisible, onClose, applyFilter } = props;
    const [selectedData, setSelectedData] = useState<DataItemType[]>([]);

    const [searchString, setSearchString] = useState("");
    const [data, setData] = useState<DataItemType[]>([]);
    const [filteredData, setFilteredData] = useState<DataItemType[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    //console.log("BottomSheetComponent : ", props.data);
    // const selectedItemsData: DataItemType[] = [];
    // const pushData = () => {
    // }
    // const popData = () => {
    // }
    useEffect(() => {
      // console.log("TITLE--->", title, props.data);
      setData(props.data);
      let count = props.data.filter((item) => item.isSelected === true).length;
      //console.log("Data count", count);
      setTotalCount(count);
    }, [props.data]);

    useEffect(() => {
      getSelectionCount();
    }, []);
    useEffect(() => {
      const timer = setTimeout(() => {
        if (searchString.length !== 0) {
          const _filteredData = data.filter((item) => {
            if (item.type === "ACT") {
              return item.actName
                .toLowerCase()
                .includes(searchString.toLowerCase());
            } else if (item.type === "LOC") {
              //implement new service here on string change do a service call here and update the list data
              return item.locationDesc
                .toLowerCase()
                .includes(searchString.toLowerCase());
            } else if (item.type === "TEST") {
              return `${item.testNo}`
                .toLowerCase()
                .includes(searchString.toLowerCase());
            } else if (item.type === "SAMPLE") {
              return `${item.name}`
                .toLowerCase()
                .includes(searchString.toLowerCase());
            } else if (item.type === "FMT") {
              return `${item.fmtName}`
                .toLowerCase()
                .includes(searchString.toLowerCase());
            } else if (item.type === "EntityType") {
              return `${item.entityTypeName}`
                .toLowerCase()
                .includes(searchString.toLowerCase());
            } else if (item.type === "Entity") {
              return `${item.entityTypeName}`
                .toLowerCase()
                .includes(searchString.toLowerCase());
            } else if (item.type === "User") {
              return `${item.userName}`
                .toLowerCase()
                .includes(searchString.toLowerCase());
            }
            else if (item.type === "Status") {
              return `${item.status}`
                .toLowerCase()
                .includes(searchString.toLowerCase());
            }
          });
          setFilteredData(_filteredData);
        } else if (searchString.length === 0) {
          setFilteredData([]);
        }
      }, 500);

      return () => clearTimeout(timer);
    }, [searchString]);

    const renderItemText = (item: DataItemType) => {
      //console.log("RENDER ITEM", item, item.type);
      return (
        <Text style={BottomSheetStyle.itemTextStyle}>
          {item.type === "ACT"
            ? item.actName
            : item.type === "LOC"
              ? item.locationDesc
              : item.type === "TEST"
                ? `${item.testNo}`
                : item.type === "SAMPLE"
                  ? item.name
                  : item.type === "FMT"
                    ? item.fmtName
                    : item.type === "EntityType"
                      ? item.entityTypeName
                      : item.type === "Entity"
                        ? item.entityTypeName
                        : item.type === "User"
                          ? item.userName
                          : item.type === "Status"
                            ? item.status
                            : ""}
        </Text>
      );
    };

    const renderItemValue = (item: DataItemType) => {
      return item.type === "ACT"
        ? item.actName
        : item.type === "LOC"
          ? item.locationDesc
          : item.type === "TEST"
            ? `${item.testNo}`
            : item.type === "SAMPLE"
              ? item.name
              : item.type === "FMT"
                ? item.fmtName
                : item.type === "EntityType"
                  ? item.entityTypeName
                  : item.type === "Entity"
                    ? item.entityTypeName
                    : item.type === "User"
                      ? item.userName
                      : item.type === "Status"
                        ? item.status
                        : "";
    };

    const onListItemSelected = (item: DataItemType, index: number) => {
      const _data = [...data];
      let i = index;
      if (filteredData.length > 0) {
        i = _data.findIndex((obj) => {
          if (obj.type === "ACT" && item.type === "ACT") {
            return obj.actName === item.actName;
          } else if (item.type === "LOC" && obj.type === "LOC") {
            return obj.locationDesc === item.locationDesc;
          } else if (item.type === "TEST" && obj.type === "TEST") {
            return obj.testNo === item.testNo;
          } else if (item.type === "SAMPLE" && obj.type === "SAMPLE") {
            return obj.name === item.name;
          } else if (item.type === "FMT" && obj.type === "FMT") {
            return obj.fmtName === item.fmtName;
          } else if (item.type === "EntityType" && obj.type === "EntityType") {
            return obj.entityTypeName === item.entityTypeName;
          } else if (item.type === "Entity" && obj.type === "Entity") {
            return obj.entityTypeName === item.entityTypeName;
          } else if (item.type === "User" && obj.type === "User") {
            return obj.userName === item.userName;
          }
          else if (item.type === "Status" && obj.type === "Status") {
            return obj.status === item.status;
          }


          return false;
        });
      }
      _data[i].isSelected = !_data[i].isSelected;
      setData(_data);
      getSelectionCount();
    };

    /**
     * to Get all selected count
     */
    function getSelectionCount() {
      let count = data.filter((item) => item.isSelected === true).length;
     // console.log("Get count.....", count);
      setTotalCount(count);
    }
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          onPress={() => {
            onClose();
          }}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
        />
      ),
      []
    );

    async function getTestFilters(searchvalue: string) {
      //setLoading(true);
      try {
        let testRes = await NetworkManager.getLookUpTestNames(searchvalue);
        if (testRes?.status?.success) {
          //console.log('TEST FILTER RESPONSE-->', testRes?.response)
          const newData: TestFilterType[] = testRes?.response.map(
            (obj: TestFilterType) => {
              return { ...obj, isSelected: false, type: "TEST" };
            }
          );

          let oldData = [...data];
          oldData = [...data, ...newData]
         // console.log('newData-->', newData)

          const uniqueArray = oldData.filter(
            (obj, index, self) =>
              index === self.findIndex((t) => t.testId === obj.testId)
          );
          //console.log('uniqueArray-->', uniqueArray)
          // oldData.forEach((oldEleent) => {
          //   newData.every((itesm) => {

          //     if (itesm.testId === oldEleent.testId) {
          //       itesm.isSelected = oldEleent.isSelected;
          //     }
          //     else {
          //       if (oldEleent.isSelected && (itesm.testId != oldEleent.testId))
          //         console.log("OLD ELEM==>", oldEleent);
          //       console.log("TEST ITEM", itesm);
          //       newData.push(oldEleent)
          //     }
          //   });
          // });
          setData(uniqueArray);
        } else {
          Alert.alert("API faild", testRes?.errors?.message);
        }
      } catch (e) {
        console.error("Error", e);
      } finally {
        //setLoading(false);
      }
    }

    function customChip(item: DataItemType) {
      if (item.isSelected === true) {
        return (
          <View style={{ flex: 1 }}>
            <View
              style={{
                paddingVertical: 0,
                paddingHorizontal: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: Colors.LIGHT_GRAY,
                margin: 5,
                minHeight: 30,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  marginRight: 5,
                  color: "black",
                }}
              >
                {renderItemValue(item)}
              </Text>
              <Pressable
                hitSlop={{ top: 25, bottom: 25, left: 15, right: 25 }}
                onPress={() => {
                  const _data = [...data];
                  let i = 0;
                  i = _data.findIndex(
                    (obj) => renderItemValue(obj) === renderItemValue(item)
                  );
                  _data[i].isSelected = !_data[i].isSelected;
                  setData(_data);
                  getSelectionCount();
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                  },
                ]}
              >
                {({ pressed }) =>
                  pressed ? (
                    <CloseIcon
                      style={{ margin: 3, backgroundColor: Colors.PRESS }}
                    />
                  ) : (
                    <CloseIcon />
                  )
                }
              </Pressable>
            </View>
          </View>
        );
      }
    }

    return (
      <BottomSheetModal
        snapPoints={snapPoints}
        ref={ref}
        onChange={() => {
          setSearchString("");
        }}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        backgroundStyle={{ backgroundColor: "#ffffff" }}
        handleIndicatorStyle={{ backgroundColor: "transparent" }}
      >
        <View style={{ marginLeft: wp("5%"), marginRight: wp("5%"), flex: 1 }}>
          <Text style={BottomSheetStyle.headerTextStyle}>{title}</Text>
          <BottomSheetTextInput
            style={BottomSheetStyle.textInputStyle}
            placeholder={props.searchHint}
            value={searchString}
            blurOnSubmit={false}
            maxLength={20}
            onChangeText={(val) => {
              setSearchString(val);
              if (title === "Filter by Test") {
                setFilteredData([]);
                if (val.length > 3) {
                  //call service from here
                  //implement new service here on string change do a service call here and update the list data
                  console.log('search string filter goes here');
                  getTestFilters(val);
                }
                else if (val.length === 0) {
                  getTestFilters("");
                }
              }
            }}
          />

          <View style={{ alignItems: "flex-start" }}>
            {totalCount > 0 ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <LeftScrollArrow />
                <ScrollView
                  stickyHeaderHiddenOnScroll={true}
                  horizontal={true}
                  style={{ marginBottom: 5 }}
                >
                  {data.map((obj) => customChip(obj))}
                </ScrollView>
                <RightScrollArrow />
              </View>
            ) : null}
          </View>

          <BottomSheetFlatList
            data={filteredData.length > 0 ? filteredData : data}
            keyboardShouldPersistTaps={"always"}
            style={{ marginBottom: hp("10%") }}
            renderItem={({
              item,
              index,
            }: {
              item: DataItemType;
              index: number;
            }) => {
              return (
                <Pressable
                  onPress={() => {
                    onListItemSelected(item, index);
                  }}
                  style={BottomSheetStyle.rowItemStyle}
                >
                  {item.isSelected ? (
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
                  {renderItemText(item)}
                </Pressable>
              );
            }}
          />
          <View style={BottomSheetStyle.bottomButtonContainer}>
            <View style={BottomSheetStyle.bottomButtonSubContainer}>
              <BottomButtonComponent
                title={t("applyFilter")}
                buttonClick={() => {
                  setSearchString("");
                  applyFilter(data);
                }}
                buttonType="submit"
              />
            </View>
          </View>
        </View>
      </BottomSheetModal>
    );
  }
);

export default BottomSheetComponent;
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts, { fontFamily } from "../../fonts/fonts";
import LinearGradient from "react-native-linear-gradient";
import DownArrow from "../../../assets/svgs/down_arrow.svg";
import RightArrow from "../../../assets/svgs/rightArrow.svg";
import FilterImage from "../../../assets/svgs/filter.svg";
import HeaderComponent from "../../components/headerDashboardComponent";
import CommonStyles from "../../styles/commonstyles";
import NetworkManager from "../../network/network.manager";
import ExpandIcon from "../../../assets/svgs/expandIcon.svg";
import CollapseIcon from "../../../assets/svgs/collapseIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import moment from "moment";
import Utils, { MonitorTypes } from "../../utils";
import XIcon from "../../../assets/svgs/X.svg";
import RefreshIcon from "../../../assets/svgs/sort_Icon.svg";
import { Calendar } from "react-native-calendars";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import _ from "lodash";
import LoadingModal from "../../components/loadingModel";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheetComponent, {
  ActFilterType,
  LocationFilterType,
  DataItemType,
  TestFilterType,
  FilterType,
  SampleFilterType,
  FMTFilterType,
  StatusFilter,
} from "../../components/bottomsheet.component";
import { saveUserData } from "../../redux/slices/user.slicer";
import { saveUserInfo } from "../../redux/slices/userInfo.slicer";
import { RoomType } from "../../components/dropdown.component";
import { getDBConnection, getNotificationItems } from "../notifications/notification-db";
import { updateStack } from "../../redux/slices/login.slicer";
import Colors from "../../styles/color";
import DashboardStyles from "../../styles/dashboard.style";
import DateBottomSheet from "../../components/date.component";
import { showToast } from "../../components/custom.toast.message";
import { useFocusEffect } from "@react-navigation/native";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";


type DashboardListViewScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "DashboardListView"
>;
import { fetch } from "@react-native-community/netinfo";
const DashboardListView = ({
  route,
  navigation,
}: DashboardListViewScreenProps) => {
  const dispatch = useDispatch();
  const [expandedItem, setExpandedItem] = useState(null);
  const [testValue, set_testValue] = useState("Test");
  const [dateRangeValue, set_dateRangeValue] = useState("Date Range");
  const [actValue, set_actValue] = useState("ACT");
  const [locationValue, set_locationValue] = useState("Location");
  const [statusValue, set_statusValue] = useState("Status");
  const [pendingACTS, set_pendingACTS] = useState([]);
  const [fmts, set_fmts] = useState([]);
  const [pendingCollections, set_pendingCollections] = useState([]);
  const [showFilters, set_showFilters] = useState(false);
  const [showTestFilter, set_showTestFilter] = useState(true);
  const [showBottomFilters, set_showBottomFilters] = useState(false);
  const [expandIconClicked, set_expandIconClicked] = useState(false);
  const [pendingEnabled, set_PendingEnabled] = useState(true);
  const [actStatusId, set_actStatusId] = useState(1);
  const [dynamicStyle, set_dynamicStyle] = useState(
    DashboardStyles.collapsedContainerHeight
  );
  const [loading, setLoading] = useState(false);
  const [data, set_data] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [showCalender, set_showCalender] = useState(false);
  var currentDate = moment(new Date()).format("MM/DD/YYYY");
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetData, setBottomSheetData] = useState<DataItemType[]>([]);
  const [actTotalCount, setActTotalCount] = useState<number>(20);
  const [fmtTotalCount, setfmtTotalCount] = useState<number>(20);
  const [pendingCollCount, setPendingCollCount] = useState<number>(20);
  const [filterBorderACT, set_FilterBorderACT] = useState(
    CommonStyles.textInputStyleSmall
  );
  const [filterBorderTest, set_FilterBorderTest] = useState(
    CommonStyles.textInputStyleSmall
  );
  const [filterBorderDate, set_FilterBorderDate] = useState(
    CommonStyles.textInputStyleSmall
  );
  const [filterBorderLocation, set_FilterBorderLocation] = useState(
    CommonStyles.textInputStyleSmall
  );
  const [filterBorderStatus, set_FilterBorderStatus] = useState(
    CommonStyles.textInputStyleSmall
  );
  const [showNoRecords, set_showNoRecords] = useState<boolean>(false);
  const flatListRef = useRef(null);

  const actSort = useRef("DESC");
  const sortVal = useRef("");
  const [dateSortACT, set_dateSortACT] = useState("DESC");
  //const [sortVal, set_sortVal] = useState("");

  const [fmtSort, set_fmtSort] = useState("DESC");
  const [dateSortFMT, set_dateSortFMT] = useState("DESC");
  const [pendingCollSort, set_pendingCollSort] = useState("DESC");
  const [filterTitle, set_FilterTitle] = useState<string>("");
  const [notificationCount, set_notificationCount] = useState<number>(0);
  const [filterSearchTitle, set_FilterSearchTitle] = useState<string>("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>();
  const [actLookUpData, set_actLookUpData] = useState<ActFilterType[]>([]);
  const [actLookUpDataCompleted, set_actLookUpDataCompleted] = useState<ActFilterType[]>([]);
  const [testLookUpData, set_testLookUpData] = useState<TestFilterType[]>([]);
  const [locationLookUpData, set_locationLookUpData] = useState<
    LocationFilterType[]
  >([]);
  const [alllocationsLookUpData, set_alllocationsLookUpData] = useState<
    LocationFilterType[]
  >([]);
  const [sampleLookUpData, set_sampleLookUpData] = useState<SampleFilterType[]>(
    []
  );
  const [fmtLookUpData, set_fmtLookUpData] = useState<FMTFilterType[]>([]);
  const [notificationReadCount, set_notificationReadCount] = useState(0);
  const [filterMonitorCount, set_filterMonitorCount] = useState(0)
  const [changeInData, setChangeInData] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const statusFilterData = [{
    "status": "Completed",
    "statusId": 2,
    "isSelected": false,
    "type": "Status"
  },
  {
    "status": "Mark as failed",
    "statusId": 4,
    "isSelected": false,
    "type": "Status"
  },
  {
    "status": "Not Performed",
    "statusId": 5,
    "isSelected": false,
    "type": "Status"
  }];
  const [bottomSheetStatusData, set_bottomSheetStatusData] = useState(statusFilterData);
  const { selectedMonitorID } = route.params;
  const fromDate = useRef("");
  const toDate = useRef("");
  const locationFilterValue = useRef("");
  const actFilterValue = useRef("");
  const testFilterValue = useRef("");
  const exandedItemIDRef = useRef<MonitorTypes>();
  const sampleFilterValue = useRef("");
  const fmtFilterValue = useRef("");
  const statusFilterValue = useRef("");
  const statusID = useRef(1);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const bottomSheetCalenderRef = useRef<BottomSheetModal>(null);
  const userData = useSelector((state: RootState) => state.userInfo);
  const handlePresentPress = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.present();
  };
  const handleHidePress = () => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.dismiss();
  };
  function concatenateUniqueArrays(arr1: any, arr2: any) {
    // Use a Set to store unique elements from both arrays
    const uniqueElements = new Set([...arr1, ...arr2]);

    // Convert the Set back to an array
    return Array.from(uniqueElements);
  }

  useEffect(() => {
    firebaseHelper.reportScreen(firebaseHelper.Screen_Dashboard_List);
    // getMonitorCounts();
    getNotificationReadCount();
    doGetUserInfo();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getMonitorCounts();
      setRefreshing(false);
    }, 1000);
  };

  useFocusEffect(
    React.useCallback(() => {
      toggleExpansion(-1);
      set_expandIconClicked(false);
      set_dynamicStyle(DashboardStyles.collapsedContainerHeight);
      getMonitorCounts();

    }, [navigation])
  );

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [pendingACTS, pendingCollections, fmts]);

  async function doGetUserInfo() {
    let userID = await Utils.getData("UserId");
    let userInfo = await NetworkManager.doGetUserInfo(userID ?? "0");
    dispatch(saveUserInfo(userInfo));
  }
  async function getDataBasedOnExpandedItem() {
    if (
      exandedItemIDRef.current === MonitorTypes.PENDING_ANIMAL_TASKS
    ) {
      firebaseHelper.logEvent(firebaseHelper.Event_ACT_Apply_Filter, firebaseHelper.Screen_Dashboard_List, "");
      getPendingACTList();
    } else if (exandedItemIDRef.current === MonitorTypes.PENDING_FMTS) {
      firebaseHelper.logEvent(firebaseHelper.Event_FMT_Apply_Filter, firebaseHelper.Screen_Dashboard_List, "");
      getFMTTasks();
    } else if (
      exandedItemIDRef.current === MonitorTypes.PENDINGCOLLECTIONS
    ) {
      firebaseHelper.logEvent(firebaseHelper.Event_Collections_Apply_Filter, firebaseHelper.Screen_Dashboard_List, "");
      getPendingCollections();
    }

  }

  async function getMonitorCounts() {
    setLoading(true);
    let userID = await Utils.getData("UserId");
    try {
      let countRes = await NetworkManager.getDashboardMonitorCounts(
        userID,
        statusID.current
      );
      if (countRes.status.success) {
        let res = countRes.response.monitors.sort((a, b) =>
          a.monitorName < b.monitorName ? -1 : 1
        );
        set_data(res);
        set_notificationCount(countRes?.response?.notificationCount);
        getLocationFilters(false);
        if (statusID.current === 1) {
          toggleExpansion(selectedMonitorID);
        }
      }
      else if (countRes?.status?.httpStatus === 400) {
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
        await Utils.clearUserData();
        Alert.alert(
          "Fail",
          countRes?.errors[0]?.message ?? "",
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


      else {
        Alert.alert("API faild", countRes.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      //setLoading(false);
    }
  }
  async function getPendingACTList() {
    setLoading(true);
    set_showNoRecords(false);
    let userID = await Utils.getData("UserId");
    // console.log("sort val-->", sortVal.current);
    try {
      let pendingACTRes = await NetworkManager.getPendingACTList(
        0,
        actTotalCount,
        statusID.current,
        fromDate.current,
        toDate.current,
        userID,
        actFilterValue.current ?? "",
        locationFilterValue.current ?? "",
        testFilterValue.current ?? "",
        sortVal.current,
        actSort.current,
        statusFilterValue.current
      );
      if (pendingACTRes?.status?.success && pendingACTRes?.response) {
        if (
          pendingACTRes?.response?.actList &&
          pendingACTRes?.response?.actList.length > 0
        ) {
          set_pendingACTS(pendingACTRes.response.actList);
          if (pendingACTRes.response.totalRecords > actTotalCount) {
            setActTotalCount(pendingACTRes.response.totalRecords);
          }
          console.log(
            "count hererereerere",
            pendingACTRes.response.actList,
            pendingACTRes.response.totalRecords
          );
          set_filterMonitorCount(pendingACTRes.response.totalRecords);
        } else {
          set_pendingACTS([]);
          set_showNoRecords(true);
          // Alert.alert("Alert!", "No data available for the search criteria.");
        }
      } else {
        Alert.alert("Alert!", pendingACTRes.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  }

  async function getFMTTasks() {
    setLoading(true);
    set_showNoRecords(false);
    let userID = await Utils.getData("UserId");
    try {
      let fmtRes = await NetworkManager.getFMTList(
        0,
        fmtTotalCount,
        userID,
        statusID.current,
        sortVal.current,
        fmtSort,
        fromDate.current,
        toDate.current,
        fmtFilterValue.current,
        locationFilterValue.current
      );
      if (fmtRes.status.success && fmtRes.response.fmtList) {
        if (fmtRes.response.fmtList && fmtRes.response.fmtList.length > 0) {
          set_fmts(fmtRes?.response?.fmtList);
          if (fmtRes.response.totalRecords > fmtTotalCount) {
            setfmtTotalCount(fmtRes?.response?.totalRecords);
          }
          set_filterMonitorCount(fmtRes?.response?.totalRecords);
          // console.log(
          //   "fmt count hererereerere",
          //   fmtTotalCount,
          //   fmtRes.response.totalRecords
          // );
        } else {
          set_fmts([]);
          set_showNoRecords(true);
          // Alert.alert("Alert!", "No data available for the search criteria.");
        }
      } else {
        Alert.alert("Alert!", fmtRes.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  }

  async function getPendingCollections() {
    setLoading(true);
    set_showNoRecords(false);
    let userID = await Utils.getData("UserId");
    try {
      let pendingCollectionsRes = await NetworkManager.getPendingCollections(
        0,
        pendingCollCount,
        userID,
        statusID.current,
        sortVal.current,
        pendingCollSort,
        sampleFilterValue.current ?? "",
        testFilterValue.current ?? ""
      );
      if (
        pendingCollectionsRes.status.success &&
        pendingCollectionsRes.response
      ) {
        if (
          pendingCollectionsRes.response.pendingCollectionList &&
          pendingCollectionsRes.response.pendingCollectionList.length > 0
        ) {
          set_pendingCollections(
            pendingCollectionsRes.response.pendingCollectionList
          );
          if (pendingCollectionsRes.response.totalRecords > pendingCollCount) {
            setPendingCollCount(pendingCollectionsRes.response.totalRecords);
          }
          // var totalAnimalCount = 0;
          // pendingCollectionsRes.response.pendingCollectionList.forEach((obj) => {

          //   totalAnimalCount += obj.animalsCount;
          //   console.log("ANIMAL COUNTS-->", totalAnimalCount);
          // })
          set_filterMonitorCount(pendingCollectionsRes.response.totalCount);
        } else {
          set_pendingCollections([]);
          set_showNoRecords(true);
          // Alert.alert("Alert!", "No data available for the search criteria.");
        }
      } else {
        Alert.alert("Alert!", pendingCollectionsRes.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  }

  async function getLookUpSampleTypes() {
    if (sampleLookUpData?.length > 0) {
      const newData = [...sampleLookUpData];
      setBottomSheetData(newData);
      bottomSheetRef.current?.present();
      return;
    }
    setLoading(true);
    try {
      let userID = await Utils.getData("UserId");
      let lookupSample = await NetworkManager.getLookUpSampleTypes(userID);
      if (lookupSample.status.success) {
        //TO-DO Bottomsheet sample
        const newData: SampleFilterType[] = lookupSample.response.map(
          (obj: SampleFilterType) => {
            return { ...obj, isSelected: false, type: "SAMPLE" };
          }
        );
        setBottomSheetVisible(true);
        setBottomSheetData(newData);
        set_sampleLookUpData(newData);
        bottomSheetRef.current?.present();
      } else {
        Alert.alert("API faild", lookupSample.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  }

  async function getLookUpFMTNames() {
    if (fmtLookUpData?.length > 0) {
      const newData = [...fmtLookUpData];
      setBottomSheetData(newData);
      bottomSheetRef.current?.present();
      return;
    }
    setLoading(true);
    try {
      let userID = await Utils.getData("UserId");
      let lookupFMTs = await NetworkManager.getLookUpFMTNames(userID);
      if (lookupFMTs.status.success) {
        //TO-DO Bottomsheet FMTs
        const newData: FMTFilterType[] = lookupFMTs.response.map(
          (obj: FMTFilterType) => {
            return { ...obj, isSelected: false, type: "FMT" };
          }
        );
        setBottomSheetVisible(true);
        setBottomSheetData(newData);
        set_fmtLookUpData(newData);
        bottomSheetRef.current?.present();
      } else {
        Alert.alert("API faild", lookupFMTs.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  }

  async function getACTLookUpFilters() {
    setCurrentFilter("ACT");
    set_FilterTitle("Filter by ACT");
    set_FilterSearchTitle("Search ACT");
    let actFilterValue = "";
    //STOPPING This since we have to get different data for pending and completed
    // Done by Vinay on 21st October due to API change
    if (statusID.current === 1) {
      actFilterValue = "ACT_MONITOR_FILTER_P";
      if (actLookUpData?.length > 0) {
        const newData = [...actLookUpData];
        setBottomSheetData(newData);
        bottomSheetRef.current?.present();
        return;
      }
    }
    else {
      actFilterValue = "ACT_MONITOR_FILTER_C";
      if (actLookUpDataCompleted?.length > 0) {
        const newData = [...actLookUpDataCompleted];
        setBottomSheetData(newData);
        bottomSheetRef.current?.present();
        return;
      }
    }
    setLoading(true);
    try {
      let lookupAct = await NetworkManager.getLookUpACTNames(actFilterValue);
      if (lookupAct.status.success) {
        //TO-DO Bottomsheet ACTs
        const newData: ActFilterType[] = lookupAct.response.map(
          (obj: ActFilterType) => {
            return { ...obj, isSelected: false, type: "ACT" };
          }
        );
        setBottomSheetVisible(true);
        setBottomSheetData(newData);
        if (statusID.current === 1) {
          set_actLookUpData(newData);
        }
        else {
          set_actLookUpDataCompleted(newData);
        }
        bottomSheetRef.current?.present();
      } else {
        Alert.alert("API faild", lookupAct.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  }
  async function getTestFilters() {
    setCurrentFilter("TEST");
    set_FilterTitle("Filter by Test");
    set_FilterSearchTitle("Search Test");
    if (testLookUpData?.length > 0) {
      const newData = [...testLookUpData];
      setBottomSheetData(newData);
      bottomSheetRef.current?.present();
      return;
    }
    setLoading(true);
    try {
      let userID = await Utils.getData("UserId");
      let testRes = await NetworkManager.getLookUpTestNames("");
      if (testRes.status.success) {
        //TO-DO Bottomsheet Test
        const newData: TestFilterType[] = testRes.response.map(
          (obj: TestFilterType) => {
            return { ...obj, isSelected: false, type: "TEST" };
          }
        );
        setBottomSheetVisible(true);
        setBottomSheetData(newData);
        set_testLookUpData(newData);
        bottomSheetRef.current?.present();
      } else {
        Alert.alert("API faild", testRes.errors.message);
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  }

  function addPrefredLocation() {

    if (exandedItemIDRef.current === MonitorTypes.PENDING_ANIMAL_TASKS) {
      const newData: LocationFilterType[] = [...locationLookUpData].map(
        (obj: LocationFilterType) => {
          let counter =
            userData?.userInfo?.response?.preferences?.locationPreferences.filter(
              (item: RoomType) => item.room === obj.locationDesc
            ).length;
          return {
            ...obj,
            isSelected: counter > 0 ? true : obj.isSelected,
            type: "LOC",
          };
        }
      );
      //setBottomSheetData(newData);
      set_locationLookUpData(newData);
    }
    else if (exandedItemIDRef.current === MonitorTypes.PENDING_FMTS) {
      const newData: LocationFilterType[] = [...alllocationsLookUpData].map(
        (obj: LocationFilterType) => {
          let counter =
            userData?.userInfo?.response?.preferences?.locationPreferences.filter(
              (item: RoomType) => item.room === obj.locationDesc
            ).length;
          return {
            ...obj,
            isSelected: counter > 0 ? true : obj.isSelected,
            type: "LOC",
          };
        }
      );
      //setBottomSheetData(newData);
      set_alllocationsLookUpData(newData);
    }

  }
  async function getLocationFilters(showBottom: boolean) {
    if (locationLookUpData?.length > 0) {
      //TODO need to update initial locaion filter
      let counter = locationLookUpData.filter((d) => d.isSelected === true).length;
      if (counter === 0) {
        set_locationValue("Location");
      } else {
        set_locationValue("Location +" + counter);
      }
      const newUdpateData = _.cloneDeep(locationLookUpData);
      setBottomSheetData(newUdpateData);
      if (showBottom) {
        bottomSheetRef.current?.present();
      }
      return;
    }

    if (alllocationsLookUpData?.length > 0) {
      //TODO need to update initial locaion filter
      let counter = alllocationsLookUpData.filter((d) => d.isSelected === true).length;
      if (counter === 0) {
        set_locationValue("Location");
      } else {
        set_locationValue("Location +" + counter);
      }
      const newUdpateData = _.cloneDeep(alllocationsLookUpData);
      setBottomSheetData(newUdpateData);
      if (showBottom) {
        bottomSheetRef.current?.present();
      }
      return;
    }
    //setLoading(true);
    try {
      //To load all data.
      //To get user prefered specias
      let preferedSpeciesId =
        userData?.userInfo?.response?.preferences?.speciesPreferences?.speciesId;
      // console.log("preferedSpeciesId", preferedSpeciesId);
      let apiParam = "";
      if (exandedItemIDRef.current === MonitorTypes.PENDING_ANIMAL_TASKS) {
        //add ACT param
        apiParam = "anml";
      }
      else if (exandedItemIDRef.current === MonitorTypes.PENDING_FMTS) {
        // add FMT param
        apiParam = "all";
      }
      let lookupLoc = await NetworkManager.getLookUpLocationNames(preferedSpeciesId ?? "", apiParam);
      //console.log("TEST Location", JSON.stringify(lookupLoc));
      if (lookupLoc?.status?.success) {
        //TO-DO Bottomsheet LOCATION
        // console.log("res loc", lookupLoc.response);
        const newData: LocationFilterType[] =
          lookupLoc.response.locationlist.map((obj: LocationFilterType) => {
            let counter =
              userData?.userInfo?.response?.preferences?.locationPreferences.filter(
                (item: RoomType) => item.room === obj.locationDesc
              ).length;
            return {
              ...obj,
              isSelected: counter > 0 ? true : obj.isSelected,
              type: "LOC",
            };
          });
        //TODO need to update initial locaion filter
        let counter = newData.filter((d) => d.isSelected === true).length;
        if (counter === 0) {
          set_locationValue("Location");
        } else {
          set_locationValue("Location +" + counter);
        }
        //console.log("method calling from expansion");
        setBottomSheetVisible(true);
        setBottomSheetData(newData);

        if (apiParam === "ALL") {
          //add ALL data
          set_alllocationsLookUpData(newData);
        }
        else if (apiParam === "ACT") {
          // add ACT data
          set_locationLookUpData(newData);
        }

        if (showBottom) {
          bottomSheetRef.current?.present();
        }
      } else {
        Alert.alert(lookupLoc?.errors?.message ?? "The server was unable to process the request. Please try again after some time.");
      }
    } catch (e) {
      console.error("Error", e);
    } finally {
      if (statusID.current === 2) {
        setLoading(false);
      }

    }
  }

  function flatListData(monitorID: any) {
    if (monitorID === MonitorTypes.PENDING_ANIMAL_TASKS) {
      //pending acts
      return pendingACTS;
    } else if (monitorID === MonitorTypes.PENDING_FMTS) {
      //fmts
      return fmts;
    } else if (monitorID === MonitorTypes.PENDINGCOLLECTIONS) {
      //pending coll
      return pendingCollections;
    }
  }

  function tableTitles(monitorID: any) {
    if (monitorID === MonitorTypes.PENDING_ANIMAL_TASKS) {
      //pending acts
      return (
        <View style={DashboardStyles.rowItemBG}>
          <TouchableOpacity
            onPress={() => {
              //set_sortVal("actName");
              sortVal.current = "actName";
              if (actSort.current === "DESC") {
                actSort.current = "ASC";
              } else {
                actSort.current = "DESC";
              }
              set_pendingACTS([]);
              getPendingACTList();
            }}
            style={DashboardStyles.titleWithIconACT}
          >
            <Text style={DashboardStyles.textSmallNew}>ACT</Text>
            <RefreshIcon />
          </TouchableOpacity>

          <Text style={DashboardStyles.textSmall}>Animal</Text>
          <Text style={DashboardStyles.textSmallTest}>Test</Text>

          <TouchableOpacity
            onPress={() => {
              //set_sortVal("scheduledDate");
              sortVal.current = "scheduledDate";
              if (actSort.current === "DESC") {
                actSort.current = "ASC";
              } else {
                actSort.current = "DESC";
              }
              set_pendingACTS([]);
              getPendingACTList();
            }}
            style={DashboardStyles.titleWithIconDate}
          >
            <Text style={DashboardStyles.textSmallNew}>{statusID.current === 1 ? "S.Date" : "P.Date"}</Text>
            <RefreshIcon />
          </TouchableOpacity>

          <Text style={DashboardStyles.textSmallLocation}>Loc...</Text>
        </View>
      );
    } else if (monitorID === MonitorTypes.PENDING_FMTS) {
      //fmts
      return (
        <View style={DashboardStyles.rowItemBG}>
          <TouchableOpacity
            onPress={() => {
              //set_sortVal("fmtName");
              sortVal.current = "fmtName";
              if (fmtSort === "DESC") {
                set_fmtSort("ASC");
              } else {
                set_fmtSort("DESC");
              }
              getFMTTasks();
            }}
            style={DashboardStyles.titleWithIcon}
          >
            <Text style={DashboardStyles.textSmallNew}>FMT</Text>
            <RefreshIcon />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              //set_sortVal("scheduledDate");
              sortVal.current = "scheduledDate";
              if (fmtSort === "DESC") {
                set_fmtSort("ASC");
              } else {
                set_fmtSort("DESC");
              }
              set_fmts([]);
              getFMTTasks();
            }}
            style={DashboardStyles.titleWithIconDate}
          >
            <Text style={DashboardStyles.textSmallFMTDate}>Scheduled Date</Text>
            <RefreshIcon />
          </TouchableOpacity>
          <Text style={DashboardStyles.textSmallLocationFMT}>Location</Text>
        </View>
      );
    } else if (monitorID === MonitorTypes.PENDINGCOLLECTIONS) {
      return (
        <View style={DashboardStyles.rowItemBG}>
          <TouchableOpacity
            onPress={() => {
              //set_sortVal("testNum");
              sortVal.current = "testNum";
              if (pendingCollSort === "DESC") {
                set_pendingCollSort("ASC");
              } else {
                set_pendingCollSort("DESC");
              }
              set_pendingCollections([]);
              getPendingCollections();
            }}
            style={DashboardStyles.titleWithIconPC}
          >
            <Text style={DashboardStyles.textSmallNew}>Test</Text>
            <RefreshIcon />
          </TouchableOpacity>
          <Text style={DashboardStyles.textSmallCollections}>Sample Type</Text>
          <Text style={DashboardStyles.textSmallCollectionsAnimal}>Animal</Text>
        </View>
      );
    }
  }

  function tableContents(monitorID: any) {
    if (monitorID === MonitorTypes.PENDING_ANIMAL_TASKS) {
      //pending acts
      return renderInnerItemACTS;
    } else if (monitorID === MonitorTypes.PENDING_FMTS) {
      //fmts
      return renderInnerItemFMTS;
    } else if (monitorID === MonitorTypes.PENDINGCOLLECTIONS) {
      return renderInnerItemPendingCollections;
    }
  }

  function getMonitorsData(itemId: MonitorTypes) {
    //call service based on monitor here
    if (itemId === MonitorTypes.PENDING_ANIMAL_TASKS) {
      set_actValue("ACT");
      set_showTestFilter(true);
      getPendingACTList();
    } else if (itemId === MonitorTypes.PENDING_FMTS) {
      set_actValue("FMT");
      set_showTestFilter(false);
      getFMTTasks();
    } else if (itemId === MonitorTypes.PENDINGCOLLECTIONS) {
      set_showTestFilter(true);
      getPendingCollections();

    }
  }

  const onDayPress = (day: any) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
      setMarkedDates({
        [day.dateString]: {
          marked: true,
          color: Colors.APP_BLUE,
          textColor: 'white',
          startingDay: true,
          endingDay: true
        },
      });
    } else {
      // Select end date
      setSelectedEndDate(day.dateString);
      let range = {};
      let startDate = moment(selectedStartDate);
      let endDate = moment(day.dateString);
      let currentDate = startDate;
      while (currentDate <= endDate) {
        range[currentDate.format("MM-DD-YYYY")] = {
          color: "#136DA5",
          textColor: "white",
        };
        currentDate = currentDate.clone().add(1, "day");
      }
      setMarkedDates({
        [day.dateString]: {
          marked: true,
          color: Colors.APP_BLUE,
          textColor: 'white',
          startingDay: true,
          endingDay: true
        },
      });
      //setMarkedDates(range);
      fromDate.current = startDate.format("MM-DD-YYYY");
      toDate.current = endDate.format("MM-DD-YYYY");
    }
  };

  function getChipCount(monitorId: any, monitorCount: any) {
    if (exandedItemIDRef.current === monitorId) {
      if (filterMonitorCount) {
        return filterMonitorCount;
      }
      else {
        return monitorCount;
      }
    }
    else {
      return monitorCount;
    }
  }

  function resetFilterInputData(clearMonitorData: boolean) {
    //console.log("method cal");
    fromDate.current = "";
    toDate.current = "";
    actFilterValue.current = "";
    locationFilterValue.current = "";
    testFilterValue.current = "";
    fmtFilterValue.current = "";
    sampleFilterValue.current = "";
    setActTotalCount(20);
    setfmtTotalCount(20);
    setPendingCollCount(20);
    set_showNoRecords(false);
    set_showCalender(false);
    set_testLookUpData([]);
    set_pendingACTS([]);
    set_fmts([]);
    set_pendingCollections([]);
    if (exandedItemIDRef.current === MonitorTypes.PENDING_ANIMAL_TASKS) {
      firebaseHelper.logEvent(firebaseHelper.Event_ACT_Reset_Filter, firebaseHelper.Screen_Dashboard_List, "");

      set_actValue("ACT");
      set_showTestFilter(true);
      if (clearMonitorData) {
        getPendingACTList();
      }
    } else if (exandedItemIDRef.current === MonitorTypes.PENDING_FMTS) {
      firebaseHelper.logEvent(firebaseHelper.Event_FMT_Reset_Filter, firebaseHelper.Screen_Dashboard_List, "");
      set_actValue("FMT");
      set_showTestFilter(false);
      if (clearMonitorData) {
        getFMTTasks();
      }
    } else if (exandedItemIDRef.current === MonitorTypes.PENDINGCOLLECTIONS) {
      firebaseHelper.logEvent(firebaseHelper.Event_Collections_Reset_Filter, firebaseHelper.Screen_Dashboard_List, "");
      set_actValue("Sample");
      set_showTestFilter(true);
      if (clearMonitorData) {
        getPendingCollections();
      }
    }
    //getMonitorsData(exandedItemIDRef.current);

    set_testValue("Test");
    set_dateRangeValue("Date Range");
    set_statusValue("Status");
    set_FilterBorderACT(CommonStyles.textInputStyleSmall);
    set_FilterBorderDate(CommonStyles.textInputStyleSmall);
    set_FilterBorderLocation(CommonStyles.textInputStyleSmall);
    set_FilterBorderTest(CommonStyles.textInputStyleSmall);
    set_FilterBorderStatus(CommonStyles.textInputStyleSmall);
    bottomSheetData.forEach((item) => (item.isSelected = false));
    setBottomSheetData(bottomSheetData);

    setSelectedStartDate(null);
    setSelectedEndDate(null);
    //console.log("patSevenDate", patSevenDate)
    // console.log("currentDate", currentDate)
    if (changeInData === '') {
      setChangeInData('change');
    } else if (changeInData === 'change') {
      setChangeInData('noChange');
    } else {
      setChangeInData('');
    }

    if (exandedItemIDRef.current === MonitorTypes.PENDING_ANIMAL_TASKS) {
      const newData: LocationFilterType[] = [...locationLookUpData].map(
        (obj: LocationFilterType) => {

          return {
            ...obj,
            isSelected: false,
            type: "LOC",
          };
        });

      set_locationLookUpData(newData);
    }
    else if (exandedItemIDRef.current === MonitorTypes.PENDING_FMTS) {
      const newData: LocationFilterType[] = [...alllocationsLookUpData].map(
        (obj: LocationFilterType) => {

          return {
            ...obj,
            isSelected: false,
            type: "LOC",
          };
        });

      set_alllocationsLookUpData(newData);
    }

    addPrefredLocation();
    getLocationFilters(false)


  }
  const renderItem = (item: any) => {
    return (
      <LinearGradient style={DashboardStyles.container} colors={["#ECF9EB", "#A8E2EE"]}>
        <View
          style={
            expandedItem === item.monitorId
              ? DashboardStyles.innerviewExpanded
              : DashboardStyles.innerview
          }
        >
          <Pressable
            hitSlop={{ top: 25, bottom: 25, left: 15, right: 250 }}
            onPress={() => toggleExpansion(item.monitorId)}
          >
            <Text style={DashboardStyles.textLarge}>
              {item.monitorName.length > 30
                ? item.monitorName.substring(0, 30) + "..."
                : item.monitorName}
            </Text>
          </Pressable>
          <View style={DashboardStyles.countContainer}>
            <Text style={DashboardStyles.textWhiteSmall}> {getChipCount(item.monitorId, item.monitorCount ?? 0)}</Text>
          </View>

          {expandedItem === item.monitorId ? (
            <DownArrow style={DashboardStyles.arrowStyle}></DownArrow>
          ) : (
            <RightArrow style={DashboardStyles.arrowStyle}></RightArrow>
          )}
        </View>
        {expandedItem === item.monitorId && (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: hp("1%"),
                marginLeft: wp("1%"),
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  resetFilterInputData(true);
                }}
                style={DashboardStyles.filterContainer}
              >
                <Text style={DashboardStyles.textStyleFilters}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={DashboardStyles.filterContainerGradient}
                onPress={() => {
                  if (showFilters) {
                    set_showFilters(false);
                    set_showBottomFilters(false);
                  } else {
                    set_showFilters(true);
                    set_actValue("ACT");
                    if (expandedItem === MonitorTypes.PENDINGCOLLECTIONS) {
                      set_showBottomFilters(false);
                      set_actValue("Sample Type");
                    } else {
                      set_showBottomFilters(true);
                    }

                    if (expandedItem === MonitorTypes.PENDING_FMTS) {
                      set_showTestFilter(false);
                      set_actValue("FMT");
                    }
                  }
                }}
              >
                <Text style={DashboardStyles.textStyleFilters}>Filter</Text>
                <FilterImage style={DashboardStyles.arrowStyleRight}></FilterImage>
              </TouchableOpacity>
            </View>

            {showFilters ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: wp("1%"),
                  marginRight: wp("1%"),
                }}
              >
                {showTestFilter ? (
                  <View style={[CommonStyles.textInputContainerStyleSmall]}>
                    <TouchableOpacity
                      style={filterBorderTest}
                      onPress={() => {
                        getTestFilters();
                        // handlePresentPress();
                      }}
                    >
                      {/* <Text style={DashboardStyles.buttonText}>{testValue}</Text> */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10 }}>
                        <Text style={DashboardStyles.buttonText}>Test</Text>
                        {testFilterValue.current.length > 0 ? <Text style={DashboardStyles.buttonText}>+{testFilterValue.current.length}</Text> : null}
                      </View>

                    </TouchableOpacity>
                  </View>
                ) : null}

                <View style={[CommonStyles.textInputContainerStyleSmall]}>
                  <TouchableOpacity
                    style={filterBorderACT}
                    onPress={() => {
                      if (actValue.includes("ACT")) {
                        getACTLookUpFilters();
                      } else if (actValue.includes("FMT")) {
                        setCurrentFilter("FMT");
                        set_FilterTitle("Filter by FMT");
                        set_FilterSearchTitle("Search FMT");
                        getLookUpFMTNames();
                      } else if (actValue.includes("Sample")) {
                        setCurrentFilter("SAMPLE");
                        set_FilterTitle("Filter by Sample Type");
                        set_FilterSearchTitle("Search Sample Type");
                        getLookUpSampleTypes();
                      }
                    }}
                  >
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10 }}>
                      <Text style={DashboardStyles.buttonText}>{actValue}</Text>
                      {actFilterValue.current.length > 0 ? <Text style={DashboardStyles.buttonText}>+{actFilterValue.current.length}</Text> : null}
                    </View> */}
                    <Text style={DashboardStyles.buttonText}>{actValue}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {showBottomFilters ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: hp("1%"),
                  marginLeft: wp("1%"),
                  marginRight: wp("1%"),
                }}
              >
                <View style={[CommonStyles.textInputContainerStyleSmall]}>
                  <TouchableOpacity
                    style={filterBorderDate}
                    onPress={() => {
                      set_showCalender(true);
                      bottomSheetCalenderRef.current?.present();
                    }}
                  >
                    <Text style={DashboardStyles.buttonText}>{dateRangeValue}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[CommonStyles.textInputContainerStyleSmall]}>
                  <TouchableOpacity
                    style={filterBorderLocation}
                    onPress={() => {
                      setCurrentFilter("LOC");
                      set_FilterTitle("Filter by Location");
                      set_FilterSearchTitle("Search Location");
                      getLocationFilters(true);
                    }}
                  >
                    <Text style={DashboardStyles.buttonText}>{locationValue}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {showFilters && statusID.current === 2 ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: hp("1%"),
                  marginLeft: wp("1%"),
                  marginRight: wp("1%"),
                }}
              >
                <View style={[CommonStyles.textInputContainerStatusStyleSmall]}>
                  <TouchableOpacity
                    style={filterBorderStatus}
                    onPress={() => {
                      setCurrentFilter("Status");
                      set_FilterTitle("Search Status");
                      set_FilterSearchTitle("Search status")
                      setBottomSheetData(bottomSheetStatusData);
                      bottomSheetRef.current?.present();
                    }}
                  >
                    <Text style={DashboardStyles.buttonText}>{statusValue}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}



            <View style={DashboardStyles.innerFlatList}>
              {tableTitles(item.monitorId)}
              <FlatList
                data={flatListData(item.monitorId)}
                ref={flatListRef}
                renderItem={tableContents(item.monitorId)}
                nestedScrollEnabled={true}
                style={dynamicStyle}
                disableIntervalMomentum={true}
                disableVirtualization={true}
                decelerationRate={'fast'} // Disable momentum scrolling
                windowSize={10} // Adjust as needed
                ListHeaderComponent={() => {
                  switch (exandedItemIDRef.current) {
                    case MonitorTypes.PENDING_ANIMAL_TASKS:
                      return showNoRecords ? (
                        <Text style={DashboardStyles.textLargeCenter}>
                          No matching records found
                        </Text>
                      ) : null;
                    case MonitorTypes.PENDING_FMTS:
                      return showNoRecords ? (
                        <Text style={DashboardStyles.textLargeCenter}>
                          No matching records found
                        </Text>
                      ) : null;
                    case MonitorTypes.PENDINGCOLLECTIONS:
                      return showNoRecords ? (
                        <Text style={DashboardStyles.textLargeCenter}>
                          No matching records found
                        </Text>
                      ) : null;
                  }
                }}
                keyExtractor={(item, index) => item.key}
              />
              <Pressable
                hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
                onPress={() => {
                  if (expandIconClicked) {
                    set_expandIconClicked(false);
                    set_dynamicStyle(DashboardStyles.collapsedContainerHeight);
                  } else {
                    //console.log("expanded item", expandedItem);
                    if (expandedItem === 5) {
                      getPendingACTList();
                    } else if (expandedItem === 9) {
                      getFMTTasks();
                    } else if (expandedItem === 203) {
                      getPendingCollections();
                    }

                    set_expandIconClicked(true);
                    expandedItem === item.monitorId;
                    if (expandedItem === MonitorTypes.PENDING_ANIMAL_TASKS) {
                      set_dynamicStyle(DashboardStyles.expandedContainerHeightACT);
                    } else if (
                      expandedItem === MonitorTypes.PENDINGCOLLECTIONS
                    ) {
                      set_dynamicStyle(DashboardStyles.expandedContainerHeightPending);
                    } else if (expandedItem === MonitorTypes.PENDING_FMTS) {
                      set_dynamicStyle(DashboardStyles.expandedContainerHeightFMT);
                    }
                  }
                }}
              >
                {expandIconClicked ? (
                  <CollapseIcon style={DashboardStyles.expandImageStyle} />
                ) : (
                  <ExpandIcon style={DashboardStyles.expandImageStyle} />
                )}
              </Pressable>
            </View>
          </View>
        )}
      </LinearGradient>
    );
  };

  const renderInnerItemACTS = ({ item }: { item: Item }) => (
    <View style={DashboardStyles.rowItem}>
      <Text style={item.actStatusId === 2 || item.actStatusId === 1 ? DashboardStyles.textTinyACT : item.actStatusId === 4 ? DashboardStyles.textTinyFailedACT : DashboardStyles.textTinyNotPerfACT} numberOfLines={1}>
        {item.actName}
      </Text>
      <Pressable
        style={DashboardStyles.textTinyPressableAnimalStlye}
        onPress={() => {
          let from = fromDate.current;
          let to = toDate.current;
          firebaseHelper.logEvent(firebaseHelper.Event_Select_Animal_Dashboard, firebaseHelper.Screen_Dashboard_List, "");

          if (statusID.current === 1) {
            if (item.actClassificationId === 1) {
              navigation.navigate("Tasks", {
                actId: item.actId,
                type: 1,
                selectedTypeId: item.animalId,
                locationValue: item.location,
                actName: item.actName,
                animalName: item.animalNameTattoo,
                selectedAnimalsList: [],
                isRecordGroupAct: false,
                actScheduleId: item.actScheduleId,
                actScheduleDate: "",
                isFromDashboard: true,
                dateFilterFrom: from,
                dateFilterTo: to,
              })

            }
            else {
              navigation.navigate("Operations", {
                actId: item.actId,
                type: 1,
                selectedTypeId: item.animalId,
                locationValue: item.location,
                actName: item.actName,
                animalName: item.animalNameTattoo,
                selectedAnimalsList: [],
                isRecordGroupAct: false,
                actScheduleId: item.actScheduleId,
                actScheduleDate: "",
                isFromDashboard: true,
                dateFilterFrom: from,
                dateFilterTo: to,

              })

            }
          }

        }
        }
      >
        {statusID.current === 1 ?
          <Text style={[DashboardStyles.textTinyAnimalStlye]} numberOfLines={1}>
            {item.animal}
          </Text>
          : <Text style={[item.actStatusId === 2 ? DashboardStyles.textTinyAnimalStlyeBlack : item.actStatusId === 4 ? DashboardStyles.textTinyAnimalStlyeOrange : DashboardStyles.textTinyAnimalStlyeGray]} numberOfLines={1}>
            {item.animal}
          </Text>
        }

      </Pressable>

      <Text style={item.actStatusId === 2 || item.actStatusId === 1 ? DashboardStyles.textTinyTest : item.actStatusId === 4 ? DashboardStyles.textTinyFailTest : DashboardStyles.textTinyNotPerTest}>{item.testNum}</Text>
      {
        Utils.getDateBefore(currentDate, item.scheduledDate) ? (
          <Text style={item.actStatusId === 2 || item.actStatusId === 1 ? DashboardStyles.textTiny : item.actStatusId === 4 ? DashboardStyles.textTinyOrange : DashboardStyles.textTinyGrey}>
            {item.scheduledDate}
          </Text>
        ) : (

          <Text style={statusID.current === 1 ? DashboardStyles.textTinyRed : DashboardStyles.textTiny}>
            {item.scheduledDate}
          </Text>
        )
      }
      <Pressable
        style={DashboardStyles.textTinyBlueLocationPressable}
        onPress={() => {
          let from = fromDate.current;
          let to = toDate.current;
          firebaseHelper.logEvent(firebaseHelper.Event_Select_Location_Dashboard, firebaseHelper.Screen_Dashboard_List, "");
          if (statusID.current === 1) {
            if (item.actClassificationId == 1) {
              navigation.navigate("Tasks", {
                actId: item.actId,
                type: 2,
                selectedTypeId: item.facilityLocationId,
                locationValue: item.location,
                actName: item.actName,
                animalName: item.animalNameTattoo,
                selectedAnimalsList: [],
                isRecordGroupAct: false,
                actScheduleId: "",
                actScheduleDate: "",
                isFromDashboard: true,
                dateFilterFrom: from,
                dateFilterTo: to,

              })
            }
            else {
              navigation.navigate("Operations", {
                actId: item.actId,
                type: 2,
                selectedTypeId: item.facilityLocationId,
                locationValue: item.location,
                actName: item.actName,
                animalName: item.animalNameTattoo,
                selectedAnimalsList: [],
                isRecordGroupAct: false,
                actScheduleId: "",
                actScheduleDate: "",
                isFromDashboard: true,
                dateFilterFrom: from,
                dateFilterTo: to,
              })

            }
          }
        }
        }>
        {statusID.current === 1 ? <Text style={DashboardStyles.textTinyBlueLocation}>{item.location}</Text>
          : <Text style={item.actStatusId === 2 ? DashboardStyles.textTinyBlackLocation : item.actStatusId === 4 ? DashboardStyles.textTinyOrangeLocation : DashboardStyles.textTinyGreyLocation}>{item.location}</Text>}

      </Pressable>
    </View >
  );

  const renderInnerItemFMTS = ({ item }: { item: Item }) => (
    <View style={DashboardStyles.rowItem}>
      <Text style={DashboardStyles.textTinyFMT} numberOfLines={1}>
        {item.fmtName}
      </Text>
      {Utils.getDateBefore(currentDate, item.scheduledDate) ? (
        <Text style={DashboardStyles.textTinyFMTDate}>{item.scheduledDate}</Text>
      ) : (
        <Text style={DashboardStyles.textTinyFMTRed}>{item.scheduledDate}</Text>
      )}
      <Text style={DashboardStyles.textTinyLocationFMT}>{item.location}</Text>
    </View>
  );

  const renderInnerItemPendingCollections = ({ item }: { item: Item }) => (
    <View style={DashboardStyles.rowItem}>
      <Text style={DashboardStyles.textTinyFMT}>{item.testNum}</Text>
      <Text style={DashboardStyles.textTinyFMTSample}>{item.sampleType}</Text>
      <Text style={DashboardStyles.textTinyBluePendingLocation}>
        {item.animalsCount}
      </Text>
    </View>
  );

  const toggleExpansion = (itemId: any) => {
    set_showFilters(false);
    set_showBottomFilters(false);
    exandedItemIDRef.current = itemId;
    set_filterMonitorCount(0);
    set_testLookUpData([]);
    getMonitorsData(itemId);
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === itemId ? null : itemId
    );
    resetFilterInputData(false);
  };

  async function getNotificationReadCount() {
    try {
      let db = await getDBConnection();
      let userId = await Utils.getData("UserId");
      const getlist = await getNotificationItems(db, userId);
      set_notificationReadCount(getlist.length ?? 0);
    } catch (e) {
      console.log("Notificaiton Error", e);
    }

  }
  let notificationsAvailable = notificationCount > 0 ? notificationReadCount !== notificationCount : false;

  return (
    <SafeAreaView style={DashboardStyles.mainContainer}>
      <HeaderComponent
        route={undefined}
        moduleName={"Dashboard_List"}
        headerColor={"#FFF"}
        navigation={undefined}
        notificationsAvailable={notificationsAvailable}
      />
      <View style={DashboardStyles.centerView}>
        <TouchableOpacity
          style={
            pendingEnabled ? DashboardStyles.buttonSelected : DashboardStyles.buttonDeselected
          }
          onPress={() => {
            firebaseHelper.logEvent(firebaseHelper.Event_Pending_Tasks, firebaseHelper.Screen_Dashboard_List, "");
            set_PendingEnabled(true);
            set_actStatusId(1);
            statusID.current = 1;
            set_expandIconClicked(false);
            set_dynamicStyle(DashboardStyles.collapsedContainerHeight);
            resetFilterInputData(true);
            set_filterMonitorCount(0);
            getMonitorCounts();
          }}
        >
          <Text style={!pendingEnabled ? DashboardStyles.text : DashboardStyles.textWhite}>
            Pending Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            !pendingEnabled ? DashboardStyles.buttonSelected : DashboardStyles.buttonDeselected
          }
          onPress={() => {
            firebaseHelper.logEvent(firebaseHelper.Event_Completed_Tasks, firebaseHelper.Screen_Dashboard_List, "");
            set_PendingEnabled(false);
            set_actStatusId(2);
            statusID.current = 2;
            set_expandIconClicked(false);
            set_dynamicStyle(DashboardStyles.collapsedContainerHeight);
            resetFilterInputData(true);
            set_filterMonitorCount(0);
            getMonitorCounts();
          }}
        >
          <Text style={pendingEnabled ? DashboardStyles.text : DashboardStyles.textWhite}>
            Completed Tasks
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView scrollEnabled={!expandIconClicked}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
      >
        {data.map((item) => renderItem(item))}
      </ScrollView>

      <LoadingModal visible={loading} text="Loading..." />

      <BottomSheetComponent
        ref={bottomSheetRef}
        title={filterTitle}
        searchHint={filterSearchTitle}
        data={bottomSheetData}
        isVisible={isBottomSheetVisible}
        onClose={handleHidePress}
        applyFilter={(val) => {
          console.log("apply filter : ", val, currentFilter);
          // console.log("------- : ", bottomSheetData);
          //setBottomSheetData()
          bottomSheetRef.current?.dismiss();
          if (currentFilter === "ACT") {

            //hanlde ACT
            let finalVal = val.filter((result) => result?.isSelected == true);
            // console.log("final val", finalVal);
            let tempArr = [];
            for (let index = 0; index < finalVal.length; index++) {
              tempArr.push(finalVal[index].actId);
            }
            actFilterValue.current = tempArr;
            bottomSheetRef.current?.dismiss();
            if (tempArr.length > 0) {
              set_actValue("ACT +" + tempArr.length);
              set_FilterBorderACT(CommonStyles.textInputStyleOrangeSmall);
            }
            else {
              set_actValue("ACT");
              set_FilterBorderACT(CommonStyles.textInputStyleSmall);
            }
            getDataBasedOnExpandedItem();
          } else if (currentFilter === "LOC") {

            // console.log("current filter loc",val);
            set_locationLookUpData(val);
            let finalVal = val.filter((result) => result?.isSelected == true);
            let tempArr = [];
            for (let index = 0; index < finalVal.length; index++) {
              tempArr.push(finalVal[index].facilityLocationId);
            }
            locationFilterValue.current = tempArr;
            bottomSheetRef.current?.dismiss();
            if (tempArr.length === 0) {
              set_locationValue("Location");
              set_FilterBorderLocation(CommonStyles.textInputStyleSmall);
            } else {
              set_locationValue("Location +" + tempArr.length);
              set_FilterBorderLocation(CommonStyles.textInputStyleOrangeSmall);
            }
            getDataBasedOnExpandedItem();
          } else if (currentFilter === "TEST") {

            let finalVal = val.filter((result) => result?.isSelected == true);
            //const result = concatenateUniqueArrays(testLookUpData, val);

            ///Esiting  
            // let tempTestData = [...testLookUpData];

            // finalVal?.forEach((item) => {
            //   tempTestData.every((element) => {

            //     if (item.testId === element.testId) {
            //       console.log("TEST", "existing ", item.testId)
            //       element.isSelected = item.isSelected;
            //     } else {
            //       console.log("TEST", "NEW ", item.testId);

            //       tempTestData.push(item)
            //     }

            //   });
            // })
            set_testLookUpData(val);

            // let totalData = [...testLookUpData, ...val]
            // set_testLookUpData(totalData);
            setBottomSheetVisible(false);
            bottomSheetRef.current?.dismiss();
            let tempArr = [];
            for (let index = 0; index < finalVal.length; index++) {
              tempArr.push(finalVal[index].testNo);
            }
            testFilterValue.current = tempArr;
            // console.log("TEMP ARR--->", tempArr);
            bottomSheetRef.current?.dismiss();
            if (tempArr.length > 0) {
              set_testValue("Test +" + tempArr.length);
              set_FilterBorderTest(CommonStyles.textInputStyleOrangeSmall);
            }
            else {
              set_testValue("Test");
              set_FilterBorderTest(CommonStyles.textInputStyleSmall);
            }
            getDataBasedOnExpandedItem();
          } else if (currentFilter === "SAMPLE") {
            firebaseHelper.logEvent(firebaseHelper.Event_Collections_Apply_Filter, firebaseHelper.Screen_Dashboard_List, "");
            let finalVal = val.filter((result) => result?.isSelected == true);
            setBottomSheetVisible(false);
            bottomSheetRef.current?.dismiss();
            let tempArr = [];
            for (let index = 0; index < finalVal.length; index++) {
              tempArr.push(finalVal[index].sampleTypeId);
            }
            sampleFilterValue.current = tempArr;
            bottomSheetRef.current?.dismiss();
            if (tempArr.length > 0) {
              set_actValue("Sample Type +" + tempArr.length);
              set_FilterBorderACT(CommonStyles.textInputStyleOrangeSmall);
            }
            else {
              set_actValue("Sample Type");
              set_FilterBorderACT(CommonStyles.textInputStyleSmall);
            }

            getPendingCollections();
          } else if (currentFilter === "FMT") {
            firebaseHelper.logEvent(firebaseHelper.Event_FMT_Apply_Filter, firebaseHelper.Screen_Dashboard_List, "");
            let finalVal = val.filter((result) => result?.isSelected == true);
            setBottomSheetVisible(false);
            bottomSheetRef.current?.dismiss();
            let tempArr = [];
            for (let index = 0; index < finalVal.length; index++) {
              tempArr.push(finalVal[index].fmtId);
            }
            fmtFilterValue.current = tempArr;
            bottomSheetRef.current?.dismiss();
            if (tempArr.length > 0) {
              set_actValue("FMT +" + tempArr.length);
              set_FilterBorderACT(CommonStyles.textInputStyleOrangeSmall);

            }
            else {
              set_actValue("FMT");
              set_FilterBorderACT(CommonStyles.textInputStyleSmall);
            }
            getFMTTasks();
          }

          else if (currentFilter === "Status") {
            let finalVal = val.filter((result) => result?.isSelected == true);
            let tempArr = [];
            for (let index = 0; index < finalVal.length; index++) {
              tempArr.push(finalVal[index].statusId);
            }
            statusFilterValue.current = tempArr;
            set_bottomSheetStatusData(val);
            bottomSheetRef.current?.dismiss();
            if (tempArr.length > 0) {
              //set_actValue("ACT +" + tempArr.length);
              set_statusValue("Status +" + tempArr.length)
              set_FilterBorderStatus(CommonStyles.textInputStyleOrangeSmall);
            }
            else {
              set_statusValue("Status")
              set_FilterBorderStatus(CommonStyles.textInputStyleSmall);
            }
            getDataBasedOnExpandedItem();
          }
        }}
      />


      <DateBottomSheet
        ref={bottomSheetCalenderRef}
        title={statusID.current === 1 ? "Scheduled Date Range" : "Performed Date Range"}
        data={changeInData}
        isVisible={showCalender}
        fromDate={selectedStartDate}
        toDate={selectedEndDate}
        onClose={function (): void {
          // throw new Error("Function not implemented.");
        }}
        applyFilter={function (from: string, to: string): void {
          //throw new Error("Function not implemented.");
          bottomSheetCalenderRef.current?.dismiss();
          fromDate.current = moment(from).format("MM/DD/YYYY");
          toDate.current = moment(to).format("MM/DD/YYYY");


          if (Utils.getDateBefore(fromDate.current, toDate.current)) {
            set_FilterBorderDate(CommonStyles.textInputStyleOrangeSmall);
            getDataBasedOnExpandedItem();
          }
          else {
            showToast("Please select valid dates", "info");
          }

        }
        }></DateBottomSheet>
    </SafeAreaView>
  );
};

export default DashboardListView;

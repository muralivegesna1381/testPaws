import React, { useRef } from "react";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Alert,
    TextInput,
    FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SearchIcon from "../../../../assets/svgs/search.svg";
import FilterImage from "../../../../assets/svgs/filter.svg";
import XIcon from "../../../../assets/svgs/X.svg";
import CsvImage from "../../../../assets/svgs/csv_image.svg";

import { MoreTabsStackParamList } from "../../../navigation/types";
import LinearGradient from "react-native-linear-gradient";
import CommonStyles from "../../../styles/commonstyles";
import LoadingModal from "../../../components/loadingModel";

import fonts, { fontFamily } from "../../../fonts/fonts";

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import BottomSheetComponent, { DataItemType, EntityFilter, EntityTypeFilter, FilterType, UserFilter } from "../../../components/bottomsheet.component";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import AuditLogAPIManager from '../../../network/audit.log.api.manager';

import Utils from "../../../utils";
import { Calendar } from "react-native-calendars";
import { RoomType } from "../../../components/dropdown.component";
import moment from "moment";
import { Colors } from "react-native/Libraries/NewAppScreen";
import CommonHeaderComponent from '../../../components/header.component';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showToast } from "../../../components/custom.toast.message";
import DashboardStyles from "../../../styles/dashboard.style";
import DateBottomSheet, { UserType } from "../../../components/date.component";
import * as firebaseHelper from "../../../utilities/firebase/firebaseHelper";

type AuditObject = {
    entityType: string;
    userName: string;
    date: string;
    entity: string;

};
type moreTabsScreenProps = NativeStackScreenProps<
    MoreTabsStackParamList,
    "AuditLogScreen"
>;

const AuditLogScreen = (props: moreTabsScreenProps) => {
    const { navigation } = props;
    const [searchText, setSearchText] = React.useState('');
    const [showFilters, set_showFilters] = useState(false);
    const [showBottomFilters, set_showBottomFilters] = useState(false);
    const insets = useSafeAreaInsets();
    const [dateRangeValue, set_dateRangeValue] = useState("Date Range");

    const [filterBorderDate, set_FilterBorderDate] = useState(
        CommonStyles.textInputStyleSmall
    );
    const [filterTitle, set_FilterTitle] = useState<string>("");
    const [filterSearchTitle, set_FilterSearchTitle] = useState<string>("");
    const [entityTypeAuditData, set_entityTypeAuditData] = useState<EntityTypeFilter[]>([]);
    const [entityAuditData, set_entityAuditData] = useState<EntityFilter[]>([]);
    const [userData, set_UserData] = useState<UserFilter[]>([]);

    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

    const [bottomSheetData, setBottomSheetData] = useState<DataItemType[]>([]);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const bottomSheetCalenderRef = useRef<BottomSheetModal>(null);

    const userInfoData = useSelector((state: RootState) => state.userInfo);
    const [loading, setLoading] = useState(false);
    const [showCalender, set_showCalender] = useState(false);
    var currentDate = moment(new Date()).format("MM/DD/YYYY");
    const [showNoRecords, set_showNoRecords] = useState<boolean>(false);

    const [markedDates, setMarkedDates] = useState({});
    const [currentFilter, setCurrentFilter] = useState<FilterType>();

    const [auditList, setAuditList] = useState<AuditObject[]>([]);

    const [filteredAuditList, setFilteredAuditList] = useState<AuditObject[]>([]);
    const [changeInData, setChangeInData] = useState<string>("");



    const fromDate = useRef("");
    const toDate = useRef("");
    const userFilterValue = useRef("");
    const entityTypeFilterValue = useRef("");
    const entityFilterValue = useRef("");

    const handlePresentPress = () => {
        setBottomSheetVisible(true);
        bottomSheetRef.current?.present();
    };
    const handleHidePress = () => {
        setBottomSheetVisible(false);
        bottomSheetRef.current?.dismiss();
    };

    const backBtnAction = () => {
        navigation.pop();
    };

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    // Format dates to 'YYYY-MM-DD'
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [selectedStartDate, setSelectedStartDate] = useState<string>(formatDate(sevenDaysAgo));
    const [selectedEndDate, setSelectedEndDate] = useState<string>(formatDate(today));


    const rightButtonAction = () => {
        if (filteredAuditList.length == 0) {
            Alert.alert(
                "Alert!",
                "No data available to export. Please try again"
            );
            return;
        }
        Alert.alert(
            "Alert!",
            "Are you sure you want to export data? ",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        // console.log("OK Pressed");
                        generateAndSharePdf();
                    },
                },
                {
                    text: "No",
                    onPress: () => {
                        // console.log("OK Pressed");
                    },
                },
            ],
            { cancelable: false }
        );

    }
    useEffect(() => {
        firebaseHelper.reportScreen(firebaseHelper.Screen_Audit_Log);
        var currentDate = moment(new Date()).format("MM/DD/YYYY");
        const pastDate = new Date();
        const currentDate3 = new Date();
        pastDate.setDate(currentDate3.getDate() - 6);
        var patSevenDate = moment(pastDate).format("MM/DD/YYYY");
        setSelectedStartDate(patSevenDate);
        setSelectedEndDate(currentDate);

        fromDate.current = patSevenDate;
        toDate.current = currentDate;


        getAuditDetailsList();
    }, [])

    type SerachUIProps = {
        placeHolder: string;
        changeSearchText: (text: string) => void;
        searchText: string;
    }

    function resetFilterInputData(clearMonitorData: boolean) {
        //console.log("method cal");

        entityTypeFilterValue.current = "";
        userFilterValue.current = "";
        entityFilterValue.current = "";
        set_showNoRecords(false);
        set_dateRangeValue("Date Range");
        set_showFilters(true);
        if (clearMonitorData) {
            getAuditDetailsList();
        }
        getUserFilters(false);
        set_FilterBorderDate(CommonStyles.textInputStyleSmall);
        var currentDate = moment(new Date()).format("MM/DD/YYYY");
        const pastDate = new Date();
        const currentDate3 = new Date();
        pastDate.setDate(currentDate3.getDate() - 7);
        var patSevenDate = moment(pastDate).format("MM/DD/YYYY");
        fromDate.current = patSevenDate;
        toDate.current = currentDate;



        setSelectedStartDate(formatDate(sevenDaysAgo));
        setSelectedEndDate(formatDate(today));
        if (changeInData === '') {
            setChangeInData('change');
        } else if (changeInData === 'change') {
            setChangeInData('noChange');
        } else {
            setChangeInData('');
        }
        bottomSheetData.forEach((item) => (item.isSelected = false));
        setBottomSheetData(bottomSheetData);
    }
    async function getAuditDetailsList() {
        setLoading(true);
        let userID = await Utils.getData("UserId");
        try {
            let auditDetails = await AuditLogAPIManager.getAuditDetailsList(
                fromDate.current,
                toDate.current,
                entityTypeFilterValue.current ?? "",
                entityFilterValue.current ?? "",
                userFilterValue.current ?? "",
            );
            // console.log("auditDetails-->", auditDetails);

            if (auditDetails?.status?.success) {
                if (auditDetails?.response && auditDetails?.response?.length > 0) {
                    set_showNoRecords(false);
                    let dataList = auditDetails?.response;
                    setAuditList(dataList);
                    setFilteredAuditList(dataList);
                } else {
                    set_showNoRecords(true);
                    setAuditList([]);
                    setFilteredAuditList([]);

                    // Alert.alert("Alert!", "No data available for the search criteria.");
                }
            } else {
                setLoading(false);

                Alert.alert("Alert!", auditDetails.errors.message);
            }
        } catch (e) {
            console.error("Error", e);
        } finally {
            setLoading(false);
        }
    }
    async function getAuditEntityTypeNames() {
        if (entityTypeAuditData?.length > 0) {
            const newData = [...entityTypeAuditData];
            setBottomSheetData(newData);
            bottomSheetRef.current?.present();
            return;
        }
        setLoading(true);
        try {

            let auditEntityTypes = await AuditLogAPIManager.getAuditEntityTypes();
            if (auditEntityTypes.status.success) {
                //TO-DO Bottomsheet FMTs
                const newData: EntityTypeFilter[] = auditEntityTypes.response.map(
                    (obj: EntityTypeFilter) => {
                        return { ...obj, isSelected: false, type: "EntityType" };
                    }
                );

                setBottomSheetVisible(true);
                setBottomSheetData(newData);
                set_entityTypeAuditData(newData);
                bottomSheetRef.current?.present();
            } else {
                Alert.alert("API faild", auditEntityTypes.errors.message);
            }
        } catch (e) {
            console.error("Error", e);
        } finally {
            setLoading(false);
        }
    }

    async function getAuditEntityNames() {
        if (entityAuditData?.length > 0) {
            const newData = [...entityAuditData];
            setBottomSheetData(newData);
            bottomSheetRef.current?.present();
            return;
        }

        setLoading(true);
        try {
            console.log("auditEntity ---- ");

            let auditEntity = await AuditLogAPIManager.getAuditEntity();
            // console.log("auditEntity ---- ", auditEntity);
            if (auditEntity.status.success) {
                //TO-DO Bottomsheet FMTs
                const newData: EntityFilter[] = auditEntity.response.map(
                    (obj: EntityFilter) => {
                        return { ...obj, isSelected: false, type: "Entity" };
                    }
                );
                //console.log("auditEntity 2 ---- ", newData);

                setBottomSheetVisible(true);
                setBottomSheetData(newData);
                set_entityAuditData(newData);
                bottomSheetRef.current?.present();
            } else {
                Alert.alert("API faild", auditEntity.errors.message);
            }
        } catch (e) {
            console.error("Error", e);
        } finally {
            setLoading(false);
        }
    }

    async function getUserFilters(showBottom: boolean) {
        if (userData?.length > 0) {
            const newData = [...userData];
            setBottomSheetData(newData);
            if (showBottom) {
                bottomSheetRef.current?.present();
            }
            return;
        }
        setLoading(true);
        try {
            //let userID = await Utils.getData("UserId");
            //To load all data.
            let lookupUsers = await AuditLogAPIManager.getLookUpUsers();
            if (lookupUsers?.status?.success) {
                //TO-DO Bottomsheet User
                // console.log("res User", lookupUsers.response);

                const newData: UserFilter[] = lookupUsers.response.map(
                    (obj: UserFilter) => {
                        return { ...obj, isSelected: false, type: "User" };
                    }
                );
                //TODO need to update initial user filter
                newData.filter((d) => d.isSelected === true).length;

                setBottomSheetVisible(true);
                setBottomSheetData(newData);
                set_UserData(newData);
                if (showBottom) {
                    bottomSheetRef.current?.present();
                }
            } else {
                Alert.alert(lookupUsers?.errors?.message ?? "The server was unable to process the request. Please try again after some time.");
            }
        } catch (e) {
            console.error("Error", e);
        } finally {
            setLoading(false);
        }
    }
    ///Search UI
    const SearchUI: React.FC<SerachUIProps> = (props) => {
        return (
            <View style={styles.searchTextStyle}>
                <View style={[styles.SearchUI, { backgroundColor: 'transparent', borderRadius: 10 }]}>
                    <TextInput
                        style={[styles.searchContainerStyle, { backgroundColor: 'transparent', marginLeft: 15 }]}
                        editable={true}
                        placeholder={"Search"}
                        placeholderTextColor={"#000000"}
                        maxLength={20}
                        onChangeText={(text) => {
                            // if (text.length > 0) {
                            //     const _filteredData = auditList?.filter((item: AuditObject) => {
                            //         return item.entityType
                            //             .toLowerCase()
                            //             .includes(text.toLowerCase()) || item.userName
                            //                 .toLowerCase()
                            //                 .includes(text.toLowerCase()) || item.entity
                            //                     .toLowerCase().includes(text.toLowerCase());

                            //     });
                            //     setFilteredAuditList(_filteredData);

                            // } else {
                            //     setFilteredAuditList(auditList);
                            // }
                        }}
                    />
                </View>
                <TouchableOpacity onPress={() => { }}>
                    <View style={styles.SearchImage}>
                        <SearchIcon />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // const onDayPress = (day: any) => {
    //     if (!selectedStartDate || selectedEndDate) {
    //         console.log("First date")
    //         setSelectedStartDate(day.dateString);
    //         setSelectedEndDate(null);
    //         setMarkedDates({
    //             [day.dateString]: {
    //                 marked: true,
    //                 color: Colors.APP_BLUE,
    //                 textColor: 'white',
    //                 startingDay: true,
    //                 endingDay: true
    //             },
    //         });
    //     } else {
    //         // Select end date
    //         console.log("Second date")
    //         setSelectedEndDate(day.dateString);
    //         let range = {};
    //         let startDate = moment(selectedStartDate);
    //         let endDate = moment(day.dateString);
    //         let currentDate = startDate;
    //         while (currentDate <= endDate) {
    //             range[currentDate.format("MM-DD-YYYY")] = {
    //                 color: "#136DA5",
    //                 textColor: "white",
    //             };
    //             currentDate = currentDate.clone().add(1, "day");
    //         }
    //         setMarkedDates({
    //             [day.dateString]: {
    //                 marked: true,
    //                 color: Colors.APP_BLUE,
    //                 textColor: 'white',
    //                 startingDay: true,
    //                 endingDay: true
    //             },
    //         });
    //         //setMarkedDates(range);
    //         fromDate.current = startDate.format("MM/DD/YYYY");
    //         toDate.current = endDate.format("MM/DD/YYYY");
    //     }
    // };


    async function generateAndSharePdf() {
        setLoading(true);
        let userID = await Utils.getData("UserId");
        try {
            firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Export_CSV, firebaseHelper.Screen_Audit_Log, "");
            let auditDetails = await AuditLogAPIManager.exportAuditDetails(
                userID,
                fromDate.current,
                toDate.current,
                entityTypeFilterValue.current ?? "",
                entityFilterValue.current ?? "",
                userFilterValue.current ?? "",
            );
            if (auditDetails?.status?.success) {
                firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Export_CSV_Success, firebaseHelper.Screen_Audit_Log, "");

                setLoading(false);
                showToast("Audit log export initiated. Please check your email for more details.", "success");

            } else {
                firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Export_CSV_Fail, firebaseHelper.Screen_Audit_Log, "");
                setLoading(false);
                showToast(auditDetails.errors.message, "error");
            }
        } catch (e) {
            console.error("Error", e);
        } finally {
            setLoading(false);
        }
    }
    const changeSearchText = (text: string) => {
        // setSearchText(text);
        if (text.length > 0) {
            const _filteredData = auditList?.filter((item: AuditObject) => {
                return item.entityType
                    .toLowerCase()
                    .includes(text.toLowerCase()) || item.userName
                        .toLowerCase()
                        .includes(text.toLowerCase()) || item.entity
                            .toLowerCase().includes(text.toLowerCase());

            });
            setFilteredAuditList(_filteredData);

        } else {
            setFilteredAuditList(auditList);
        }
    }

    function ResetFilterUI() {
        return (

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
                            firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Reset, firebaseHelper.Screen_Audit_Log, "");
                            resetFilterInputData(true);
                        }}
                        style={styles.filterContainer}
                    >
                        <Text style={styles.textStyleFilters}>Reset</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterContainerGradient}
                        onPress={() => {
                            if (showFilters) {
                                set_showFilters(false);
                                set_showBottomFilters(false);
                            } else {
                                firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Filter, firebaseHelper.Screen_Audit_Log, "");
                                set_showFilters(true);

                            }
                        }}
                    >
                        <Text style={styles.textStyleFilters}>Filter</Text>
                        <FilterImage style={styles.arrowStyleRight}></FilterImage>
                    </TouchableOpacity>
                </View>

                {showFilters ? (
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 15,
                            justifyContent: "space-between",
                            marginLeft: wp("3%"),
                            marginRight: wp("3%"),
                        }}
                    >

                        <View style={[CommonStyles.textInputContainerStyleSmall]}>
                            <TouchableOpacity
                                style={entityTypeFilterValue.current.length > 0 ? CommonStyles.textInputStyleOrangeSmall : CommonStyles.textInputStyleSmall}
                                onPress={() => {
                                    setCurrentFilter("EntityType");
                                    set_FilterTitle("Filter by Entity Type");
                                    set_FilterSearchTitle("Search Entity Type");
                                    getAuditEntityTypeNames();
                                }}
                            >
                                {/* <Text style={styles.buttonText}>{entityTypeValue}</Text> */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10 }}>
                                    <Text style={styles.buttonText}>Entity Type</Text>
                                    {entityTypeFilterValue.current.length > 0 ? <Text style={styles.buttonText}>+{entityTypeFilterValue.current.length}</Text> : null}
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={[CommonStyles.textInputContainerStyleSmall]}>
                            <TouchableOpacity
                                style={filterBorderDate}
                                onPress={() => {
                                    set_showCalender(true);
                                    bottomSheetCalenderRef.current?.present();

                                }}
                            >
                                {/* <Text style={styles.buttonText}>{fromDate.current} - {toDate.current}</Text> */}

                                <Text style={styles.buttonText}>{dateRangeValue}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                ) : null}

                {showFilters ? (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 5,
                            marginBottom: hp("1%"),
                            marginLeft: wp("3%"),
                            marginRight: wp("3%"),
                        }}
                    >
                        <View style={[CommonStyles.textInputContainerStyleSmall]}>
                            <TouchableOpacity
                                style={entityFilterValue.current.length > 0 ? CommonStyles.textInputStyleOrangeSmall : CommonStyles.textInputStyleSmall}
                                onPress={() => {
                                    setCurrentFilter("Entity");
                                    set_FilterTitle("Filter by Entity");
                                    set_FilterSearchTitle("Search Entity");
                                    getAuditEntityNames();
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10 }}>
                                    <Text style={styles.buttonText}>Entity</Text>
                                    {entityFilterValue.current.length > 0 ? <Text style={styles.buttonText}>+{entityFilterValue.current.length}</Text> : null}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[CommonStyles.textInputContainerStyleSmall]}>
                            <TouchableOpacity
                                style={userFilterValue.current.length > 0 ? CommonStyles.textInputStyleOrangeSmall : CommonStyles.textInputStyleSmall}
                                onPress={() => {
                                    setCurrentFilter("USER");
                                    set_FilterTitle("Filter by User");
                                    set_FilterSearchTitle("Search User");
                                    getUserFilters(true);
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10 }}>
                                    <Text style={styles.buttonText}>User</Text>
                                    {userFilterValue.current.length > 0 ? <Text style={styles.buttonText}>+{userFilterValue.current.length}</Text> : null}
                                </View>
                                {/* <Text style={styles.buttonText}>{userValue}</Text> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}

            </View>


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
                        paddingTop: 4,
                        height: 0.5,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </View>
        );
    };

    const ListItem = (auditObject: AuditObject) => (

        <View style={{
        }}>
            <View style={styles.listItemBgStyle}>
                <Text numberOfLines={1} style={[styles.listItemStyle, { flex: 1 }]}>{auditObject.entityType}</Text>
                <Text numberOfLines={1} style={[styles.listItemStyle, { flex: 1.5 }]}>{auditObject.entity}</Text>
                <Text numberOfLines={1} style={[styles.listItemStyle, { flex: 1 }]}>{auditObject.date}</Text>
                <Text numberOfLines={1} style={[styles.listItemStyle, { flex: 1 }]}>{auditObject.userName}</Text>
            </View>
            {divider()}
        </View>
    );


    const onDayPress1 = (day: { dateString: string }) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // Select start date
            setSelectedStartDate(day.dateString);
            setSelectedEndDate(null);
            fromDate.current = moment(day.dateString).format("MM/DD/YYYY");
        } else if (selectedStartDate && !selectedEndDate) {
            // Select end date
            setSelectedEndDate(day.dateString);
            toDate.current = moment(day.dateString).format("MM/DD/YYYY");
        }
    };

    const getMarkedDates = () => {
        const markedDates: { [key: string]: any } = {};
        if (selectedStartDate) {
            markedDates[selectedStartDate] = { startingDay: true, color: 'lightblue' };
        }

        if (selectedEndDate) {
            markedDates[selectedEndDate] = { endingDay: true, color: 'lightblue' };
        }

        if (selectedStartDate && selectedEndDate) {
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);

            // Generate dates between start and end
            const dateArray: string[] = [];
            for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
                dateArray.push(dt.toISOString().split('T')[0]);
            }

            dateArray.forEach(date => {
                markedDates[date] = { color: 'lightblue' };
            });
        }

        return markedDates;

    };


    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>

            <CommonHeaderComponent navigation={undefined} route={undefined} moduleName={"undefined"}
                headerTitle='Audit Log'
                isShowBackButton={true}
                backBtnAction={backBtnAction}
                isShowRightButton={true}
                rightButtonAction={rightButtonAction}
                rightButtonImage={<CsvImage style={{ marginRight: 10 }} />}

            ></CommonHeaderComponent>


            <View style={{ backgroundColor: "rgba(160, 215, 217, 0.4)", borderRadius: 10, margin: 5, marginBottom: 15, marginLeft: 15, marginRight: 15 }}>
                <View style={styles.searchTextStyle}>
                    <View style={[styles.SearchUI, { backgroundColor: 'transparent', borderRadius: 10 }]}>
                        <TextInput
                            style={[styles.searchContainerStyle, { backgroundColor: 'transparent', marginLeft: 15 }]}
                            editable={true}
                            placeholder={"Search"}
                            placeholderTextColor={"#000000"}
                            maxLength={20}
                            onChangeText={(text) => {
                                setSearchText(text);
                                // if (text.length > 0) {
                                //     const _filteredData = auditList?.filter((item: AuditObject) => {
                                //         return item.entityType
                                //             .toLowerCase()
                                //             .includes(text.toLowerCase())
                                //             || item.userName
                                //                 .toLowerCase()
                                //                 .includes(text.toLowerCase())
                                //             || item.date
                                //                 .toLowerCase()
                                //                 .includes(text.toLowerCase())
                                //             || item.entity
                                //                 .toLowerCase().includes(text.toLowerCase());

                                //     });
                                //     if (_filteredData.length > 0) {
                                //         set_showNoRecords(false);
                                //     } else {
                                //         set_showNoRecords(true);
                                //     }
                                //     setFilteredAuditList(_filteredData);

                                // } else {
                                //     set_showNoRecords(false)
                                //     setFilteredAuditList(auditList);

                                // }
                            }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => {
                        firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Search, firebaseHelper.Screen_Audit_Log, "");

                        if (searchText.length > 0) {
                            const _filteredData = auditList?.filter((item: AuditObject) => {
                                return item.entityType
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase())
                                    || item.userName
                                        .toLowerCase()
                                        .includes(searchText.toLowerCase())
                                    || item.date
                                        .toLowerCase()
                                        .includes(searchText.toLowerCase())
                                    || item.entity
                                        .toLowerCase().includes(searchText.toLowerCase());

                            });
                            if (_filteredData.length > 0) {
                                set_showNoRecords(false);
                            } else {
                                set_showNoRecords(true);
                            }
                            setFilteredAuditList(_filteredData);

                        } else {
                            set_showNoRecords(false)
                            setFilteredAuditList(auditList);

                        }

                    }}>
                        <View style={styles.SearchImage}>
                            <SearchIcon />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <reset Filter UI /> */}
            <LinearGradient style={styles.container} colors={["#ECF9EB", "#A8E2EE"]}>
                <View style={{ borderRadius: 10, }}>
                    <ResetFilterUI />
                </View>
            </LinearGradient>
            {/* list Items UI /> */}

            {
                showNoRecords ? (
                    <View style={{
                        marginLeft: wp("3%"),
                        marginRight: wp("3%"),
                        borderRadius: 12,
                        flex: 1,
                        justifyContent: 'center'

                    }}>
                        <Text style={styles.textLargeCenter}>
                            Sorry, no matching results found!
                        </Text>
                    </View >

                ) : <View style={{
                    marginLeft: wp("3%"),
                    marginRight: wp("3%"),
                    borderRadius: 12,
                }}>
                    <View style={[styles.listHeader, {
                        // borderTopLeftRadius: 4,
                        // borderTopRightRadius: 4
                    }]}>
                        <Text style={[styles.listHeading, { flex: 1 }]}>Entity Type</Text>
                        <Text style={[styles.listHeading, { flex: 1.5 }]}>Entity</Text>
                        <Text style={[styles.listHeading, { flex: 1 }]}>Date</Text>
                        <Text style={[styles.listHeading, { flex: 1 }]}>User</Text>
                    </View >
                </View >
            }


            <View style={{ flex: 1 }}>
                <LinearGradient style={{
                    marginLeft: wp("3%"),
                    marginRight: wp("3%"),
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10
                }} colors={['#EDF9EA', '#A5E1EE']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}>


                    <FlatList
                        data={filteredAuditList}
                        renderItem={({ item }) => ListItem(item)}

                        // renderItem={({ item }) => (
                        //     <ListItem
                        //         auditObject={item}
                        //     />
                        // )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </LinearGradient>

            </View>
            <LoadingModal visible={loading} text="Loading..." />

            <BottomSheetComponent
                ref={bottomSheetRef}
                title={filterTitle}
                searchHint={filterSearchTitle}
                data={bottomSheetData}
                isVisible={isBottomSheetVisible}
                onClose={handleHidePress}
                applyFilter={(val) => {
                    bottomSheetRef.current?.dismiss();
                    if (currentFilter === "EntityType") {
                        firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Entity_Type_Filter, firebaseHelper.Screen_Audit_Log, "");
                        //hanlde ACT
                        let finalVal = val.filter((result) => result?.isSelected == true);
                        let tempArr = [];
                        for (let index = 0; index < finalVal.length; index++) {
                            tempArr.push(finalVal[index].entityTypeId);
                        }

                        entityTypeFilterValue.current = tempArr;
                        // bottomSheetRef.current?.dismiss();
                        bottomSheetRef.current?.close
                        getAuditDetailsList();

                    } else if (currentFilter === "USER") {
                        firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_User_Filter, firebaseHelper.Screen_Audit_Log, "");

                        // console.log("current filter user");
                        let finalVal = val.filter((result) => result?.isSelected == true);
                        let tempArr = [];
                        for (let index = 0; index < finalVal.length; index++) {
                            tempArr.push(finalVal[index].userInfoId);
                        }
                        userFilterValue.current = tempArr;
                        bottomSheetRef.current?.dismiss();

                        getAuditDetailsList();


                    } else if (currentFilter === "Entity") {
                        firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Entity_Filter, firebaseHelper.Screen_Audit_Log, "");
                        let finalVal = val.filter((result) => result?.isSelected == true);
                        setBottomSheetVisible(false);
                        bottomSheetRef.current?.dismiss();
                        let tempArr = [];
                        for (let index = 0; index < finalVal.length; index++) {
                            tempArr.push(finalVal[index].entityTypeName);
                        }
                        entityFilterValue.current = tempArr;
                        bottomSheetRef.current?.dismiss();
                        getAuditDetailsList();
                    }
                }}

            />
            <DateBottomSheet
                ref={bottomSheetCalenderRef}
                title={"Date Range"}
                data={changeInData}
                fromDate={selectedStartDate}
                toDate={selectedEndDate}
                isVisible={showCalender}
                onClose={function (): void {
                    // throw new Error("Function not implemented.");
                }}
                applyFilter={function (from: string, to: string): void {
                    firebaseHelper.logEvent(firebaseHelper.Event_Audit_Log_Date_Filter, firebaseHelper.Screen_Audit_Log, "");

                    //throw new Error("Function not implemented.");
                   // console.log("HRERERE", fromDate, toDate);
                    bottomSheetCalenderRef.current?.dismiss();
                    fromDate.current = moment(from).format("MM/DD/YYYY");
                    toDate.current = moment(to).format("MM/DD/YYYY");


                    if (Utils.getDateBefore(fromDate.current, toDate.current)) {
                        set_FilterBorderDate(CommonStyles.textInputStyleOrangeSmall);
                        getAuditDetailsList();
                    }
                    else {
                        showToast("Please select valid dates", "info");
                    }

                }
                }></DateBottomSheet>




            {/* {showCalender ? (
                <View>
                    <Calendar
                        onDayPress={onDayPress1}
                        markingType="period"
                        markedDates={getMarkedDates()}
                    />
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                        <Pressable
                            // hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => {
                                set_FilterBorderDate(CommonStyles.textInputStyleOrangeSmall);
                                set_showCalender(false);
                                getAuditDetailsList()
                            }}
                        >
                            <Text style={DashboardStyles.closeButtonCalender}>Apply filters</Text>
                        </Pressable>

                        <Pressable
                            // hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => {
                                set_showCalender(false);
                            }}
                        >
                            <Text style={DashboardStyles.closeButtonCalender}>Close</Text>
                        </Pressable>
                    </View>
                </View>

                // onDayPress={onDayPress}
                // style={DashboardStyles.calenderStyle}

                // <View style={DashboardStyles.calenderContainer}>
                //     {fromDate.current && toDate.current ? <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: hp("2%") }}>
                //         <Text style={DashboardStyles.calenderDateText}>From Date: {fromDate.current}</Text>
                //         <Text style={DashboardStyles.calenderDateText}>To Date: {toDate.current} </Text>
                //     </View> : null}

                //     <Calendar
                //         markedDates={markedDates}
                //         onDayPress={onDayPress}
                //         style={DashboardStyles.calenderStyle}
                //         markingType="period"
                //     />
                // <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                //     <Pressable
                //         // hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                //         onPress={() => {
                //             set_FilterBorderDate(CommonStyles.textInputStyleOrangeSmall);
                //             set_showCalender(false);
                //             getAuditDetailsList()
                //         }}
                //     >
                //         <Text style={DashboardStyles.closeButtonCalender}>Apply filters</Text>
                //     </Pressable>

                //     <Pressable
                //         // hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                //         onPress={() => {
                //             set_showCalender(false);
                //         }}
                //     >
                //         <Text style={DashboardStyles.closeButtonCalender}>Close</Text>
                //     </Pressable>
                // </View>

                // </View>
            ) : null
            } */}
            {/* {
                showCalender ? (
                    <View style={styles.calenderContainer}>
                        <Pressable
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => {
                                set_showCalender(false);
                            }}
                        >
                            <XIcon style={styles.xImageStyle}></XIcon>
                        </Pressable>

                        <Calendar
                            markedDates={markedDates}
                            onDayPress={onDayPress}
                            style={styles.calenderStyle}
                            markingType={"period"}
                        />
                    </View>
                ) : null */
            }
        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        //flex: 1,
        marginTop: hp("0.1%"),
        paddingHorizontal: wp("2%"),
        marginLeft: wp("3%"),
        marginRight: wp("3%"),
        borderRadius: 10,
        minHeight: hp("5%"),
        justifyContent: "center",
    },
    SearchUI: {
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        flex: 1,
    },
    SearchImage: {
        height: 40,
        width: 40,
        backgroundColor: '#C3CFD6',
        borderRadius: 6,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    searchTextStyle: {
        backgroundColor: '#FFFFFF',
        margin: 10,
        borderRadius: 6,
        flexDirection: 'row',
        borderColor: '#242E4226',
        borderWidth: 1,
    },
    searchContainerStyle: {
        height: 40,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        // fontWeight: '400',
        fontSize: 18,
        fontFamily: "Lexend-Regular",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: wp("15%"),
        backgroundColor: "#FFF",
        height: hp("3%"),
        borderRadius: 8,
        marginRight: wp("3%"),
        marginBottom: wp("2%"),
    },
    filterContainerGradient: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: wp("18%"),
        //backgroundColor: "#EAF8F7",
        height: hp("3%"),
        borderRadius: 10,
        marginLeft: wp("3%"),
        marginBottom: wp("2%"),
    },
    textStyleFilters: {
        color: "black",
        fontSize: fonts.fontTiny,
        // marginLeft: wp("1%"),
        // marginRight: wp("1%"),
        textAlign: "left",
        fontFamily: "Lexend-Medium",

    },
    arrowStyleRight: {
        marginRight: wp("3%"),
    },
    headerViewStyle: {

        //height : hp('6%'),
        width: wp('90%'),
        alignSelf: 'center'
    },
    listHeading: {
        fontSize: fonts.fontSmall,
        ...CommonStyles.textStyleSemiBold,
        marginRight: 10,
        marginLeft: 5,

    },
    listItemStyle: {
        fontSize: fonts.fontSmall,
        ...CommonStyles.textStyleRegular,
        marginRight: 10,
        marginLeft: 5,

    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // padding: 10,
        alignItems: 'center',
        marginTop: hp('1.5%'),
        height: hp('3.5%'),
        borderWidth: 1,
        borderColor: '#FEFEFE',
        backgroundColor: 'rgba(243, 250, 247, 1.0)',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15

    },

    listItemBgStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1.5%'),
        height: hp('3.5%'),
    },


    xImageStyle: {
        alignSelf: "flex-end",
        marginRight: hp("2%"),
        padding: 5,
        marginTop: 10,
    },
    listRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // elevation: 1,
        borderColor: '#565867',
        borderBottomWidth: 1,
        padding: 10,
        borderRadius: 15,
        alignItems: 'center'
    },
    listCell: {
        fontSize: fonts.fontXXTiny,
        ...CommonStyles.textStyleRegular,
        flex: 1,

        // textAlign: 'left'
    },
    auditlogStyle: {
        flexDirection: 'row',
        marginTop: hp('2%')
    },
    loadBowlViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        margin: 5,
        height: hp('6%')
    },

    buttonText: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        fontFamily: "Lexend-Medium",
        fontSize: fonts.fontTiny,
        marginLeft: wp("2%"),
        marginTop: hp("1%"),
    },
    calenderContainer: {
        //marginTop: hp("14%"),
        backgroundColor: "#F1F9E8",
        borderColor: "#000",
    },

    calenderStyle: {
        backgroundColor: "#F1F9E8",
        marginBottom: 10,
    },
    textLargeCenter: {
        color: "black",
        fontSize: fonts.fontXSmall,
        marginTop: hp("0.75%"),
        fontFamily: "Lexend-Regular",
        fontWeight: "700",
        textAlign: "center",
    },

    closeButtonCalender: {
        alignSelf: "flex-end",
        fontFamily: fontFamily.regular,
        marginRight: wp("2%"),
        marginBottom: hp("2%"),
        marginTop: hp("2%"),
    },
    calenderDateText: {
        fontFamily: fontFamily.regular,
        // marginRight: wp("2%"),
        // marginBottom: hp("2%"),
        // marginTop: hp("2%"),
    },


    collapsedContainerHeight: {
        height: hp("15%"),
    },
    expandedContainerHeightACT: {
        height: hp("44%"),
    },
    expandedContainerHeightPending: {
        height: hp("39%"),
    },
    expandedContainerHeightFMT: {
        height: hp("31%"),
    },

});

export default AuditLogScreen;
import {
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetFlatList,
    BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

import React, {
    forwardRef,
    useMemo,
    useEffect,
    useState,
    useCallback,
} from "react";
import { Text, View, Pressable } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useTranslation } from "react-i18next";
import BottomSheetStyle from "../styles/bottonsheet.style";
import _ from "lodash";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { TouchableOpacity } from "react-native-gesture-handler";
import DashboardStyles from "../styles/dashboard.style";
export type SelectValue = {
    isSelected: boolean;
};

export type UserType = {
    userName: string;
    userInfoId: number;
};
// export type DataItemTypeLocation = LocationFilterType;
// export type UserType = SelectValue & DataItemTypeLocation;

type Props = {
    title: string;
    data: string;
    isVisible: boolean;
    onClose: () => void;
    fromDate: string;
    toDate: string;
    applyFilter: (fromDate: string, toDate: string) => void;
};
type Ref = BottomSheetModal;
const DateBottomSheet = forwardRef<BottomSheetModal, Props>(
    (props, ref) => {
        const { t } = useTranslation();
        const snapPoints = useMemo(() => ["60%"], []);
        const { title, isVisible, onClose, applyFilter, data, fromDate, toDate } = props;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        const [searchString, setSearchString] = useState("");
        //const [data, setData] = useState<UserType[]>([]);
        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const [selectedStartDate, setSelectedStartDate] = useState<string>(fromDate);
        const [selectedEndDate, setSelectedEndDate] = useState<string>(toDate);

        const [filteredData, setFilteredData] = useState<UserType[]>(
            []
        );
        useEffect(() => {
           // console.log("DATATATA", fromDate, toDate, data);
            //console.log("USESTATE DATES-->", selectedStartDate, selectedEndDate)
            setSelectedStartDate(fromDate);
            setSelectedEndDate(toDate);
            // setSelectedStartDate(formatDate(sevenDaysAgo));
            // setSelectedEndDate(formatDate(today));
        }, [data]);

        // useEffect(() => {
        //     const timer = setTimeout(() => {
        //         if (searchString.length !== 0) {
                    // const _filteredData = data.filter((item) => {
                    //     return item.userName
                    //         .toLowerCase()
                    //         .includes(searchString.toLowerCase());
                    // });
        //             console.log("FILTER", _filteredData);
        //             setFilteredData(_filteredData);
        //         } else if (searchString.length === 0) {
        //             setFilteredData([]);
        //         }
        //     }, 1000);

        //     return () => clearTimeout(timer);
        // }, [searchString]);

        const onDayPress1 = (day: { dateString: string }) => {
            if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                // Select start date
                setSelectedStartDate(day.dateString);
                setSelectedEndDate(null);
                //final output to return here
                //fromDate.current = moment(day.dateString).format("MM/DD/YYYY");
            } else if (selectedStartDate && !selectedEndDate) {
                // Select end date
                setSelectedEndDate(day.dateString);
                //final output to return here
                // toDate.current = moment(day.dateString).format("MM/DD/YYYY");
            }
        };

        const getMarkedDates = () => {
            const markedDates: { [key: string]: any } = {};
            //console.log("START===--->", selectedStartDate)
            //console.log("ENDDATE====---->", selectedEndDate)
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
        return (
            <BottomSheetModal
                snapPoints={snapPoints}
                ref={ref}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                enableContentPanningGesture={false}
                enableHandlePanningGesture={false}
                handleIndicatorStyle={{ backgroundColor: "transparent" }}
            >
                <View style={{ marginLeft: wp("5%"), marginRight: wp("5%"), flex: 1 }}>
                    <Text style={BottomSheetStyle.headerTextStyle}>{title}</Text>

                    <Calendar
                        onDayPress={onDayPress1}
                        markingType="period"
                        markedDates={getMarkedDates()}
                    />

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: hp("3%") }}>
                        <Pressable
                            style={{ borderRadius: 25, backgroundColor: "rgba(255, 111, 12, 0.2)", padding: 15, width: wp("85%"), borderColor: "#FF6F0C", borderWidth: 1 }}
                            onPress={() => {
                                //console.log("Apply action");
                                applyFilter(selectedStartDate, selectedEndDate);
                            }}
                        >
                            <Text style={DashboardStyles.closeButtonCalender}>Apply filters</Text>
                        </Pressable>
                    </View>
                </View>
            </BottomSheetModal>
        );
    }
);

export default DateBottomSheet;
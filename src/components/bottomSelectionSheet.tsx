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
    data: UserType[];
    isVisible: boolean;
    onClose: () => void;
    applyFilter: (val: UserType) => void;
};
type Ref = BottomSheetModal;
const SelectionBottomSheet = forwardRef<BottomSheetModal, Props>(
    (props, ref) => {
        const { t } = useTranslation();
        const snapPoints = useMemo(() => ["60%"], []);
        const { title, isVisible, onClose, applyFilter } = props;
        const [searchString, setSearchString] = useState("");
        const [data, setData] = useState<UserType[]>([]);
        const [filteredData, setFilteredData] = useState<UserType[]>(
            []
        );
        useEffect(() => {
            const newData = props.data.map((obj) => {
                return { ...obj, isSelected: false };
            });
            setData(newData);
        }, [isVisible]);

        useEffect(() => {
            const timer = setTimeout(() => {
                if (searchString.length !== 0) {
                    const _filteredData = data.filter((item) => {
                        return item.userName
                            .toLowerCase()
                            .includes(searchString.toLowerCase());
                    });
                    //console.log("FILTER", _filteredData);
                    setFilteredData(_filteredData);
                } else if (searchString.length === 0) {
                    setFilteredData([]);
                }
            }, 1000);

            return () => clearTimeout(timer);
        }, [searchString]);

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
                // backgroundStyle={{ backgroundColor: "#ffffff" }}
                handleIndicatorStyle={{ backgroundColor: "transparent" }}
            >
                <View style={{ marginLeft: wp("5%"), marginRight: wp("5%"), flex: 1 }}>
                    <Text style={BottomSheetStyle.headerTextStyle}>{title}</Text>
                    <BottomSheetTextInput
                        style={BottomSheetStyle.textInputStyle}
                        placeholder="Search Performed by"
                        value={searchString}
                        onChangeText={(val) => {
                            setSearchString(val);
                        }}
                    />
                    <BottomSheetFlatList
                        data={searchString.length > 0 ? filteredData : data}
                        style={{ marginBottom: hp("2%") }}
                        renderItem={({
                            item,
                            index,
                        }: {
                            item: UserType;
                            index: number;
                        }) => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        //console.log('pressed', item.userName)
                                        applyFilter(item)
                                    }}
                                    style={BottomSheetStyle.rowItemStyle}
                                >
                                    <Text style={BottomSheetStyle.itemTextStyle}>
                                        {item.userName}
                                    </Text>
                                </Pressable>
                            );
                        }}
                    />
                </View>
            </BottomSheetModal>
        );
    }
);

export default SelectionBottomSheet;
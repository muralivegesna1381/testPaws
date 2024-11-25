import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import HeaderComponent from "../../components/headerDashboardComponent";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import LoadingModal from "../../components/loadingModel";
import { ScrollView } from "react-native-gesture-handler";
import DashboardStyles from "../../styles/dashboard.style";
import { fetch } from "@react-native-community/netinfo";
import { RootState } from "../../redux/store";


type DashboardListViewScreenProps = NativeStackScreenProps<
    HomeStackParamList,
    "DashboardListView"
>;
const DashboardListView = ({
    route,
    navigation,
}: DashboardListViewScreenProps) => {
    const dispatch = useDispatch();
    const [expandIconClicked, set_expandIconClicked] = useState(false);
    const [pendingEnabled, set_PendingEnabled] = useState(true);

    const [loading, setLoading] = useState(false);
    const [data, set_data] = useState([]);
    const [notificationCount, set_notificationCount] = useState<number>(0);
    const [notificationReadCount, set_notificationReadCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const monitorData = useSelector((state: RootState) => state.monitorCount);
    let notificationsAvailable = notificationCount > 0 ? notificationReadCount !== notificationCount : false;

    function onRefresh(): void {
        console.log("REFRESHED")
    }

    useEffect(() => {
        console.log("MONITOR DATATA")
    }, []);

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

        </SafeAreaView>
    );
};

export default DashboardListView;

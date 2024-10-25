import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
    Platform,
    Pressable,
    Alert

} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimalStackParamList } from "../../navigation/types";
import LinearGradient from 'react-native-linear-gradient';
import AppHeaderComponent from '../../components/appHeaderComponent';
import BottomButtonComponent from '../../components/button.component';
import NetworkManager from '../../network/network.manager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setDVC } from '../../redux/slices/dvc.slicer';
import { DVCResponse } from '../../model/dvc_model';
import LoadingModal from '../../components/loadingModel';
import CommonStyles from '../../styles/commonstyles';
import fonts, { fontFamily } from '../../fonts/fonts';
import Colors from '../../styles/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommonHeaderComponent from '../../components/header.component';
import HelpIcon from './../../../assets/svgs/help_icon.svg';
import { fetch } from "@react-native-community/netinfo";
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";


type AnimalScreenProps = NativeStackScreenProps<
    AnimalStackParamList,
    "UpdateDVC"
>;

const AnimalUpdateDvcScreen = (props: AnimalScreenProps) => {

    const globalState = useSelector((state: RootState) => state.dvcData);
    const dispatch = useDispatch();
    const { navigation } = props;
    const { route } = props;
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [isLoading, set_isLoading] = useState(false);
    const insets = useSafeAreaInsets();


    useEffect(() => {
        firebaseHelper.reportScreen(firebaseHelper.Screen_Update_DVC);

        let temp: DVCResponse[] = globalState?.dvc;
        setSelectedItem(props.route.params.dvcValue);
        if (temp?.length === undefined) {
            fetch().then(state => {
                if (state?.isInternetReachable)
                    getDVCdata();
                else {
                    Alert.alert(
                        "Alert",
                        "Your connectivity to the PAWS backend is lost. Your data is saved locally and will be uploaded once online",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    // console.log("OK Pressed");
                                    navigation.pop()
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                }
            });

        }


    }, []);
    async function getDVCdata() {
        try {
            set_isLoading(true)
            let dvcResponse = await NetworkManager.getDVCList();
            if (dvcResponse?.status?.httpStatus === 200) {
                dispatch(setDVC(dvcResponse?.response));
            }
        } catch (e) {
            console.error(e)
        } finally {
            set_isLoading(false)
        }


    }

    function BottomButtonsUI() {
        return <View style={{
            width: '100%',
            height: hp('12%'),
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0, //Here 
        }}>
            <View style={{ flexDirection: 'row', alignSelf: 'center', height: hp('10%'), marginBottom: 5, alignContent: 'center' }}>
                <View style={{ width: wp('40%'), alignSelf: 'center', marginRight: 5 }}>
                    <BottomButtonComponent style={{ width: 100 }} title={"Cancel"} buttonClick={function (): void {
                        navigation.pop()

                    }} buttonType={"cancel"} ></BottomButtonComponent>

                </View>
                <View style={{ width: wp('40%'), alignSelf: 'center', marginLeft: 5 }}>
                    <BottomButtonComponent style={{ width: 100 }} title={"Submit"} buttonClick={() => {
                        //route?.params?.onReturn(selectedItem);
                        firebaseHelper.logEvent(firebaseHelper.Event_SelectDVC, firebaseHelper.Screen_Update_DVC, "");

                        route?.params.onReturn(selectedItem);
                        navigation.goBack();
                    }} buttonType={"submit"} ></BottomButtonComponent>

                </View>
            </View>

        </View >
    }

    function rightButtonAction() {
        firebaseHelper.logEvent(firebaseHelper.Event_DVC_Help, firebaseHelper.Screen_Update_DVC, "");
        navigation.navigate("DVCHelp");
    }
    function HeaderUI() {
        return <CommonHeaderComponent navigation={undefined} route={undefined} moduleName={"undefined"}
            headerTitle='Update DVC'
            isShowBackButton={true}
            backBtnAction={() => { navigation.pop() }}
            isShowRightButton={true}
            rightButtonAction={rightButtonAction}
            rightButtonImage={
                <View style={{ flexDirection: 'row', paddingRight: 10 }}>
                    <Text style={{
                        paddingRight: 4,
                        fontSize: 14,
                        ...CommonStyles.textStyleBold,
                        textAlign: "center",
                        fontWeight: '500',
                    }}> Help</Text>

                    <HelpIcon />

                </View>}

        ></CommonHeaderComponent>
    }

    const GridItem = (item: DVCResponse) => {
        return (
            <View style={{ width: hp('14%') }}>
                <Pressable
                    onPress={() => {
                        firebaseHelper.logEvent(firebaseHelper.Event_Select_DVC, firebaseHelper.Screen_Update_DVC, "");

                        if (selectedItem == item.code) {
                            setSelectedItem("");
                        } else {
                            setSelectedItem(item.code);
                        }
                    }}
                    style={[styles.gridItem, { backgroundColor: selectedItem == item.code ? '#FFB287' : '"rgba(173, 217, 226, 1)"', borderColor: selectedItem == item.code ? '#398FC5' : "rgba(125, 185, 208, 1)", }]}>
                    {<Text style={styles.dvcText} > {item.code}</Text>
                    }

                </Pressable>
            </View>

        )
    }
    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
            {/* <CommonHeaderComponent navigation={undefined} route={undefined} moduleName={"undefined"}
                headerTitle='Fecal'
                isShowBackButton={true}
                backBtnAction={backBtnAction}
            ></CommonHeaderComponent> */}

            <HeaderUI />
            <View style={{
                margin: 10, flex: 1,

            }}>

                <LinearGradient colors={['#B4F0FC', '#F0F9E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 14 }} >
                    <View style={{ alignItems: 'center', padding: 5 }}>
                        <FlatList
                            data={globalState?.dvc}
                            renderItem={({ item }) => GridItem(item)}
                            numColumns={3}
                            columnWrapperStyle={styles.row}
                        />
                    </View>
                </LinearGradient>
            </View>
            <LoadingModal visible={isLoading} text="Loading..." />

            <BottomButtonsUI />

        </View >
    );
};


//Styles used in this screen are defined here
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    square: {
        width: wp('25%'),
        height: wp('25%'),
        backgroundColor: '#136DA54D',
        borderRadius: 10,
        margin: wp('2.5%'),
        alignItems: 'center'

    },
    textStyling: {
        fontSize: 20,
        fontStyle: 'italic',
        color: 'black'
    },
    dvcText: {
        fontSize: fonts.fontMedium,
        fontFamily: fontFamily.regular,
        color: Colors.BLACK,
    },
    innerContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center'

    },
    button: {
        flex: 1
    },
    gridItem: {
        flex: 1,
        margin: 5,
        height: 100,
        backgroundColor: "rgba(173, 217, 226, 1)",
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "rgba(125, 185, 208, 1)",
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    },
    row: {
        //flex: 1,
        // justifyContent: 'space-around',
    },

});

export default AnimalUpdateDvcScreen;
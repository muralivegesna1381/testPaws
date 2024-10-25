import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
    Platform,
    Pressable

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
import * as firebaseHelper from "../../utilities/firebase/firebaseHelper";

type AnimalScreenProps = NativeStackScreenProps<
    AnimalStackParamList,
    "DVCHelp"
>;

const AnimalDvcHelpScreen = (props: AnimalScreenProps) => {

    const globalState = useSelector((state: RootState) => state.dvcData);
    const dispatch = useDispatch();
    const { navigation } = props;
    const [isLoading, set_isLoading] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        firebaseHelper.reportScreen(firebaseHelper.Screen_DVC_Help);

        let temp: DVCResponse[] = globalState?.dvc;

        if (temp?.length === undefined)
            getDVCdata();


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


    function HeaderUI() {
        return <CommonHeaderComponent navigation={undefined} route={undefined} moduleName={"undefined"}
            headerTitle='Help'
            isShowBackButton={true}
            backBtnAction={() => { navigation.pop() }}
            isShowRightButton={false}
            rightButtonAction={null}
            rightButtonImage={null}

        ></CommonHeaderComponent>
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
                        borderBottomColor: 'black',
                        flex: 1,
                        paddingTop: 10,
                        height: 0.5,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </View>
        );
    };
    const ListItem = (itemVal: DVCResponse) => {

        return <View style={{
        }}>
            <View style={styles.listItemBgStyle}>
                <Text style={[styles.listItemStyle, { flex: 1 }]}>{itemVal.code}</Text>
                <Text numberOfLines={10} style={[styles.listItemStyle, { flex: 1 }]}>{itemVal.codeDesc}</Text>
            </View>
            {divider()}
        </View>

    }
    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top }]}>

            <HeaderUI />
            <View style={{
                flex: 1,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 10
            }}>
                <LinearGradient colors={['#B4F0FC', '#F0F9E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 14, flex: 1 }} >



                    <View style={styles.listItemBgStyle}>
                        <Text style={[styles.listHeading, { flex: 1 }]}>Data Validity Code</Text>
                        <Text numberOfLines={3} style={[styles.listHeading, { flex: 1 }]}>Description</Text>
                    </View>
                    {divider()}
                    {/* <View style={{ flex: 1 }}> */}

                    <FlatList
                        data={globalState?.dvc}
                        renderItem={({ item }) => ListItem(item)}
                        keyExtractor={(item) => item.code.toString()}
                    />
                </LinearGradient >

            </View>

            <LoadingModal visible={isLoading} text="Loading..." />



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


    listHeading: {
        fontSize: fonts.fontMedium,
        ...CommonStyles.textStyleSemiBold,
        marginRight: 10,
        marginLeft: 5,

    },
    listItemStyle: {
        fontSize: fonts.fontMedium,
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
    },

});

export default AnimalDvcHelpScreen;
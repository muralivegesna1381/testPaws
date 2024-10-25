import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    Image,
    FlatList,
    SectionList,
    TouchableWithoutFeedback,
    Pressable
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AnimalStackParamList } from "../../navigation/types";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Checkbox } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import DownArrow from './../../../assets/svgs/down_arrow.svg'
import ACTLocationIcon from "./../../../assets/svgs/location_icon_ACT.svg";
import DogImage from "./../../../assets/svgs/animals_image.svg";
import RightBackButton from "./../../../assets/svgs/arrow_right_back.svg";
import DropDownButton from "./../../../assets/svgs/down_arrow.svg";
import SelectionBox from "./../../../assets/svgs/Selection_box.svg";
import MenuBox from "./../../../assets/svgs/menu.svg";
import CommonHeaderComponent from '../../components/header.component';
import CommonStyles from '../../styles/commonstyles';


type AnimalScreenProps = NativeStackScreenProps<
    AnimalStackParamList,
    "Tasks"
>;

const AnimalTasksScreen = (props: AnimalScreenProps) => {

    const { navigation } = props;

    const TouchableWithoutFeedbackExample = () => {
        const [count, setCount] = useState(0);

        const onPress = () => {
            setCount(count + 1);
        };
    }
    const [checked, setChecked] = React.useState(false);
    const [selectedAnimals, setSelectedAnimals] = useState('Annie - 10CM3');
    const [isClicked, setIsClicked] = useState(false);
    const animals = ["Annie123 - 10CM3", "Annie - 10CM3", "Cooper - 16-O07", "Trinity - 12-115", "Luna - 11-250", "Luna - 11-250",
    ];

    const backBtnAction = () => {
        // navigation.pop();
    }

    function LocationNameUI() {
        return (
            <View style={styles.locationNameBgStyle}>
                <LinearGradient colors={['#FFEEDD', '#F9D1AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                    <View style={styles.locationName}>
                        <ACTLocationIcon />
                        <Text style={{
                            flex: 1,
                            margin: 5,
                            color: '#1E1E1E',
                            fontSize: 22,
                            ...CommonStyles.textStyleBold,
                        }}>A3-03</Text>
                        {/*  <View style={styles.SearchImage}>
                             <SearchIcon />
                        </View>*/}
                    </View>
                </LinearGradient>
            </View>
        );
    }

    function AnimalNameUI() {
        return (
            <FlatList
                data={animals}
                renderItem={({ item, index }) => (
                    animalRowItem(item)
                )
                }
            />
        )
    }

    function animalRowItem(item: string) {
        return <View style={styles.ListItemStyle}>
            <LinearGradient colors={['#B4F0FC', '#F0F9E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 20 }}>
                <TouchableOpacity testID="renderItem" onPress={() => {
                    navigation.navigate('Activities');
                }}>
                    <View style={{ padding: 10 }} >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <TouchableOpacity
                                    style={styles.dropdownSelector}
                                    onPress={() => {
                                        setIsClicked(!isClicked);
                                    }}>
                                    <DogImage />
                                    <Text style={{ fontSize: 18 }}>{item}</Text>
                                    <View>
                                        <Checkbox
                                            status={checked ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked(!checked);
                                            }}
                                        />
                                    </View>

                                    {isClicked ? (
                                        <DropDownButton width={20} height={20} />
                                    ) : (
                                        <RightBackButton width={20} height={20} />
                                    )}
                                </TouchableOpacity>

                                {isClicked ? <View style={styles.DropdownArea}>
                                    <Text style={{ margin: 10 }}>FSCR1:</Text>
                                    <TextInput placeholder='Comments' style={styles.CommentsInput}></TextInput>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('UpdateDVC');
                                    }}>
                                        <Text>jhghjghj</Text>
                                    </TouchableOpacity>

                                </View> : null}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </View>;
    }

    return (
        <View style={styles.mainContainer}>
            <CommonHeaderComponent navigation={undefined} route={undefined} moduleName={"undefined"}
                headerTitle='Fecal Score'
                isShowBackButton={true}
                backBtnAction={backBtnAction}
            ></CommonHeaderComponent>
            <LocationNameUI></LocationNameUI>
            <AnimalNameUI></AnimalNameUI>
        </View >
    );
};

type SerachUIProps = {
    placeHolder: string;
    changeSearchText: (text: string) => void;
    searchText: string;
}

///Search UI
{/*const SearchUI: React.FC<SerachUIProps> = (props) => {
    return (
        <View style={styles.searchTextStyle}>
            <View style={styles.SearchUI}>
                <TextInput
                    style={styles.searchContainerStyle}
                    onChangeText={(text) => {
                        props.changeSearchText(text)
                    }}
                    value={props.searchText}
                    placeholder={props.placeHolder}
                />
            </View>
            <View style={styles.SearchImage}>
                <SearchIcon />
            </View>
        </View>
    );
}*/}


//Styles used in this screen are defined here
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 18,
    },
    dropdownSelector: {
        height: 44,
        width: 353,
        borderColor: '#B4CFDA',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
    FecalScore1: {
        height: 44,
        width: 353,
        borderColor: '#B4CFDA',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        alignSelf: 'center',
        justifyContent: 'space-between',
        borderRadius: 0.5,
    },
    countContainer: {
        alignItems: 'center',
        padding: 10,
    },
    button: {
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#136DA533',
        marginTop: 5,
        height: 35,
        width: 323,
    },
    countText: {
        color: '#ED0505',
        fontSize: 24,
    },

    locationNameBgStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderColor: '#242E4226',
        borderWidth: 1,
    },
    locationName: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        margin: 10,
    },
    ListItemStyle: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        marginTop: 5,
        flex: 1,
    },
    DropdownArea: {
        height: 370,
        width: 353,
        borderRadius: 10,
        borderColor: '#B4CFDA',
        elevation: 5,
        alignSelf: 'center',
        borderTopWidth: 2,
    },
    CommentsInput: {
        height: 35,
        width: 323,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#FFFFFF',
        alignSelf: 'center',
        margin: 10,
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: '#FFFFFF',
        paddingLeft: 10,
    },

});

export default AnimalTasksScreen;
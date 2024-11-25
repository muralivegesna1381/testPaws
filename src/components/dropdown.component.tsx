import React from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import RightArrow from "../../assets/svgs/arrow_right_back.svg";
import DownArrow from "../../assets/svgs/down_arrow.svg";
import CheckboxEmpty from "../../assets/svgs/checkbox_empty.svg";
import CheckboxSelected from "../../assets/svgs/checkbox_selected.svg";
import Colors from '../styles/color';
import CommonStyles from '../styles/commonstyles';

export type SpeciesType = {
    speciesId: number;
    speciesName: string;
    type?: 'species';
}

// export type RoomType = {
//     facilityLocationId: number;
//     room: string;
//     type?: 'room';
//     isSelected? : boolean;
// }

export class Temp {
    type: string = "room";
    isSelected: boolean = false;
}
export class RoomType extends Temp {

    facilityLocationId?: number;
    room?: string;
    type: string = "room";
    isSelected: boolean = false;
    buildingCode?: string;

}

type DropDownItemType = SpeciesType | RoomType

type NormalDropDownType = {
    title: string;
    data: SpeciesType[];
    allSelectedData: SpeciesType[];
    allFilterdData: RoomType[];

    isOpened: boolean
    isAllRoomsSelected: boolean
    dropDownType: 'normal';
    selectedIndex: number | undefined;
    onButtonCallback: () => void;
    onSelectionCallback: (index: number) => void;
    onSelectionAllCallback: () => void;
    type: 'species';
}

type CheckboxDropDownType = {
    title: string;
    data: RoomType[];
    allSelectedData: RoomType[];
    allFilterdData: RoomType[];
    isOpened: boolean
    isAllRoomsSelected: boolean
    dropDownType: 'checkbox';
    onButtonCallback: () => void;
    onSelectionCallback: (index: number) => void;
    onSelectionAllCallback: () => void;
    type?: 'room';
}

type DropDownType = NormalDropDownType | CheckboxDropDownType;

const DropDownComponent = ({ data, allSelectedData, allFilterdData, isOpened, title, dropDownType, isAllRoomsSelected, onButtonCallback, onSelectionCallback, onSelectionAllCallback, ...props }: DropDownType) => {
    const _renderItem = (item: DropDownItemType, index: number) => {
        var isSelected = false;
        if (item.type === 'room') {
            let list = allSelectedData?.filter((itemChild) => itemChild?.facilityLocationId === item.facilityLocationId);
            if (list.length > 0) {
                isSelected = true;
            }
        }
        let val = ''
        let selectedIndex: number = 0
        if (props.type === 'species') {
            selectedIndex = props.selectedIndex ?? -1
        }
        if (item.type == 'species') {
            val = item?.speciesName

        } else if (item.type == 'room') {
            val = item?.room
        }


        return (
            <Pressable onPress={() => {
                // if(dropDownType === 'normal' && item.isSelected === true) {
                //     return;
                // }
                onSelectionCallback(index)
            }}
                style={({ pressed }) => [{
                    minHeight: hp('4%'),
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: hp('1%'),
                    paddingLeft: wp('5%'),
                    paddingRight: wp('5%'),
                    backgroundColor: (item.type !== 'room' && selectedIndex === index) ? '#FFB186' : pressed ? Colors.LIGHT_GRAY : 'transparent'
                }]}>
                {item.type === 'room' ?
                    isSelected ? <CheckboxSelected /> : <CheckboxEmpty />
                    : null}
                <Text style={[CommonStyles.textStyleRegular, {
                    paddingLeft: item.type === 'room' ? wp('2%') : wp('1%'), fontWeight: "400", fontSize: 18
                }]}>{val}</Text>
            </Pressable>
        )
    }

    return (
        <View style={{
            backgroundColor: 'white',
            borderColor: '#C8CDD6',
            borderWidth: 1,
            maxHeight: hp('35%'),
            borderRadius: 10,
        }}>

            <Pressable style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: hp('7%'),
                paddingLeft: wp('5%'),
                paddingRight: wp('5%'),
            }} onPress={onButtonCallback}>
                <Text style={[CommonStyles.textStyleRegular, { flex: 1, fontWeight: "400", fontSize: 20 }]}>{title}</Text>
                {isOpened ? <DownArrow /> : <RightArrow />}
            </Pressable>
            {isOpened ? <View style={{ paddingBottom: hp('1.5%') }}>
                {props.type === 'room' && allFilterdData.length > 0 ? <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end', marginRight: 10, }}>
                        <Pressable
                            onPress={() => {
                                onSelectionAllCallback()
                            }}>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                {isAllRoomsSelected ? <CheckboxSelected /> : <CheckboxEmpty />}
                                <Text style={[
                                    CommonStyles.textStyleRegular,
                                    { color: "#2F3148", fontSize: 14, marginLeft: 5 },
                                ]}  >
                                    {!isAllRoomsSelected ? 'Select All' : 'Unselect All'}
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                </View> : null}
                {/* <View style={{ height: 0.5, marginBottom: hp('2%'), backgroundColor: '#C8CDD6', }} /> */}

                <FlatList
                    style={{ paddingBottom: 10, maxHeight: hp('20%') }}

                    data={data}
                    renderItem={({ item, index }: { item: DropDownItemType, index: number }) => _renderItem(item, index)} />
            </View> : null}

        </View>
    )

}

export default DropDownComponent;
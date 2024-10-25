import React from "react";
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import Colors from "../styles/color";
import CloseIcon from "./../../assets/svgs/X.svg"

type ChipsProps = {
    textLable: string;
    textLableStyle?: StyleProp<TextStyle>
    onClose: () => void;
    isEnableClose: boolean;
    backgroundColor: string;
    style?: StyleProp<ViewStyle>
    numberOfLinesLable?: number
};
const CustomChip: React.FC<ChipsProps> = (props) => {
    return (<View style={{ flex: 1 }}>
        <View
            style={[props.style, {
                paddingVertical: 0,
                paddingHorizontal: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: props.backgroundColor ?? Colors.LIGHT_GRAY,
                margin: 5,
                minHeight: 30,
                borderRadius: 8,
            }]}
        >
            <Text
                numberOfLines={props.numberOfLinesLable ? props.numberOfLinesLable : 1}
                style={[props.textLableStyle, {

                    marginRight: 5,

                }]}
            >
                {props.textLable}
            </Text>
            {props.isEnableClose && <Pressable
                hitSlop={{ top: 25, bottom: 25, left: 15, right: 15 }}
                onPress={() => {
                    props.onClose();
                }}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? "rgb(210, 230, 255)" : "transparent",
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
            </Pressable>}
        </View>
    </View>)
};
export default CustomChip;

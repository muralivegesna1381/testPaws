import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageRequireSource,
    PressableProps,
    Pressable,
    Image,
} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";
import CommonStyles from "../styles/commonstyles";
import ButtonStyle from "../styles/button.style";
import LinearGradient from "react-native-linear-gradient";


type CustomBottomButtonProps = {
    isEnable: boolean;
    title: string;
    buttonClick: () => void;
    textColor: string;
    borderColor: string;
    gradientColors: string[];
} & PressableProps;


const CustomBottomButtonComponent = ({
    isEnable,
    title,
    buttonClick,
    textColor,
    borderColor,
    gradientColors,
    ...rest
}: CustomBottomButtonProps) => {
    const gradientColor = gradientColors;
    return (
        <TouchableOpacity
            onPress={() => {
                if (isEnable)
                    buttonClick();
            }}
        >
            <LinearGradient
                colors={gradientColor}
                style={[ButtonStyle.container, { borderColor: borderColor }]}
            >
                <View style={[ButtonStyle.subContainerStyle]}>
                    <Text style={[CommonStyles.buttonSubTextStyle, { color: textColor }]}>
                        {title}
                    </Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default CustomBottomButtonComponent;

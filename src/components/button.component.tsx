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

type ButtonType = "login" | "cancel" | "submit" | "load" | "loadbowl";

type BottomButtonProps = {
  title: string;
  buttonClick: () => void;
  buttonType: ButtonType;
  leftImageSource?: ImageRequireSource;
  rightImageSource?: ImageRequireSource;
} & PressableProps;

type ButtonGradientType = {
  [key in ButtonType]: string[];
};

const ButtonGradient: ButtonGradientType = {
  login: ["rgba(201, 214, 202, 1)", "rgba(192, 219, 215, 1)"],
  cancel: ["rgba(147, 160, 176, 0.6)", "rgba(92, 112, 140, 0.6)"],
  submit: ["rgba(255, 111, 12, 0.2)", "rgba(255, 111, 12, 0.2)"],
  load: ["rgba(19, 109, 165, 1)", "rgba(19, 109, 165, 1)"],
  loadbowl: ["rgba(19, 109, 165, 1)", "rgba(19, 109, 165, 1)"],
};

type ButtonBorderType = {
  [key in ButtonType]: string;
};

const BorderColor: ButtonBorderType = {
  login: "#FF6F0C",
  cancel: "#93A0B0",
  submit: "#FF6F0C",
  load: "#136DA5",
  loadbowl: "#136DA5",
};

const TextColor: ButtonBorderType = {
  login: "black",
  cancel: "black",
  submit: "black",
  load: "black",
  loadbowl: "white",
};

const BottomButtonComponent = ({
  title,
  buttonClick,
  leftImageSource,
  rightImageSource,
  buttonType,
  ...rest
}: BottomButtonProps) => {
  const gradientColor = ButtonGradient[buttonType];
  const borderColor = BorderColor[buttonType];
  const textColor = TextColor[buttonType];

  return (
    <Pressable
      onPress={() => {
        buttonClick();
      }}
    >
      <LinearGradient
        colors={gradientColor}
        style={[ButtonStyle.container, { borderColor: borderColor }]}
      >
        <View style={[ButtonStyle.subContainerStyle]}>
          {/* {leftImageSource ? <Image style={[ ButtonStyle.imageStyle,{
                    width: wp("12%"),
                    height: wp("12%")
                }]} source={leftImageSource}/> : null} */}

          <Text style={[CommonStyles.buttonSubTextStyle, { color: textColor }]}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default BottomButtonComponent;

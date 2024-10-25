import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Image,
  ImageRequireSource,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BottomButtonComponent from "./button.component";
import fonts, { fontFamily } from "../fonts/fonts";
import ModelStyle from "../styles/modal.style";

type ModalProps = {
  isModalVisible: boolean;
  title: string;
  subTitle?: string;
  imageSource: ImageRequireSource;
  description: string;
  subDescription?: string;
  buttonText: string;
  buttonCallback: () => void;
  buttonTwoText?: string;
  buttonTwoCallback?: () => void;
  isTransparentBGRequired?: boolean;
};

const ModalComponent = (props: ModalProps) => {
  const {
    isModalVisible = false,
    title,
    subTitle,
    description,
    subDescription,
    imageSource,
    buttonText,
    buttonCallback,
    buttonTwoText,
    buttonTwoCallback,
    isTransparentBGRequired = true,
  } = props;

  // console.log("props : ", props);

  return (
    <View style={ModelStyle.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          // setModalVisible(!modalVisible);
        }}
      >
        {isTransparentBGRequired ? (
          <View
            style={{
              position: "absolute",
              width: wp("100%"),
              height: hp("100%"),
              backgroundColor: "#D9D9D9E5",
              opacity: 0.9,
            }}
          />
        ) : null}
        <View style={[ModelStyle.centeredView]}>
          <View style={ModelStyle.modalView}>
            <Text style={ModelStyle.titleTextStyle}>{title}</Text>
            {subTitle ? (
              <Text style={ModelStyle.subTitleTextStyle}>{subTitle}</Text>
            ) : null}
            <Image
              style={[
                {
                  width: wp("12%"),
                  height: wp("12%"),
                  resizeMode: "contain",
                },
              ]}
              source={imageSource}
            />

            <Text style={ModelStyle.titleTextStyle}>{description}</Text>
            {subDescription ? (
              <Text style={ModelStyle.subTitleTextStyle}>{subDescription}</Text>
            ) : null}
            <View style={{ width: wp("65%"), flexDirection: "row" }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <BottomButtonComponent
                  title={buttonText}
                  buttonClick={buttonCallback}
                  buttonType="cancel"
                />
              </View>

              {buttonTwoText && buttonTwoCallback ? (
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <BottomButtonComponent
                    title={buttonTwoText}
                    buttonClick={buttonTwoCallback}
                    buttonType="submit"
                  />
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalComponent;

import React from 'react'
import {TextInput, TextInputProps, Text, StyleSheet, View} from 'react-native'
import InputTextStyle from '../styles/input.text.style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts from "../fonts/fonts";

export type InputProps = {
  value: string;
  placeHolder: string;
  onChangeText: (value: string) => void;
} & TextInputProps

const InputText = ({ value, placeHolder, onChangeText, ...rest }: InputProps) => {

  const { editable } = rest
    return (
      <View style={[InputTextStyle.textInputContainerStyle]}>
        <TextInput
              style={InputTextStyle.textInputStyle}
              underlineColorAndroid="transparent"
              placeholder={placeHolder}
              placeholderTextColor="#000"
              
              autoCapitalize="none"
              value={value}
              onChangeText={(val) => { onChangeText(val) }}
              {...rest}
            />
            </View>
    )
};

export default InputText

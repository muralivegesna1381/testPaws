import React, { useState, useEffect } from 'react';
import { StyleSheet, View, } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import fonts from '../fonts/fonts'
import CommonStyles from '../commonstyles/commonstyles';
import { TextInput } from 'react-native-paper';

const TextInputComponent = ({ navigation, route, inputText, labelText, setValue, isEditable, maxLengthVal, keyboardType, autoCapitalize, widthValue, isSecure, isBackground, ...props }) => {

    const [widthTextInput, set_widthTextInput] = useState(wp('80%'));
    const [isSecureText, set_isSecureText] = useState(undefined);
    const [backgroundColor, set_backgroundColor] = useState('transparent');
    const [autoCapitalizeValue, set_autoCapitalizeValue] = useState("none");
    useEffect(() => {
        if (widthValue) {
            set_widthTextInput(widthValue)
        }

        set_isSecureText(isSecure);
        set_backgroundColor(isBackground);
        set_autoCapitalizeValue(autoCapitalize);

    }, [widthValue, isSecure, isBackground, autoCapitalize]);

    return (
        <View style={[styles.textInputContainerStyle, { width: widthTextInput }]} >

            <TextInput
                label={labelText}
                value={inputText}
                editable={isEditable}
                maxLength={maxLengthVal}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalizeValue}
                backgroundColor={isBackground}
                onChangeText={async (text) => {
                    var trimmedStr = text.trimStart();
                    setValue(trimmedStr);
                }}
                // mode="outlined"
                secureTextEntry={isSecureText}
                underlineColor={'transparent'}
                style={styles.textInputStyle}
                activeUnderlineColor={'#7F7F81'}
                // selectionColor={'transparent'} 
                theme={{
                    colors: {
                        label: 'grey',
                        background: 'transparent',
                        // text: 'green',
                        primary: 'transparent',
                        // placeholder: 'green'
                    },
                }}
            />
        </View>
    );
};

export default TextInputComponent;

const styles = StyleSheet.create({

    textInputStyle: {
        ...CommonStyles.textStyleRegular,
        fontSize: fonts.fontMedium,
        color: 'grey',
        flex: 1,
        height: hp('8%'),
        backgroundColor: 'transparent',
    },
    textInputContainerStyle: {
        flexDirection: 'row',
        width: wp('80%'),
        height: hp('8%'),
        borderRadius: wp('1%'),
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
/* eslint-disable react-native/no-inline-styles */
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text } from 'react-native';
import { Title } from 'react-native-paper';

type CustomHeaderProps = NativeStackHeaderProps;

type HeaderProps = {
  title: string;
  navigation: any;
  routeName: string;
}

const Header = (props: HeaderProps) => {
  const { navigation, routeName } = props;
 // console.log('props : ', JSON.stringify(props));

  return (
    <View
      style={{
        minHeight: '10%',
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        onPress={() => {
          navigation.goBack();
        }}>
        {props.title}
      </Text>
    </View>
  );
};

export default Header;

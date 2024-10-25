import React from 'react';
import {View, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/types';

type DetailsScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'DetailsScreen'
>;

const DetailsScreen = ({route}: DetailsScreenProps) => {
  return (
    <View style={{backgroundColor: 'green', flex: 1}}>
      <Text>{route?.params?.info}</Text>
    </View>
  );
};

export default DetailsScreen;

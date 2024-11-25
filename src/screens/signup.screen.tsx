import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type SignupScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'SignUpScreen'
>;

const SignupScreen = (props: SignupScreenProps) => {
  const { navigation } = props;
  const route = useRoute();
  return (
    <View>
      <Text
        onPress={() => {
          navigation.setOptions({ title: 'Updated!' });
        }}>
        Sign up Screen
      </Text>
    </View>
  );
};

export default SignupScreen;

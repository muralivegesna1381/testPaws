import React from 'react';
import LoginScreen from '../screens/login.screen';
import SignUpScreen from '../screens/signup.screen';
import DashboardScreen from '../screens/dashboard.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import NewFeatureScreen from '../screens/newfeatureTest.screen';
import ChangePasswordScreen from '../screens/moreTabs/profile/changePassword';
import ResetPassword from '../screens/reset.password.screen';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Auth = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#FFF',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="NewFeatureScreen" component={NewFeatureScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />

      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
};

export default Auth;

//header: props => <Header {...props} />,

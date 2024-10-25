import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottombarScreen from '../screens/bottombar.screen';
import { BottombarStackParamList } from './types';
import NotificationHome from '../screens/notifications/notification.home';


const Stack = createNativeStackNavigator<BottombarStackParamList>();
const BottomBar = () => {
    return (
        <Stack.Navigator
            initialRouteName="BottomBar"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="BottomBar" component={BottombarScreen} />
            {/* <Stack.Screen name="NotificationHome" component={NotificationHome} /> */}
        </Stack.Navigator>
    );
};

export default BottomBar;

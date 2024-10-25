import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoadBowlStackParamList } from './types';
import LoadBowlHomeScreen from '../screens/loadbowl/load.bowl.home';
import LoadBowlDetailsScreen from '../screens/loadbowl/load.bowl.details';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LoadBowlSessionScreen from '../screens/loadbowl/load.sessions.list';
import LoadBowlSessionDetailScreen from '../screens/loadbowl/load.bowl.session.details';

const Stack = createNativeStackNavigator<LoadBowlStackParamList>();

const LoadBowlStack = () => {
    // React.useLayoutEffect(() => {
    //     const routeName = getFocusedRouteNameFromRoute(route);
    //     if (routeName === "LoadBowlDetailsScreen") {
    //         navigation.setOptions({ tabBarVisible: false });
    //     } else {
    //         navigation.setOptions({ tabBarVisible: true });
    //     }
    // }, [navigation, route]);

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Home" component={LoadBowlHomeScreen} />
            <Stack.Screen name="LoadBowlDetailsScreen" component={LoadBowlDetailsScreen} />
            <Stack.Screen name="LoadBowlSession" component={LoadBowlSessionScreen} />
            <Stack.Screen name="LoadBowlSessionDetails" component={LoadBowlSessionDetailScreen} />



        </Stack.Navigator>
    );
};

export default LoadBowlStack;

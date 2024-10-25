import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnimalStackParamList } from './types';
import AnimalHomeScreen from '../screens/animals/animals.home.screen';
import AnimalActivitiesScreen from '../screens/animals/animals.activities.screen';
import AnimalTasksScreen from '../screens/animals/animals.measurements.screen';
import AnimalTasksOperationsScreen from '../screens/animals/animals.tasks.operations.screen';
import AnimalACTSubmission from '../screens/animals/animals.tasks.submit.screen';
import AnimalUpdateDvcScreen from '../screens/animals/animals.update.dvc'
import AnimalDvcHelpScreen from '../screens/animals/animals.dvc.help';

const Stack = createNativeStackNavigator<AnimalStackParamList>();
const AnimalsStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Home" component={AnimalHomeScreen} />
            <Stack.Screen name="Activities" component={AnimalActivitiesScreen} />
            <Stack.Screen name="Tasks" component={AnimalTasksScreen} />
            <Stack.Screen name="Operations" component={AnimalTasksOperationsScreen} />
            <Stack.Screen name="Submission" component={AnimalACTSubmission} />
            <Stack.Screen name="UpdateDVC" component={AnimalUpdateDvcScreen} />
            <Stack.Screen name="DVCHelp" component={AnimalDvcHelpScreen} />


        </Stack.Navigator>
    );
};

export default AnimalsStack;

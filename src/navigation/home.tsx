import React from "react";
import DetailsScreen from "../screens/details.screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "./types";
import Header from "../components/header";
import DashboardScreen from "../screens/dashboard.screen";
import DashboardListView from "../screens/dashboardListView/dashboardListView";
import NotesScreen from "../screens/notes/notesScreen";
import NotificationHome from "../screens/notifications/notification.home";
import AnimalTasksScreen from "../screens/animals/animals.measurements.screen";
import AnimalTasksOperationsScreen from "../screens/animals/animals.tasks.operations.screen";
import AnimalACTSubmission from "../screens/animals/animals.tasks.submit.screen";
import AnimalUpdateDvcScreen from "../screens/animals/animals.update.dvc";
import AnimalDvcHelpScreen from "../screens/animals/animals.dvc.help";

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Home = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="DashboardListView" component={DashboardListView} />
      <Stack.Screen name="NotesScreen" component={NotesScreen} />
      <Stack.Screen name="NotificationHome" component={NotificationHome} />
      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={{
          header: Header,
        }}
      />
      <Stack.Screen name="Tasks" component={AnimalTasksScreen} />
      <Stack.Screen name="Operations" component={AnimalTasksOperationsScreen} />
      <Stack.Screen name="Submission" component={AnimalACTSubmission} />
      <Stack.Screen name="UpdateDVC" component={AnimalUpdateDvcScreen} />
      <Stack.Screen name="DVCHelp" component={AnimalDvcHelpScreen} />

    </Stack.Navigator>
  );
};

export default Home;

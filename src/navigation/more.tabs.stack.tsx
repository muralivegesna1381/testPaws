import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreTabsStackParamList } from './types';
import LoadBowlHomeScreen from '../screens/loadbowl/load.bowl.home';
import NotesScreen from '../screens/notes/notesScreen';
import MoreTabsScreen from '../screens/moreTabs/more.tabs.home';
import SettingsScreen from '../screens/moreTabs/settings/settingsScreen';
import RoomUserMonitor from '../screens/moreTabs/room.user.screen';
import MyProfileScreen from '../screens/moreTabs/settings/myProfile.screen';
import RoomPreferenceScreen from '../screens/moreTabs/profile/more.myprofile.roomPrefernce';
import ChangePasswordScreen from '../screens/moreTabs/profile/changePassword';
import AuditLogScreen from '../screens/moreTabs/settings/audit.log.screen';

const Stack = createNativeStackNavigator<MoreTabsStackParamList>();
const MoreTabsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MoreTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MoreTabs" component={MoreTabsScreen} />
      <Stack.Screen name="NotesScreen" component={NotesScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name='RoomUserMonitor' component={RoomUserMonitor} />
      <Stack.Screen name='MyProfileScreen' component={MyProfileScreen} />
      <Stack.Screen name='RoomPreference' component={RoomPreferenceScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="AuditLogScreen" component={AuditLogScreen} />


    </Stack.Navigator>
  );
};

export default MoreTabsStack;

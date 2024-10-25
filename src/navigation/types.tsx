import { AnimalResponse } from "../model/schedule_animals";
import { ACT_OPERATIONS, MonitorTypes } from "../utils";

export type NavigationStacks = "Auth" | "BottomBar" | "Home";

export type AuthStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  SignUpScreen: {
    title: string;
  };
  NotesScreen: undefined;
  NewFeatureScreen: undefined;
  ChangePassword: {
    isFromLogin: boolean;
  };
  ResetPassword: undefined;
};

// Dashboard tab item Stack routes
export type HomeStackParamList = {
  Dashboard: undefined;
  DetailsScreen: { title: string; info: string };
  DashboardListView: { selectedMonitorID: MonitorTypes };
  NotesScreen: undefined;
  NotificationHome: undefined;
  Tasks: {
    actId: number;
    type: any;
    selectedTypeId: any;
    locationValue: any;
    actName: string;
    animalName: string;
    selectedAnimalsList: any;
    isRecordGroupAct: boolean;
    actScheduleId: any;
    actScheduleDate: any;
    isFromDashboard: boolean;
    dateFilterFrom: string;
    dateFilterTo: string;
  };
  Operations: {
    actId: number;
    type: number;
    selectedTypeId: string;
    locationValue: string;
    actName: string;
    animalName: string;
    selectedAnimalsList: any;
    isRecordGroupAct: boolean;
    actScheduleId: any;
    actScheduleDate: any;
    isFromDashboard: boolean;
    dateFilterFrom: string;
    dateFilterTo: string;
  };
  Submission: {
    operation: ACT_OPERATIONS;
    selectedAnimals: AnimalResponse[];
    type: number;
    onRquiredRefrs: (val: boolean) => void;
  };
  UpdateDVC: {
    onReturn: (val: string) => void;
  };
  DVCHelp: undefined
};

// BottomBar tab item Stack routes
export type BottombarStackParamList = {
  BottomBar: undefined;
  NotificationHome: undefined;

};

// Animals tab item Stack routes
export type AnimalStackParamList = {
  Home: undefined;
  Activities: {
    type: number;
    selectedItem: any;
    selectedAnimalsList: any;
    recordGroupActivity: boolean;
  };
  Tasks: {
    actId: number;
    type: any;
    selectedTypeId: any;
    locationValue: any;
    actName: string;
    animalName: string;
    selectedAnimalsList: any;
    isRecordGroupAct: boolean;
    actScheduleId: any;
    actScheduleDate: any;
    isFromDashboard: boolean;
    dateFilterFrom: string;
    dateFilterTo: string;
  };
  Operations: {
    actId: number;
    type: number;
    selectedTypeId: string;
    locationValue: string;
    animalName: string;
    selectedAnimalsList: any;
    isRecordGroupAct: boolean;
    actName: string;
    actScheduleId: any;
    actScheduleDate: any;
    isFromDashboard: boolean;
    dateFilterFrom: string;
    dateFilterTo: string;
  };
  Submission: {
    operation: ACT_OPERATIONS;
    selectedAnimals: AnimalResponse[];
    type: number;
    onRquiredRefrs: (val: boolean) => void;
  };
  UpdateDVC: {
    dvcValue: string;
    onReturn: (val: string) => void;
  };
  DVCHelp: undefined
};

// Loadbowl tab item Stack routes
export type LoadBowlStackParamList = {
  Home: undefined;
  LoadBowlDetailsScreen: { selectionType: string };
  LoadBowlSession: undefined;
  LoadBowlSessionDetails: undefined;
};

// More tabs Stack routes
export type MoreTabsStackParamList = {
  Home: undefined;
  NotesScreen: undefined;
  MoreTabs: undefined;
  SettingsScreen: undefined;
  MyProfileScreen: undefined;
  AuditLogScreen: undefined;
  RoomUserMonitor: undefined;
  Login: undefined;
  RoomPreference: undefined;
  ChangePassword: {
    isFromLogin: boolean;
  };
};

//Notification
export type NotificationParamList = {
  Home: undefined;
  // Home: undefined;
};

//Room Preference
export type RoomPreferenceParamList = {
  RoomPreference: undefined;
};

//Change Password
export type ChangePasswordParamList = {
  ChangePassword: {
    isFromLogin: boolean;
  };
};

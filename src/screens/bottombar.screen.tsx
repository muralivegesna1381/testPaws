import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Home from "../navigation/home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottombarStackParamList } from "../navigation/types";
import AnimalsStack from "../navigation/animals.stack";
import LoadBowlStack from "../navigation/load.bowl.stack";
import MoreTabsStack from "../navigation/more.tabs.stack";
import HomeIcon from "../../assets/svgs/bottom_bar_svgs/bottom_bar_home.svg";
import HomeIconSelected from "../../assets/svgs/bottom_bar_svgs/bottom_bar_home_selected.svg";
import FoodIcon from "../../assets/svgs/bottom_bar_svgs/bottom_bar_food.svg";
import FoodIconSelected from "../../assets/svgs/bottom_bar_svgs/bottom_bar_food_selected.svg";
import MenuIcon from "../../assets/svgs/bottom_bar_svgs/bottom_bar_menu.svg";
import MenuIconSelected from "../../assets/svgs/bottom_bar_svgs/bottom_bar_menu_selected.svg";
import PawIcon from "../../assets/svgs/bottom_bar_svgs/bottom_bar_paw.svg";
import PawIconSelected from "../../assets/svgs/bottom_bar_svgs/bottom_bar_paw_selected.svg";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

type TabbarScreenProps = NativeStackScreenProps<
  BottombarStackParamList,
  "BottomBar"
>;

const Tab = createBottomTabNavigator();
const BottombarScreen = ({ navigation }: TabbarScreenProps) => {
  const getTabBarImage = (routeName: string, focused: boolean) => {
    var icon;
    if (routeName === "Animals") {
      icon = focused ? <PawIconSelected /> : <PawIcon />;
    } else if (routeName === "Loadbowls") {
      icon = focused ? <FoodIconSelected /> : <FoodIcon />;
    } else if (routeName === "More") {
      icon = focused ? <MenuIconSelected /> : <MenuIcon />;
    } else {
      icon = focused ? <HomeIconSelected /> : <HomeIcon />;
    }
    return icon;
  };
  const getTabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    const hideOnScreens = [
      "LoadBowlDetailsScreen",
      "ChangePassword",
      "LoadBowlSession",
      "LoadBowlSessionDetails",
      "RoomPreference",
      "Submission",
      "UpdateDVC",
      "Tasks",
      "DVCHelp"
    ]; // put here name of screen where you want to hide tabBar
    return hideOnScreens.indexOf(routeName) <= -1;
  };
  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.container,
        tabBarIconStyle: styles.imageStyle,
        tabBarIcon: ({ focused, color, size }) => {
          var icon = getTabBarImage(route.name, focused);
          return icon;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
        })}
      />
      <Tab.Screen
        name="Animals"
        component={AnimalsStack}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
        })}
      />
      <Tab.Screen
        name="Loadbowls"
        component={LoadBowlStack}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
        })}
      />
      <Tab.Screen
        name="More"
        component={MoreTabsStack}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 150,
    height: 65,
    shadowColor: "red",
    shadowOffset: {
      width: 100,
      height: 100,
    },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: "red",
    position: "absolute",
  },
  imageStyle: {
    marginTop: hp("3%"),
    //marginBottom: 6,
    marginVertical: 7,
    padding: 8,
  },
  cardShadow: {
    borderRadius: 16,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default BottombarScreen;

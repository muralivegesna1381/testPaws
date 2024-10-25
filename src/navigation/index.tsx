/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Auth from './auth';
import Home from './home';
import SafeAreaView from 'react-native-safe-area-view';
import { NavigationStacks } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { Root_State } from '../redux/store';
import { Current_Navigation_Stack } from '../redux/slices/login.slicer';
import BottomBar from './bottombar';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const RootNavigator = () => {
  // const [currentStack] = useState<NavigationStacks>('Home');
  const currentStack = useSelector((state: Root_State) => {
    let stack: Current_Navigation_Stack = state.currentStack;
    return stack.stackName;
  });

  const loadCurrentStack = () => {
    switch (currentStack) {
      case 'Auth':
        return <Auth />;
      case 'BottomBar':
        return <BottomBar />;
    }
  };

  return (
    <NavigationContainer>

      {/* <SafeAreaView style={{ flex: 1, }}
          forceInset={{ top: 'always', bottom: 'never' }}> */}
      {loadCurrentStack()}
      {/* </SafeAreaView> */}

    </NavigationContainer>
  );
};

export default RootNavigator;

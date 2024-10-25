import React, { useEffect } from 'react';
import RootNavigator from './src/navigation';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';
import CustomToast from './src/components/custom.toast.message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import Utils from './src/utils';


function App() {
  useEffect(() => {
    if (Platform.OS == 'ios') {
      enableScreens(false)
    }
    enableFirebaseFeatures()

  }, []);

  async function enableFirebaseFeatures() {
    await firebase.analytics().setAnalyticsCollectionEnabled(true);
    await crashlytics().setCrashlyticsCollectionEnabled(true);
    let userID = await Utils.getData("UserId");
    await crashlytics().setUserId(userID ?? '');
    //await firebase.perf().setPerformanceCollectionEnabled(true);
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <BottomSheetModalProvider>
          <SafeAreaProvider style={{ flex: 1 }}>
            <RootNavigator />
          </SafeAreaProvider>
          <CustomToast />
        </BottomSheetModalProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;

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
import { URL_DEV, URL_QA, URL_BOWL_PROD, URL_BOWL_UAT } from './src/network/api.constants';

export let BASE_URL = "";
export let BASE_URL_LOAD_BOWL = "";
function App() {
  useEffect(() => {
    if (Platform.OS == 'ios') {
      enableScreens(false)
    }
    enableFirebaseFeatures()

    updateURL()
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
export async function updateURL() {
  let isInProduction = await Utils.getData("isProduction") ?? 'Yes';
  //console.log("TEST ", isInProduction);
  if (isInProduction === "Yes") {
    BASE_URL = URL_QA;
    BASE_URL_LOAD_BOWL = URL_BOWL_PROD;

  }
  else {
    BASE_URL = URL_DEV;
    BASE_URL_LOAD_BOWL = URL_BOWL_UAT;
  }
  // console.log("TEST URL changed to", BASE_URL, BASE_URL_LOAD_BOWL)
};
export default App;

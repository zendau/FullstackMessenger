import 'react-native-gesture-handler';
import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {SafeAreaView, StatusBar} from 'react-native';

import {store} from './redux';
import {Provider} from 'react-redux';

import ScreenGateway from './screens/ScreenGateway';


export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#17212B" />
        <NavigationContainer>
          <ScreenGateway />
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}

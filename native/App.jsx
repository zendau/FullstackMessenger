import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import ChatsScreen from './views/Chats';
import ContactsScreen from './views/Contacts';
import ChatScreen from './views/Chat';
import LoginScreen from './views/Login';
import RegisterScreen from './views/Register';
import ForgotScreen from './views/Forgot';

import { SafeAreaView, StatusBar, Text } from 'react-native'

const Drawer = createDrawerNavigator();

const drawerScreenOptions = {
  headerStyle: {
    backgroundColor: '#17212B',
    borderBottomColor: '#000'

  },
  headerTintColor: '#fff',
  sceneContainerStyle: {
    backgroundColor: '#0E1621'
  },
  drawerStyle: {
    backgroundColor: '#242426',
  },
  drawerInactiveTintColor: '#fff',
  drawerActiveTintColor: '#55BFFA',
}

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#17212B" />
      <NavigationContainer>
        <Drawer.Navigator screenOptions={drawerScreenOptions} useLegacyImplementation initialRouteName="Chats">
          <Drawer.Screen name="Chats" component={ChatsScreen} />
          <Drawer.Screen name="Contacts" component={ContactsScreen} />
          <Drawer.Screen name="Chat" options={{
            drawerItemStyle: { display: 'none' }
          }} component={ChatScreen} />
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Register" component={RegisterScreen} />
          <Drawer.Screen name="Forgot password" component={ForgotScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>

  );
}
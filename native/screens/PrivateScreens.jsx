import { AntDesign, Ionicons } from '@expo/vector-icons';

import ChatsScreen from '../views/Chats';
import ContactsScreen from '../views/Contacts';
import ChatScreen from '../views/Chat';

import UserScreen from '../views/User'
import PeopleScreen from '../views/People';
import CreateGroupScreen from '../views/CreateGroup';
import SettingsScreen from '../views/Settings';
import DevicesScreen from '../views/Devices';
import ContactRequestsScreen from '../views/ContactRequests';
import AccountScreen from '../views/Account';

import { Text, View } from 'react-native'

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ flex: 1, justifyContent: 'flex-end', height: '100%' }} >
        <DrawerItemList {...props} />
        <DrawerItem label={() => <Text style={{ color: '#EC3942', fontSize: 15, }}>Exit</Text>} icon={() => <AntDesign name="logout" size={24} color="#EC3942" />} onPress={() => alert('Link to help')} />

      </View>
    </DrawerContentScrollView>
  );
}

function PrivateScreens({ Drawer, drawerScreenOptions }) {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} screenOptions={drawerScreenOptions} useLegacyImplementation initialRouteName="Chats"  >
      <Drawer.Screen name="Chats" component={ChatsScreen} options={{ drawerIcon: ({ color }) => <AntDesign name="wechat" size={24} color={color} /> }} />
      <Drawer.Screen name="Create group" component={CreateGroupScreen} options={{ drawerIcon: ({ color }) => <AntDesign name="addusergroup" size={24} color={color} /> }} />
      <Drawer.Screen name="Contacts" component={ContactsScreen} options={{ drawerIcon: ({ color }) => <AntDesign name="contacts" size={24} color={color} /> }} />
      <Drawer.Screen name="Contact requests " component={ContactRequestsScreen} options={{ drawerIcon: ({ color }) => <AntDesign name="adduser" size={24} color={color} /> }} />
      <Drawer.Screen name="People" component={PeopleScreen} options={{ drawerIcon: ({ color }) => <Ionicons name="people" size={24} color={color} /> }} />
      <Drawer.Screen name="Settings " component={SettingsScreen} options={{ drawerIcon: ({ color }) => <AntDesign name="setting" size={24} color={color} /> }} />

      <Drawer.Screen name="Chat" options={{
        drawerItemStyle: { display: 'none' }
      }} component={ChatScreen} />
      <Drawer.Screen name="User" options={{
        drawerItemStyle: { display: 'none' }
      }} component={UserScreen} />
      <Drawer.Screen name="Devices" options={{
        drawerItemStyle: { display: 'none' }
      }} component={DevicesScreen} />
      <Drawer.Screen name="Account" options={{
        drawerItemStyle: { display: 'none' }
      }} component={AccountScreen} />
    </Drawer.Navigator>
  )
}

export default PrivateScreens
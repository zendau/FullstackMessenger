// import { StatusBar } from 'expo-status-bar';
// import { useState } from 'react';
// import { Button, StyleSheet, Image, Text, View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
// import styled from 'styled-components/native'

// import Logo from './assets/adaptive-icon.png'

// export default function App() {

//   const [counter, setState] = useState(() => 0)

//   const Test = styled.View`
//     justify-content: space-around;
//     align-items: center;
//     flex-direction: row;
//     height: 200px;
//     width: 200px;
//     background: red;
//     border-radius: 15px;
//   `

//   const TestImage = styled.Image`
//     height: 200px;
//     width: 200px;
//     margin: 50px;
//   `

//   return (
//     <ScrollView >
//       <View style={styles.container}>
//         <Text>te</Text>
//         <Test><Text>test</Text><Text>test</Text><Text>test</Text></Test>
//         <TouchableOpacity>
//           <TestImage source={Logo} />
//         </TouchableOpacity>

//         <TestImage source={Logo} />
//         <Text style={styles.title}>Hello 1232{counter}</Text>

//         <Button onPress={() => setState((prev) => prev + 1)} title="inc" />
//         <Button onPress={() => setState((prev) => prev - 1)} title="dec" />


//         <StatusBar style="auto" />
//       </View>
//     </ScrollView>

//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     color: 'red',
//     fontSize: 48,
//     backgroundColor: 'black',
//   },
//   box: {
//     flexDirection: 'column'
//   },
//   item: {
//     height: 40,
//     width: 40,
//   }
// });
import 'react-native-gesture-handler';
import * as React from 'react';
import { Button, View, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'some other title',
      headerLeft: () => (
        <TouchableOpacity  style={{flex: 1, borderRadius: 12}} onPress={() => navigation.goBack()}>
          <Ionicons style={{ top: 18, marginLeft: 15, marginRight: 10, color: 'white', flex: 1 }}  name="arrow-back" size={24} color="black"  />
        </TouchableOpacity>
      ),

    })
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{
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
        drawerActiveTintColor: '#55BFFA'
      }} useLegacyImplementation initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
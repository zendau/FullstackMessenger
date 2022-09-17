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
import { Button, View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native'



const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    height: 70px;
    margin-bottom: 10px;
    border-bottom-color: black;
    border-bottom-width: 2px;
    align-items: center;
  `

function Item({ navigation, id }) {
  return (
    <ItemContainer onPress={() => navigation.navigate('Chat', {id})}>
      <Ionicons name="person" size={48} color="gray" />
      <Text style={{ color: 'white', fontSize: 18, marginLeft: 20, flex: 1 }}>Login of user - {id}</Text>
    </ItemContainer>
  )
}

function HomeScreen({ navigation }) {
  return (
    <ScrollView style={{ padding: 10 }}>
      {[1, 2, 3,4,5,6,7,8,9, 10, 11,12].map((id) => <Item navigation={navigation} key={id} id={id} />)}
    </ScrollView>
  );
}


function ContactsScreen({ navigation }) {
  return (
    <ScrollView style={{ padding: 10 }}>
      {[1, 2, 3,4,5,6,7,8,9, 10, 11,12].map((id) => <Item navigation={navigation} key={id} id={id} />)}
    </ScrollView>
  );
}

function NotificationsScreen({ navigation, route }) {

  const { id } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `User ${id}`,
      headerLeft: () => (
        <TouchableOpacity style={{ flex: 1, borderRadius: 12 }} onPress={() => navigation.goBack()}>
          <Ionicons style={{ top: 18, marginLeft: 15, marginRight: 10, color: 'white', flex: 1 }} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),

    })
  }, [id])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{fontSize: 40, color: 'white'}} >id - {id}</Text>
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
      }} useLegacyImplementation initialRouteName="Chats">
        <Drawer.Screen name="Chats" component={HomeScreen} />
        <Drawer.Screen name="Contacts" component={ContactsScreen} />
        <Drawer.Screen name="Chat" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
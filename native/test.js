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
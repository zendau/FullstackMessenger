import { Text, View, ScrollView, Alert } from "react-native"
import { FontAwesome, FontAwesome5, Entypo, AntDesign } from '@expo/vector-icons';
import UAParser from "ua-parser-js";
import * as Device from 'expo-device';
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import DeviceComponent from "../components/Settings/Device";
import styled from "styled-components";

const TextInfo = styled.Text`
  color: #6AB3F3;
  text-align: center;
`


const TextEmpty = styled.Text`
  color: white;
  font-size: 30px;
  text-align: center;
`

const divecesData = [
  {
    id: 2,
    onlineStatus: '01.10.2022, 21:32',
    ip: '127.0.0.1',
    device: {
      id: 2,
      deviceId: 'SW_S98506AE1_V009_M13_XM_C3C_USR',
      manufaction: 'Xiaomi',
      modelId: 'Redmi 6A',
      osName: 'Android',
      version: '9',
      platform: 'phone'
    },
  },
  [
    {
      id: 1,
      onlineStatus: '01.10.2022, 21:32',
      ip: '127.0.0.1',
      device: {
        id: 1,
        deviceId: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        manufaction: 'Chrome',
        modelId: '105.0.0.0',
        osName: 'Windows',
        version: '10',
        platform: 'web'
      },
    },
    {
      id: 3,
      onlineStatus: '01.10.2022, 21:32',
      ip: '127.0.0.1',
      device: {
        id: 3,
        deviceId: 'SW_S98506AE1_V009_M13_XM_C3C_USR',
        manufaction: 'Apple',
        modelId: 'iPhone XS Max',
        osName: 'iOS',
        version: '12.3.1',
        platform: 'phone'
      }
    }
  ]
]

function DevicesScreen() {


  // const browser = UAParser('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36')
  // console.log(browser)
  // console.log()
  // console.log(Device)



  return (
    <ScrollView nestedScrollEnabled style={{paddingTop: 15}}>
      <View>
        <TextInfo>This device</TextInfo>
        <DeviceComponent id={divecesData[0].id} ip={divecesData[0].ip} onlineStatus={divecesData[0].onlineStatus} deviceData={divecesData[0].device} current={divecesData[0].current} />
      </View>

      <FlatList
        ListHeaderComponent={<TextInfo>Active sessions</TextInfo>}
        style={{ padding: 10 }}
        data={divecesData[1]}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<TextEmpty>No sessions</TextEmpty>}
        renderItem={({ item }) =>
          <DeviceComponent id={item.id} ip={item.ip} onlineStatus={item.onlineStatus} deviceData={item.device} current={item.current} />
        } />
    </ScrollView>

    // <ScrollView>
    //   {/* <View style={{ flexDirection: 'row', alignItems: 'center' }} >
    //     <DeviceIcon style={{ backgroundColor: '#4388B9' }}>
    //       {getBrowserIcon(browser.browser.name)}
    //     </DeviceIcon>
    //     <View>
    //       <Text style={{ color: 'white' }}>{`${browser.browser.name} ${browser.browser.version}`}</Text>
    //       <Text style={{ color: 'white' }}>127.0.0.1</Text>
    //       <Text style={{ color: 'white' }}>1.10.2022 21:13</Text>
    //     </View>
    //     <TouchableOpacity onPress={() => Alert.alert(
    //       "Alert Title",
    //       "My Alert Msg",
    //       [
    //         {
    //           text: "Cancel",
    //           onPress: () => console.log("Cancel Pressed"),
    //           style: "cancel"
    //         },
    //         { text: "OK", onPress: () => console.log("OK Pressed") }
    //       ],
    //       { cancelable: false }
    //     )}>
    //       <AntDesign name="close" size={50} color="black" />
    //     </TouchableOpacity>
    //   </View>
    //   <View style={{ flexDirection: 'row', alignItems: 'center' }} >
    //     <DeviceIcon style={{ backgroundColor: '#63AA55' }}>
    //       <AntDesign name="android1" size={40} color="white" />
    //     </DeviceIcon>

    //     <View>
    //       <Text style={{ color: 'white' }}>{`${Device.manufacturer} ${Device.modelName}`}</Text>
    //       <Text style={{ color: 'white' }}>127.0.0.1</Text>
    //       <Text style={{ color: 'white' }}>1.10.2022 21:13</Text>
    //     </View>
    //   </View>
    //   <View style={{ flexDirection: 'row', alignItems: 'center' }} >
    //     <DeviceIcon style={{ backgroundColor: '#B8477A' }}>
    //       <AntDesign name="apple1" size={40} color="white" />
    //     </DeviceIcon>
    //     <View>
    //       <Text style={{ color: 'white' }}>{`${Device.manufacturer} ${Device.modelName}`}</Text>
    //       <Text style={{ color: 'white' }}>127.0.0.1</Text>
    //       <Text style={{ color: 'white' }}>1.10.2022 21:13</Text>
    //     </View>
    //   </View> */}
    // </ScrollView>
  )

}

export default DevicesScreen
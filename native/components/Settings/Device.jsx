import { Text, TouchableOpacity, Alert, View } from 'react-native'
import styled from "styled-components";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from 'react';

const DeviceIcon = styled.View`
  border-radius: 50;
  height: 55px;
  width: 55px;
  align-items: center;
  justify-content: center;
`

const Container = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px auto;
`

const InfoContainer = styled.View`
  align-items: center;
`


function DeviceComponent({ id, ip, onlineStatus, deviceData, current }) {

  const [deviceColor, setDeviceColor] = useState('black')
  const [deviceIcon, setDeviceIcon] = useState(null)

  const onDeleteSesstionHandler = () => {
    console.log('delete session with id ', id)
  }

  const getDeviceIcon = (deviceName, platform, osName) => {

    const iconSize = 40
    const iconColor = 'white'


    if (platform === 'phone') {

      if (osName === 'Android') {
        setDeviceColor('#63AA55')
        return (
          <AntDesign name="android1" size={iconSize} color={iconColor} />
        )
      }

      if (osName === 'iOS') {
        setDeviceColor('#B8477A')
        return (
          <AntDesign name="apple1" size={iconSize} color={iconColor} />
        )
      }

    } else {
      setDeviceColor('#4388B9')
      switch (deviceName) {
        case 'Edge': return (<FontAwesome name="edge" size={iconSize} color={iconColor} />)
        case 'IE': return (<FontAwesome name="internet-explorer" size={iconSize} color={iconColor} />)
        case 'Chrome':
        case 'Chrome WebView':
        case 'Chromium': return (<FontAwesome name="chrome" size={iconSize} color={iconColor} />)
        case 'Mobile Safari':
        case 'Safari': return (<FontAwesome name="safari" size={iconSize} color={iconColor} />)
        case 'Mozilla': return (<FontAwesome name="firefox" size={iconSize} color={iconColor} />)
        case 'Opera Coast':
        case 'Opera [Mini/Mobi/Tablet]': return (<FontAwesome name="opera" size={iconSize} color={iconColor} />)
        case 'Yandex': return (<FontAwesome5 name="yandex" size={iconSize} color={iconColor} />)
        default: return (<Entypo name="network" size={iconSize} color={iconColor} />)
      }
    }
  }

  useEffect(() => {
    const icon = getDeviceIcon(deviceData.manufaction, deviceData.platform, deviceData.osName)
    setDeviceIcon(icon)
  }, [])




  return (
    <Container>
      <DeviceIcon style={{ backgroundColor: deviceColor }}>
        {deviceIcon}
      </DeviceIcon>
      <InfoContainer>
        <Text style={{ color: 'white' }}>{`${deviceData.manufaction} ${deviceData.modelId}`}</Text>
        <Text style={{ color: 'white' }}>{ip}</Text>
        <Text style={{ color: 'white' }}>{onlineStatus}</Text>
      </InfoContainer>
      <Text>{current}</Text>
      <TouchableOpacity onPress={() => Alert.alert(
        "Delete this session ?",
        `
        Device: ${deviceData.manufaction} ${deviceData.modelId}
        IP: ${ip}
        OS: ${deviceData.osName}
        Version: ${deviceData.version}
        `,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK", onPress: onDeleteSesstionHandler }
        ],
        { cancelable: false }
      )}>
        <AntDesign name="close" size={40} color="gray" />
      </TouchableOpacity>
    </Container>
  )
}

export default DeviceComponent
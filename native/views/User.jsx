import { useState } from 'react'
import { Button, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components';

const BtnAction = styled.TouchableOpacity`
  width: 200px;
  background-color: red;
  height: 35px;
  margin: 5px;
  border-radius: 5px;
  justify-content: center;
`
const TextInfo = styled.Text`
  color: white;
  text-align: center;
  font-size: 20px;
`

function UserScreen({ route }) {

  const { id } = route.params;
  const [userInfo, setUserInfo] = useState({
    id: 1,
    emaiL: 'admin@gmail.com',
    details: 'information about user',
    isFriend: false,
    isBaned: false
  })

  const onFriendHandler = () => {
    setUserInfo(value => {
      value.isFriend = !value.isFriend
      console.log(value)
      return { ...value }
    })
  }

  const onBanHandler = () => {
    setUserInfo(value => {
      value.isBaned = !value.isBaned
      console.log(value)
      return { ...value }
    })
  }

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50%' }}>
      <Text style={{ color: 'white', fontSize: 30 }}>{userInfo.emaiL}</Text>
      <Text style={{ color: 'white', fontSize: 30 }}>{userInfo.details}</Text>
      <BtnAction style={{ backgroundColor: userInfo.isFriend ? '#1F4690' : '#4D96FF' }} onPress={onFriendHandler}>
        <TextInfo>{userInfo.isFriend ? 'UnFriend' : 'Add to Friend'}</TextInfo>
      </BtnAction>
      <BtnAction style={{ backgroundColor: userInfo.isBaned ? '#146356' : '#2C3639' }} onPress={onBanHandler}>
        <TextInfo>{userInfo.isBaned ? 'UnBanned' : 'Block user'}</TextInfo>
      </BtnAction>
    </View>
  )

}

export default UserScreen
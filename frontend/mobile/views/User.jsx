import { useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
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

  const [isConfirmRequest, setIsConfirmRequest] = useState(true)

  const onContactHandler = () => {
    setUserInfo(value => {
      value.isFriend = !value.isFriend
      console.log(value)
      return { ...value }
    })
  }

  const onBlockHandler = () => {
    setUserInfo(value => {
      value.isBaned = !value.isBaned
      console.log(value)
      return { ...value }
    })
  }

  const onAcceptHandler = () => {
    console.log('accept')
    setIsConfirmRequest(false)
  }

  const onRejectHandler = () => {
    console.log('reject')
    setIsConfirmRequest(false)
  }

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50%' }}>
      <Text style={{ color: 'white', fontSize: 30 }}>{userInfo.emaiL}</Text>
      <Text style={{ color: 'white', fontSize: 30 }}>{userInfo.details}</Text>
      {
        isConfirmRequest
          ?
          <View>
            <BtnAction style={{ backgroundColor: '#1f9030' }} onPress={onAcceptHandler}>
              <TextInfo>Accept request</TextInfo>
            </BtnAction>
            <BtnAction style={{ backgroundColor: '#ff4d4d' }} onPress={onRejectHandler}>
              <TextInfo>Reject request</TextInfo>
            </BtnAction>
          </View>
          :
          <View>
            <BtnAction style={{ backgroundColor: userInfo.isBaned ? 'black' : userInfo.isFriend ? '#1F4690' : '#4D96FF' }} onPress={onContactHandler} disabled={userInfo.isBaned}>
              <TextInfo>{userInfo.isFriend ? 'Remove from contact' : 'Add to contact'}</TextInfo>
            </BtnAction>
            <BtnAction style={{ backgroundColor: userInfo.isBaned ? '#146356' : '#2C3639' }} onPress={onBlockHandler}>
              <TextInfo>{userInfo.isBaned ? 'Unblock user' : 'Block user'}</TextInfo>
            </BtnAction>
          </View>
      }


    </View>
  )

}

export default UserScreen
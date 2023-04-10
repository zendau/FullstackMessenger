import styled from 'styled-components';
import {TouchableOpacity, Text} from 'react-native'

const SettingContainer = styled.TouchableOpacity`
  padding: 0 15px;
  width: 80%;
  flex-direction: row;
  margin: 10px auto;
  align-items: center;
  justify-content: center;
  background-color: #6AB3F3;
  border-radius: 10px;
`

const TextTitle = styled.Text`
  flex: 1;
  text-align: center;
  margin: 10px;
  font-size: 20px;
`

function SettingItem({ icon, title, onNavigate }) {
  return (
    <SettingContainer onPress={onNavigate} >
      {icon}
      <TextTitle style={{ color: 'white' }}>{title}</TextTitle>
    </SettingContainer>
  )
}

export default SettingItem
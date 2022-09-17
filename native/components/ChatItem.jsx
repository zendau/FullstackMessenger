import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native'
import { Text, TouchableOpacity } from 'react-native';

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    height: 70px;
    margin-bottom: 10px;
    border-bottom-color: black;
    border-bottom-width: 1px;
    align-items: center;
  `

function ChatItem({ navigation, id }) {
  return (
    <ItemContainer onPress={() => navigation.navigate('Chat', { id })}>
      <Ionicons name="person" size={48} color="gray" />
      <Text style={{ color: 'white', fontSize: 18, marginLeft: 20, flex: 1 }}>Login of user - {id}</Text>
    </ItemContainer>
  )
}

export default ChatItem
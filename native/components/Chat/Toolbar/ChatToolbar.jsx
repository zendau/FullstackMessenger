import { AntDesign } from '@expo/vector-icons';
import { View,Text } from 'react-native';
import styled from 'styled-components/native'
import ToolbarModel from './ToolbarModal';
import { useState } from 'react'

const ChatToolbarContainer = styled.View`
  flex-direction: row;
`

const ChatToolbarIcon = styled.TouchableOpacity`
  padding: 10px;
`

function ChatToolbar() {

  const [modalTitle, setModalTitle] = useState('');

  const addUserToGroup = (id) => {
    console.log('ADD', id)
  }

  const removeUserToGroup = (id) => {
    console.log('REMOVE', id)
  }
  

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <ChatToolbarContainer>
        <ChatToolbarIcon onPress={() => setModalTitle('Add user')}>
          <AntDesign name="adduser" size={30} color="white" />
        </ChatToolbarIcon>
        <ChatToolbarIcon onPress={() => setModalTitle('Remove user')}>
          <AntDesign name="deleteuser" size={30} color="white" />
        </ChatToolbarIcon>
      </ChatToolbarContainer>
      <ToolbarModel title={modalTitle} setTitle={setModalTitle}/>
    </View>

  )
}

export default ChatToolbar
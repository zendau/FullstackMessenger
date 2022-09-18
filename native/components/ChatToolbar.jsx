import { AntDesign } from '@expo/vector-icons';
import { View } from 'react-native';
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

  const [modalStatus, setModalStatus] = useState('');

  return (
    <View>
      <ChatToolbarContainer>
        <ChatToolbarIcon onPress={() => setModalStatus('Add user')}>
          <AntDesign name="adduser" size={30} color="white" />
        </ChatToolbarIcon>
        <ChatToolbarIcon onPress={() => setModalStatus('Remove user')}>
          <AntDesign name="deleteuser" size={30} color="white" />
        </ChatToolbarIcon>
      </ChatToolbarContainer>
      <ToolbarModel modal={modalStatus} setModal={setModalStatus}/>
    </View>

  )
}

export default ChatToolbar
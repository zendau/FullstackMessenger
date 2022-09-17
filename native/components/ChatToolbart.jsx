import { AntDesign } from '@expo/vector-icons';
import styled from 'styled-components/native'

const ChatToolbarContainer = styled.View`
  flex-direction: row;
`

const ChatToolbarIcon = styled.TouchableOpacity`
  padding: 10px;
`

function ChatToolbart() {
  return (
    <ChatToolbarContainer>
      <ChatToolbarIcon>
        <AntDesign name="adduser" size={30} color="white" />
      </ChatToolbarIcon>
      <ChatToolbarIcon>
        <AntDesign name="deleteuser" size={30} color="white" />
      </ChatToolbarIcon>
    </ChatToolbarContainer>
  )
}

export default ChatToolbart
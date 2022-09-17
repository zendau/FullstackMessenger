import { View, Text } from 'react-native';
import styled from 'styled-components/native'

const MessageContainer = styled.View`
  background-color: #182533; 
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  min-width: 100%;
  border-radius: 4px; 
`

const MessageHeader = styled.View`
  justify-content: space-between;
  flex-direction: row;
`

function Message({author, time, message}) {

  return (
    <MessageContainer>
      <MessageHeader>
        <Text style={{ color: '#35A7F7' }}>{author}</Text>
        <Text style={{ color: '#AA9D80' }}>{time}</Text>
      </MessageHeader>
      <Text style={{ color: '#fff' }}>{message}</Text>
    </MessageContainer>
  )
}

export default Message
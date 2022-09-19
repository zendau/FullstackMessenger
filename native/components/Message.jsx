import { View, Text } from 'react-native';
import styled from 'styled-components/native'

const MessageContainer = styled.View`
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  width: 80%;
  border-radius: 4px; 
  background-color: ${props => props.type ? '#182533': '#376EAF'}; 
  align-self: ${props => props.type ? 'flex-start': 'flex-end'};
`

const MessageHeader = styled.View`
  justify-content: space-between;
  flex-direction: row;
`

function Message({author, time, message, type}) {

  const firstColor = type ? '#35A7F7' : '#182533'
  const secondColor = type ? '#AA9D80' : '#000'
  
  return (
    <MessageContainer type={type}>
      <MessageHeader>
        <Text style={{ color: firstColor }}>{author}</Text>
        <Text style={{ color: secondColor }}>{time}</Text>
      </MessageHeader>
      <Text style={{ color: '#fff' }}>{message}</Text>
    </MessageContainer>
  )
}

export default Message
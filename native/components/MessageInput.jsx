import { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { View, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from "@react-navigation/native";

const ChatMessageContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

function MessageInput() {

  const [message, setMessage] = useState('')
  const focus = useIsFocused()

  useEffect(() => {  
    if (focus == false) { 
      setMessage('');
    }
  }, [focus]);


  return (
    <ChatMessageContainer>
      <TextInput
        multiline={true}
        placeholder='Type message'
        placeholderTextColor="#fff"
        style={{ color: 'white', backgroundColor: '#17212B', alignSelf: 'stretch', height: 60, flex: 1, padding: 10, fontSize: 20 }}
        onChangeText={setMessage}
        value={message}
      />
      <TouchableOpacity style={{ backgroundColor: '#5EB5F7', height: 60, justifyContent: 'center', padding: 10 }}>
        <Ionicons name="send" size={38} color="white" />
      </TouchableOpacity>
    </ChatMessageContainer>
  )
}

export default MessageInput
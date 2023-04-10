import {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, TextInput, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/native';

import {pick} from 'react-native-document-picker';
//import * as FileSystem from 'expo-file-system';

const ChatMessageContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

function MessageInput() {
  const [doc, setDoc] = useState();

  const pickDocument = async () => {
    const response = await pick({
      presentationStyle: 'fullScreen',
      allowMultiSelection: true,
    })
    console.log(response);
    setDoc(response.uri);
  };

  const clearDocument = () => {
    setDoc(null);
    console.log('clear', doc);
  };

  const [message, setMessage] = useState('');
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == false) {
      setMessage('');
    }
  }, [focus]);

  const SendMessage = () => {
    setMessage('');
  };

  return (
    <ChatMessageContainer>
      <TextInput
        multiline={true}
        placeholder="Type message"
        placeholderTextColor="#fff"
        style={{
          color: 'white',
          backgroundColor: '#17212B',
          alignSelf: 'stretch',
          height: 60,
          flex: 1,
          padding: 10,
          fontSize: 20,
        }}
        onChangeText={setMessage}
        value={message}
      />
      {doc ? (
        <TouchableOpacity
          onPress={clearDocument}
          style={{
            backgroundColor: '#bc210d',
            height: 60,
            justifyContent: 'center',
            padding: 10,
          }}>
          <AntDesign name="closecircle" size={38} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={pickDocument}
          style={{
            backgroundColor: '#0d70bc',
            height: 60,
            justifyContent: 'center',
            padding: 10,
          }}>
          <AntDesign name="addfile" size={38} color="white" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={SendMessage}
        style={{
          backgroundColor: '#5EB5F7',
          height: 60,
          justifyContent: 'center',
          padding: 10,
        }}>
        <Ionicons name="send" size={38} color="white" />
      </TouchableOpacity>
    </ChatMessageContainer>
  );
}

export default MessageInput;

import AntDesign from 'react-native-vector-icons/AntDesign';
import {View, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import ToolbarModel from './ToolbarModal';
import {useRef, useState} from 'react';

const ChatToolbarContainer = styled.View`
  flex-direction: row;
`;

const ChatToolbarIcon = styled.TouchableOpacity`
  padding: 10px;
`;

function ChatToolbar() {
  const [modalTitle, setModalTitle] = useState('');
  const modalHandler = useRef(null);

  const addUserToGroup = () => {
    modalHandler.current = id => {
      console.log('ADD', id);
    };

    setModalTitle('Add user');
  };

  const removeUserToGroupHandler = () => {
    modalHandler.current = id => {
      console.log('REMOVE', id);
    };

    setModalTitle('Add user');
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <ChatToolbarContainer>
        <ChatToolbarIcon onPress={addUserToGroup}>
          <AntDesign name="adduser" size={30} color="white" />
        </ChatToolbarIcon>
        <ChatToolbarIcon onPress={removeUserToGroupHandler}>
          <AntDesign name="deleteuser" size={30} color="white" />
        </ChatToolbarIcon>
      </ChatToolbarContainer>
      <ToolbarModel
        title={modalTitle}
        setTitle={setModalTitle}
        onClick={modalHandler.current}
      />
    </View>
  );
}

export default ChatToolbar;

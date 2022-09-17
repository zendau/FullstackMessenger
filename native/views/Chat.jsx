import { AntDesign, Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native'
import { View, Text, TouchableOpacity } from 'react-native';
import { useLayoutEffect } from 'react';

const ChatToolbarContainer = styled.View`
    flex-direction: row;
  `

const ChatToolbarIcon = styled.TouchableOpacity`
    padding: 10px;
`

function ChatScreen({ navigation, route }) {

  const { id } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `User ${id}`,
      headerRight: () => (
        <ChatToolbarContainer>
          <ChatToolbarIcon>
            <AntDesign name="adduser" size={30} color="white" />
          </ChatToolbarIcon>
          <ChatToolbarIcon>
            <AntDesign name="deleteuser" size={30} color="white" />
          </ChatToolbarIcon>
        </ChatToolbarContainer>
      ),
      headerLeft: () => (
        <TouchableOpacity style={{ flex: 1, borderRadius: 12 }} onPress={() => navigation.goBack()}>
          <Ionicons style={{ top: 18, marginLeft: 15, marginRight: 10, color: 'white', flex: 1 }} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    })
  }, [id])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 40, color: 'white' }} >id - {id}</Text>
    </View>
  );
}

export default ChatScreen
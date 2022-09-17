import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native'
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { useLayoutEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';
import ChatToolbart from '../components/chatToolbart';



function ChatScreen({ navigation, route }) {

  const { id } = route.params;


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `User ${id}`,
      headerRight: () => (
        <ChatToolbart/>
      ),
      headerLeft: () => (
        <TouchableOpacity style={{ flex: 1, borderRadius: 12 }} onPress={() => navigation.goBack()}>
          <Ionicons style={{ top: 18, marginLeft: 15, marginRight: 10, color: 'white', flex: 1 }} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    })

    return () => {
      setMessage('')
    }
  }, [id])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }}>
        {
          [1,2,3,4,5,6,7,8,9, 10, 11].map(item => (
            <Message message={item} time='21:57' author='admin' key={item}/>
          ))
        }
      </ScrollView>
      <MessageInput/>
    </View>
  );
}

export default ChatScreen
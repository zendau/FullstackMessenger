import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native'
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { useLayoutEffect, useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';
import ChatToolbar from '../components/ChatToolbar';

function isOdd(number) {
  return !!(number % 2)
}

function ChatScreen({ navigation, route }) {

  const { id } = route.params;
  const scrollViewRef = useRef()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `User ${id}`,
      headerRight: () => (
        <ChatToolbar />
      ),
      headerLeft: () => (
        <TouchableOpacity style={{ flex: 1, borderRadius: 12 }} onPress={() => navigation.goBack()}>
          <Ionicons style={{ top: 18, marginLeft: 15, marginRight: 10, color: 'white', flex: 1 }} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    })

  }, [id])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(item => (
            <Message type={isOdd(item)} message={item} time='21:57' author='admin' key={item} />
          ))
        }
      </ScrollView>
      <MessageInput />
    </View>
  );
}

export default ChatScreen
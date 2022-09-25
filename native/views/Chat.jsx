import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text } from 'react-native';
import { useLayoutEffect, useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Message from '../components/Chat/message/Message';
import MessageInput from '../components/Chat/MessageInput';
import ChatToolbar from '../components/Chat/Toolbar/ChatToolbar';

function isOdd(number) {
  return !!(number % 2)
}

function Test({title, status}) {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}} >
      <Text style={{ fontSize: 20, color: 'white'}}>{title}</Text>
      {/* <Text style={{color: 'gray'}}>Online</Text> */}
      <Text style={{color: 'gray'}}>Was 5 min ago</Text>
    </View>
  )
}

function ChatScreen({ navigation, route }) {

  const { id } = route.params;
  const scrollViewRef = useRef()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Test title={`User ${id}`} status={true} />,
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
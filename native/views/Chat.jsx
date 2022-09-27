import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Message from '../components/Chat/message/Message';
import MessageInput from '../components/Chat/MessageInput';
import ChatToolbar from '../components/Chat/Toolbar/ChatToolbar';
import ChatTitle from '../components/Chat/ChatTitle';
import GroupTitle from '../components/Chat/GroupTitle';
import { useSelector, useDispatch } from 'react-redux'

function isOdd(number) {
  return !!(number % 2)
}


function ChatScreen({ navigation, route }) {

  const { id, isGroup } = route.params;

  const [itemSelected, setItemSelected] = useState([]);
  const [isSelected, setIsSelected] = useState(false)
  console.log('render chat body', itemSelected)


  useLayoutEffect(() => {

    if (itemSelected.length === 0) {
      setIsSelected(false)
    }

    console.log('USE')
    navigation.setOptions({
      headerTitle: () => {

        if (itemSelected.length > 0) {
          return (
            <Text>Selected - {itemSelected.length}</Text>
          )
        } else if (isGroup) {
          return (
            <GroupTitle title={`Group ${id}`} />
          )
        } else {
          return (
            <ChatTitle title={`User ${id}`} status={true} id={id} navigation={navigation} />
          )
        }
      },
      headerRight: () => (
        <ChatToolbar />
      ),
      headerLeft: () => (
        <TouchableOpacity style={{ flex: 1, borderRadius: 12 }} onPress={() => navigation.goBack()}>
          <Ionicons style={{ top: 18, marginLeft: 15, marginRight: 10, color: 'white', flex: 1 }} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    })

  }, [id, itemSelected])



  return (
    <View style={{ flex: 1 }}>
      {/* <ScrollView
      style={{ flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }}
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
    > */}
      <FlatList
        style={{ paddingLeft: 10, paddingRight: 10 }}
        data={[
          { id: 1, message: 1 },
          { id: 2, message: 2 },
          { id: 3, message: 3 },
          { id: 4, message: 4 },
          { id: 5, message: 5 },
          { id: 6, message: 6 },
          { id: 7, message: 7 },
          { id: 8, message: 8 },
          { id: 9, message: 9 },
          { id: 10, message: 10 },
          { id: 11, message: 11 },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <Message 
          type={isOdd(item.message)} 
          message={item.message} 
          time='21:57' 
          author='admin' 
          isRead={true} 
          setSelectedMessages={setItemSelected}
          isSelected={isSelected} 
          setIsSelected={setIsSelected}
          />
        }
      />
      <MessageInput />
    </View>

  );
}

export default ChatScreen
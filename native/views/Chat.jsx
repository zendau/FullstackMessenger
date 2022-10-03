import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Message from '../components/Chat/message/Message';
import MessageInput from '../components/Chat/MessageInput';
import ChatToolbar from '../components/Chat/Toolbar/ChatToolbar';
import ChatTitle from '../components/Chat/ChatTitle';
import GroupTitle from '../components/Chat/GroupTitle';
import ChatSelectedToolbar from '../components/Chat/Toolbar/ChatSelectedToolbar';

function isOdd(number) {
  return !!(number % 2)
}



function ChatScreen({ navigation, route }) {

  const { id, isGroup } = route.params;

  const [itemsSelected, setItemsSelected] = useState([]);
  const [isSelected, setIsSelected] = useState(false)
  console.log('render chat body', itemsSelected)




  useLayoutEffect(() => {

    if (itemsSelected.length === 0) {
      setIsSelected(false)
    }

    console.log('USE')
    navigation.setOptions({
      headerTitle: () => {

        if (itemsSelected.length > 0) {
          return (
            <Text style={{ fontSize: 20, color: 'white' }}>Selected - {itemsSelected.length}</Text>
          )
        } else if (isGroup) {
          return (
            <GroupTitle title={`Group ${id}`} navigation={navigation} />
          )
        } else {
          return (
            <ChatTitle title={`User ${id}`} status={true} id={id} navigation={navigation} />
          )
        }
      },
      headerRight: () => {

        if (itemsSelected.length > 0) {
          return (
            <ChatSelectedToolbar itemsSelected={itemsSelected} setItemsSelected={setItemsSelected} />
          )
        }
        else {
          return (
            <ChatToolbar />
          )
        }

      },
      headerLeft: () => (
        <TouchableOpacity style={{ flex: 1, borderRadius: 12 }} onPress={() => navigation.goBack()}>
          <Ionicons style={{ top: 18, marginLeft: 15, marginRight: 10, color: 'white', flex: 1 }} name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    })

  }, [id, itemsSelected])



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
          { id: 12, message: 'test http://ya.ru sss http://google.com yo.test www.test.com' },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <Message
            type={isOdd(item.message)}
            message={item.message}
            time='21:57'
            author='admin'
            isRead={true}
            setSelectedMessages={setItemsSelected}
            isSelected={isSelected}
            setIsSelected={setIsSelected}
          />
        }
        inverted
      />
      <MessageInput />
    </View>

  );
}

export default ChatScreen
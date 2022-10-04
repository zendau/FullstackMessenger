import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Message from '../components/Chat/message/Message';
import MessageInput from '../components/Chat/MessageInput';
import ChatToolbar from '../components/Chat/Toolbar/ChatToolbar';
import ChatTitle from '../components/Chat/ChatTitle';
import GroupTitle from '../components/Chat/GroupTitle';
import ChatSelectedToolbar from '../components/Chat/Toolbar/ChatSelectedToolbar';
import isLink from '../utils/isLink';

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


  const renderMessageItem = ({item}) => {

    const messageData = isLink(item.message.toString())

    return (
      <Message
        type={isOdd(item.message)}
        message={messageData}
        time='21:57'
        author='admin'
        isRead={true}
        setSelectedMessages={setItemsSelected}
        isSelected={isSelected}
        setIsSelected={setIsSelected}
        id={item.id}
      />
    )
  }


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
          { id: 13, message: 1 },
          { id: 14, message: 2 },
          { id: 15, message: 3 },
          { id: 16, message: 4 },
          { id: 17, message: 5 },
          { id: 18, message: 6 },
          { id: 19, message: 7 },
          { id: 20, message: 8 },
          { id: 21, message: 9 },
          { id: 22, message: 10 },
          { id: 23, message: 11 },
          { id: 24, message: 'test http://ya.ru sss http://google.com yo.test www.test.com' },
          { id: 25, message: 1 },
          { id: 26, message: 2 },
          { id: 27, message: 3 },
          { id: 28, message: 4 },
          { id: 29, message: 5 },
          { id: 30, message: 6 },
          { id: 31, message: 7 },
          { id: 32, message: 8 },
          { id: 33, message: 9 },
          { id: 34, message: 10 },
          { id: 35, message: 11 },
          { id: 36, message: 'test http://ya.ru sss http://google.com yo.test www.test.com' },
          { id: 37, message: 1 },
          { id: 38, message: 2 },
          { id: 39, message: 3 },
          { id: 40, message: 4 },
          { id: 41, message: 5 },
          { id: 42, message: 6 },
          { id: 43, message: 7 },
          { id: 44, message: 8 },
          { id: 45, message: 9 },
          { id: 46, message: 10 }
        ]}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        inverted
      />
      <MessageInput />
    </View>

  );
}

export default ChatScreen
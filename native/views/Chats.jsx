import ChatItem from "../components/Chat/ChatItem";
import { useState } from "react";
import { FlatList } from 'react-native';
import useSearchData from "../hooks/useSearchData";
import styled from 'styled-components/native'

function isOdd(number) {
  return !!(number % 2)
}

function ChatsScreen({ navigation }) {


  const ListEmptyContainer = styled.View`
    height: 100%;
    align-items: center;
    justify-content: center;
  `
  const TextMessage = styled.Text`
    color: white;
    font-size: 30px;
    margin-top: 55%;
  `


  const [chatsData, serChatsData] = useState([
    { id: 1, message: 'a' },
    { id: 2, message: 'ab' },
    { id: 3, message: 'abc' },
    { id: 4, message: 'd' },
    { id: 5, message: 'de' },
    { id: 6, message: 'def' },
    { id: 7, message: 'g' },
    { id: 8, message: 'gh' },
    { id: 9, message: 'ghi' },
    { id: 10, message: 'j' },
    { id: 11, message: 'jo' },
  ])


  const [filteredData, setFilteredData] = useState(chatsData)


  useSearchData({
    navigation,
    data: chatsData,
    setFilteredData
  })

  return (
    <FlatList
      style={{ padding: 10 }}
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        <ChatItem isGroup={isOdd(item.id)} navigation={navigation} id={item.id} />
      }
      ListEmptyComponent={
        <ListEmptyContainer>
          <TextMessage>No chats</TextMessage>
        </ListEmptyContainer>
      }
    />
  );
}

export default ChatsScreen
import ChatItem from "../components/Chat/ChatItem";
import { FlatList } from 'react-native';

function isOdd(number) {
  return !!(number % 2)
}

function ChatsScreen({ navigation }) {
  return (
    <FlatList
      style={{ padding: 10 }}
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
        <ChatItem isGroup={isOdd(item.id)} navigation={navigation} id={item.id} />
      }
    />
  );
}

export default ChatsScreen
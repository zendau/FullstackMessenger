import ChatItem from "../components/ChatItem";
import { ScrollView } from 'react-native';

function ChatsScreen({ navigation }) {
  return (
    <ScrollView style={{ padding: 10 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => <ChatItem navigation={navigation} key={id} id={id} />)}
    </ScrollView>
  );
}

export default ChatsScreen
import ChatItem from "../components/Chat/ChatItem";
import { useState, useLayoutEffect} from "react";
import { FlatList, } from 'react-native';
import styled from 'styled-components/native'
import { TextInput } from "react-native-gesture-handler";
import CreateGroupNavTitle from "../components/CreateGroup/CreateGroupNavTitle";

function isOdd(number) {
  return !!(number % 2)
}



const TextMessage = styled.Text`
  color: white;
  font-size: 30px;
  margin-top: 55%;
`


const ListEmptyContainer = styled.View`
  height: 95%;
  align-items: center;
  justify-content: center;
`

function CreateGroupScreen({ navigation }) {

  const [itemsSelected, setItemsSelected] = useState([]);

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

  const onInputSearch = (e) => {
    const text = e.toLowerCase()
    setFilteredData(chatsData.filter(item => item.message.toLocaleLowerCase().includes(text)))
  }

  useLayoutEffect(() => {
    console.log('render')
    navigation.setOptions({
      headerTitle: () => {
        return (
          <CreateGroupNavTitle itemsSelected={itemsSelected}/>
        )
      }
    })
  }, [itemsSelected])

  return (
    <FlatList
      ListHeaderComponent={<TextInput onChangeText={onInputSearch} placeholder="Who would you like to add ?" placeholderTextColor={'gray'} style={{ fontSize: 18, textAlign: 'center', color: 'white' }} />}
      style={{ padding: 10 }}
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        <ChatItem isGroup={isOdd(item.id)} navigation={navigation} id={item.id} isCreateGroup setItemsSelected={setItemsSelected} itemsSelected={itemsSelected} />
      }
      ListEmptyComponent={
        <ListEmptyContainer>
          <TextMessage>No users</TextMessage>
        </ListEmptyContainer>
      }
    />
  );
}

export default CreateGroupScreen
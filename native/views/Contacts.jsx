import ChatItem from "../components/Chat/ChatItem";
import { FlatList, View, TextInput, Text } from 'react-native';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from 'styled-components/native'
import { FontAwesome, AntDesign  } from '@expo/vector-icons';
import useSearchData from "../hooks/useSearchData";

function isOdd(number) {
  return !!(number % 2)
}

const Test = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
`

const TextMessage = styled.Text`
  color: white;
  font-size: 30px;
   margin-top: 55%;
`



function ContactsScreen({ navigation }) {

  const [contactsData, serContactsData] = useState([
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



  const [filteredData, setFilteredData] = useState(contactsData)


  useSearchData({
    navigation,
    data: contactsData,
    setFilteredData
  })

  return (
    <View>
      <FlatList
        style={{ padding: 10, height: '100%' }}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <ChatItem isGroup={isOdd(item.id)} navigation={navigation} id={item.id} />
        }
        ListEmptyComponent={
          <Test>
            <TextMessage>No contacts</TextMessage>
          </Test>
        }
      />
    </View>

  );
}

export default ContactsScreen
import ChatItem from "../components/Chat/ChatItem";
import { FlatList, View } from 'react-native';
import { useState } from "react";
import styled from 'styled-components/native'
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



function PeopleScreen({ navigation }) {

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
          <ChatItem navigation={navigation} id={item.id} isPeopleNavigate />
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

export default PeopleScreen
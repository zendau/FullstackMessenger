import ChatItem from "../components/Chat/ChatItem";
import { useEffect, useState } from "react";
import { FlatList } from 'react-native';
import useSearchData from "../hooks/useSearchData";
import styled from 'styled-components/native'
import { useNavigation } from "@react-navigation/native";
import GroupFlatListHeader from "./CreateGroup/GroupFlatlistHeader";
import RequestsFlatListHeader from "./Requests/RequestsFlatListHeader";

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

function isOdd(number) {
  return !!(number % 2)
}

export function FlatContainer({ listData, noItemMessage, isPeopleNavigate, isRequestHeader, isCreateGroup, itemsSelected, setItemsSelected, setContactsData }) {



  const [filteredData, setFilteredData] = useState(listData)
  const navigation = useNavigation()


  console.log(filteredData)

  if (!isCreateGroup) {
    useSearchData({
      navigation,
      data: listData,
      setFilteredData
    })
  }


  const test = () => {
    console.log('loadMore')
  }


  return (
    <FlatList
      ListHeaderComponent={
        isCreateGroup ? <GroupFlatListHeader listData={listData} setFilteredData={setFilteredData} />
          : isRequestHeader &&
         <RequestsFlatListHeader setContactsData={setContactsData} setFilteredData={setFilteredData} />
      }
      style={{ padding: 10 }}
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        <ChatItem
          isGroup={isOdd(item.id)}
          id={item.id}
          isPeopleNavigate={isPeopleNavigate}
          isCreateGroup={isCreateGroup}
          setItemsSelected={setItemsSelected}
          itemsSelected={itemsSelected}
        />
      }
      ListEmptyComponent={
        <ListEmptyContainer>
          <TextMessage>{noItemMessage}</TextMessage>
        </ListEmptyContainer>
      }
      getItemLayout={(data, index) => (
        { length: 70, offset: 70 * index, index }
      )}
      refreshing={true}
      onEndReached={test}
      onEndReachedThreshold={0.1}
    />
  )
}

export default FlatContainer
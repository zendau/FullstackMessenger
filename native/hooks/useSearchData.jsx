import { FontAwesome, AntDesign } from '@expo/vector-icons';
import styled from 'styled-components/native'
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, Button } from 'react-native'


const SearchInput = styled.TextInput`
  color: white; 
  font-size: 20px;
  padding: 5px;
  text-decoration: underline;

`

const Title = styled.Text`
  font-size: 20px;
  color: white;
`

function useSearchData({ navigation, data, setFilteredData }) {


  const onInputSearch = (e) => {
    const text = e.toLowerCase()
    setFilteredData(data.filter(item => item.message.toLocaleLowerCase().includes(text)))
  }

  const onCloseSearch = () => {
    setFilteredData(data)
    setIsSearch(false)
  }



  const [isSeach, setIsSearch] = useState(false)
  const route = useRoute();
  const routeName = route.name;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => isSeach
        ?
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <SearchInput
            autoFocus={true}
            placeholder="Search"
            onChangeText={onInputSearch}
            placeholderTextColor="#fff" />
        </View>

        :
        <Title>{routeName}</Title>,
      headerRight: () =>
        isSeach
          ?
          <AntDesign name="close" style={{ padding: 10 }} size={28} color="white" onPress={onCloseSearch} />
          :
          <FontAwesome style={{ padding: 10 }} name="search" size={24} color="white" onPress={() => setIsSearch(true)} />
    })

  }, [isSeach])
}

export default useSearchData
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import styled from 'styled-components/native'
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';


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



  const [isSeach, setIsSearch] = useState(false)
  const route = useRoute();
  const routeName = route.name;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => isSeach ?
        <SearchInput
          autoFocus={true}
          placeholder="Search"
          onChangeText={onInputSearch}
          placeholderTextColor="#fff" /> : <Title>{routeName}</Title>,
      headerRight: () => isSeach ? <AntDesign name="close" style={{ padding: 10 }} size={28} color="white" onPress={() => setIsSearch(false)} /> : <FontAwesome style={{ padding: 10 }} name="search" size={24} color="white" onPress={() => setIsSearch(true)} />
    })

  }, [isSeach])
}

export default useSearchData
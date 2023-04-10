import { Button, TextInput, View, Text } from 'react-native'
import styled from 'styled-components/native'
import { useState, useMemo } from 'react'

const SearchInput = styled.TextInput`
  color: white;
  font-size: 20px;
  padding: 5px;
  text-decoration: underline;
  width: 50%;
`

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const TextCountInfo = styled.Text`
  color: white;
  margin-right: 10px;
`


function CreateGroupNavTitle({itemsSelected}) {

  const [groupTitle, setGroupTitle] = useState('')

  const onCreateGroupHandler = (e) => {
    console.log('CREATE', groupTitle, itemsSelected)
  }


  const SearchInputHandler = (text) => {
    setGroupTitle(text)
  }

  const isDisabled = useMemo(() => {
    if (groupTitle?.length >= 3) {
      if (itemsSelected.length > 0) {
        return false
      }
    }
    return true
  }, [groupTitle, itemsSelected])

  return (
    <Container>
      <SearchInput
        autoFocus={true}
        placeholder="Title of Group"
        onChangeText={SearchInputHandler}
        placeholderTextColor="#fff"
      />
      <Wrapper>
        <TextCountInfo>Count - {itemsSelected.length}</TextCountInfo>
        <Button onPress={onCreateGroupHandler} disabled={isDisabled} title='create' />
      </Wrapper>
    </Container>
  )
}

export default CreateGroupNavTitle
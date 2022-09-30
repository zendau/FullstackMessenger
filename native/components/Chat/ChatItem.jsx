import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native'
import { Text } from 'react-native';
import CheckBox from '../UI/CheckBox';
import { useEffect, useState } from 'react'

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    height: 70px;
    margin-bottom: 10px;
    border-bottom-color: black;
    border-bottom-width: 1px;
    align-items: center;
  `

function ChatItem({ navigation, id, isGroup, isPeopleNavigate,  isCreateGroup, itemsSelected,  setItemsSelected }) {

  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isCreateGroup && itemsSelected?.includes(id)) {
      setChecked(true)
    }
  }, [])

  const onCheckBoxHandler = () => {
    setChecked(!checked)
    if (!checked) {
      setItemsSelected(value => [...value, id])
    } else {
      setItemsSelected(value => value.filter((item) => item !== id))
    }
  }

  const onNavigateItemHandeler = () => {

    if (isPeopleNavigate) {
      navigation.navigate('User', { id })
    } else if (isCreateGroup) {
      onCheckBoxHandler()
    } else {
      navigation.navigate('Chat', { id, isGroup })
    }
  }



  return (
    <ItemContainer onPress={onNavigateItemHandeler}>
      {
        isGroup
          ?
          <Ionicons name="people" size={48} color="white" />
          :
          <Ionicons name="person" size={48} color="white" />
      }
      <Text style={{ color: 'white', fontSize: 18, marginLeft: 20, flex: 1 }}>Login of user - {id}</Text>
      {isCreateGroup && <CheckBox status={checked} onPress={onCheckBoxHandler} />}
    </ItemContainer>
  )
}

export default ChatItem
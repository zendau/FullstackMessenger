import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import ToolbarModel from './Toolbar/ToolbarModal'
import { useState } from 'react'

const Title = styled.Text`
  font-size: 20px;
  color: white;
`

function GroupTitle({ title, navigation }) {

  const [modalTitle, setModalTitle] = useState('');

  const onClick = (id) => {
    console.log('GROUP', id)
    navigation.navigate('User', { id })
  }

  return (
    <TouchableOpacity onPress={() => {
      console.log('click')
      setModalTitle('Members')
    }}>
      <Title>{title}</Title>
      <ToolbarModel title={modalTitle} setTitle={setModalTitle} onClick={onClick} />
    </TouchableOpacity>

  )
}

export default GroupTitle
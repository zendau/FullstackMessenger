import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import ToolbarModel from './Toolbar/ToolbarModal'
import { useState } from 'react'

const Title = styled.Text`
  font-size: 20px;
  color: white;
`

function GroupTitle({ title }) {

  const [modalTitle, setModalTitle] = useState('');

  const onClick = (id) => {
    console.log('GROUP', id)
  }

  return (
    <TouchableOpacity onPress={() => setModalTitle('Members')}>
      <Title>{title}</Title>
      <ToolbarModel title={modalTitle} setTitle={setModalTitle} onClick={onClick} />
    </TouchableOpacity>

  )
}

export default GroupTitle
import { Text } from 'react-native'
import styled from 'styled-components/native'

const ItemContainer = styled.TouchableOpacity`
background-color: #17212B;
align-self: stretch;
margin: 5px;
justify-content: center;
align-items: center;
border-radius: 5px;
padding: 5px;
`

const ItemText = styled.Text`
color: #fff;
font-size: 20px;
`

function ModalItem({title, onClick}) {

  return (
    <ItemContainer onPress={() => onClick(title)}>
      <ItemText>{title}</ItemText>
      <Text style={{color: 'gray'}}>Online</Text>
    </ItemContainer>
  )
}

export default ModalItem
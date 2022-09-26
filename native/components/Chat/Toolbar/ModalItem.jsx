import { Text } from 'react-native'
import styled from 'styled-components/native'

function ModalItem({title, onClick}) {


  const ItemContainer = styled.TouchableOpacity`
    background-color: #25303E;
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

  return (
    <ItemContainer onPress={() => onClick(title)}>
      <ItemText>{title}</ItemText>
      <Text>Online</Text>
    </ItemContainer>
  )
}

export default ModalItem
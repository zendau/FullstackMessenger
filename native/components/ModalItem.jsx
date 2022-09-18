import styled from 'styled-components/native'
import { View, Text, TouchableOpacity } from 'react-native';

function ModalItem({title}) {


  const ItemContainer = styled.TouchableOpacity`
    background-color: #25303E;
    align-self: stretch;
    margin: 5px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
  `

  const ItemText = styled.Text`
    color: #fff;
    font-size: 20px;
  `

  return (
    <ItemContainer>
      <ItemText>Test</ItemText>
    </ItemContainer>
  )
}

export default ModalItem
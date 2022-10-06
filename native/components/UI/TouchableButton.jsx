import styled from "styled-components"
import { Text } from 'react-native'

const ButtonContainer = styled.TouchableOpacity`
  padding: 10px;
  background-color: #17212B;
  border-radius: 5px;
  width: 110px;
  margin: 5px;
`

function TouchableButton({title, onPress}) {
  return (
    <ButtonContainer onPress={onPress}>
      <Text style={{color: '#6AB3F3', fontSize: 20, textAlign: 'center'}}>{title}</Text>
    </ButtonContainer>
  )
}

export default TouchableButton
import styled from 'styled-components/native'

const Container = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`

const Title = styled.Text`
  font-size: 20px;
  color: white;
`

const Online = styled.Text`
  color: gray;
`

function ChatTitle({ title, status, id, navigation }) {
  return (
    <Container onPress={() => navigation.navigate('User', { id })}>
      <Title>{title}</Title>
      {/* <Text style={{color: 'gray'}}>Online</Text> */}
      <Online>Was 5 min ago</Online>
    </Container>
  )
}

export default ChatTitle
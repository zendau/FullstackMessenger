import { View, Text } from 'react-native';
import styled from 'styled-components/native'
import { AntDesign } from '@expo/vector-icons';

const Container = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #2B5278;
  width: 100%;
  padding: 5px;
`

function formatSizeUnits(bytes) {
  if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
  else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
  else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1) { bytes = bytes + " bytes"; }
  else if (bytes == 1) { bytes = bytes + " byte"; }
  else { bytes = "0 bytes"; }
  return bytes;
}

function FileContainer({name, size}) {

  return (
    <Container>
      <AntDesign style={{
        borderRadius: 50,
        backgroundColor:  '#4C9CE2',
        padding: 10
      }} name="file1" size={30} color="white" />
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      }}>
        <Text style={{color: 'white'}}>{name}</Text>
        <Text style={{color: 'gray'}} >{formatSizeUnits(size)}</Text>
      </View>
    </Container>
  )
}

export default FileContainer

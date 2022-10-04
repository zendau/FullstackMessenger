import { Text } from 'react-native';
import styled from 'styled-components/native'
import { AntDesign } from '@expo/vector-icons';
import formatSizeUnits from '../../../utils/formatSizeUnits';

const Container = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #2B5278;
  width: 100%;
  padding: 5px;
`

const FileData = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`
const FileIcon = styled(AntDesign)`
  border-radius: 50px;
  background-color: #4C9CE2;
  padding: 10px;
`



function FileContainer({ name, size }) {

  return (
    <Container>
      <FileIcon name="file1" size={30} color="white" />
      <FileData>
        <Text style={{ color: 'white' }}>{name}</Text>
        <Text style={{ color: 'gray' }} >{formatSizeUnits(size)}</Text>
      </FileData>
    </Container>
  )
}

export default FileContainer

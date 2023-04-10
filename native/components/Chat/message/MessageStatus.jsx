import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

const StatusIcon = styled(Ionicons)`
  align-self: flex-end;
`

function MessageStatus({isRead}) {



  if (isRead === true) {
    return(<StatusIcon name="checkmark-done-sharp" size={24} color="white" />)
  } else if (isRead === false) {
    return(<StatusIcon name="checkmark-sharp" size={24} color="white" />)
  } else {
    return(<StatusIcon name="md-time-outline" size={24} color="white" />)
  }
}

export default MessageStatus
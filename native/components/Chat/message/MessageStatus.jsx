import { Ionicons } from '@expo/vector-icons'; 

function MessageStatus({isRead}) {
  
  const IconStyle = {
    alignSelf: 'flex-end'
  }

  if (isRead === true) {
    return(<Ionicons style={IconStyle} name="checkmark-done-sharp" size={24} color="white" />)
  } else if (isRead === false) {
    return(<Ionicons style={IconStyle} name="checkmark-sharp" size={24} color="white" />)
  } else {
    return(<Ionicons style={IconStyle} name="md-time-outline" size={24} color="white" />)
  }
}

export default MessageStatus
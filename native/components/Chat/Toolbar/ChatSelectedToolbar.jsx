import { Feather, AntDesign } from '@expo/vector-icons';
import { View } from 'react-native';
import styled from 'styled-components/native'


const ChatToolbarIcon = styled.TouchableOpacity`
padding: 10px;
`

function ChatSelectedToolbar({ itemsSelected, setItemsSelected }) {



  const editMessage = () => {
    console.log('edit ', itemsSelected)
  }

  const deleteMessages = () => {
    console.log('delete ', itemsSelected)
  }

  const closeSelectedMenu = () => {
    setItemsSelected([])
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {
        itemsSelected.length <= 1 &&
        <ChatToolbarIcon onPress={editMessage} >
          <Feather name="edit" size={30} color="white" />
        </ChatToolbarIcon>
      }
      <ChatToolbarIcon onPress={deleteMessages}>
        <AntDesign name="delete" size={30} color="white" />
      </ChatToolbarIcon>
      <ChatToolbarIcon onPress={closeSelectedMenu} >
        <AntDesign name="closecircleo" size={30} color="white" />
      </ChatToolbarIcon>
    </View>
  )
}

export default ChatSelectedToolbar
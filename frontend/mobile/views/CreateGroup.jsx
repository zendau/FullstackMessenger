import { useNavigation } from "@react-navigation/native";
import { useState, useLayoutEffect } from "react";
import CreateGroupNavTitle from "../components/CreateGroup/CreateGroupNavTitle";
import FlatContainer from "../components/FlatContainer";

function CreateGroupScreen() {

  const [itemsSelected, setItemsSelected] = useState([]);

  const [chatsData, serChatsData] = useState([
    { id: 1, message: 'a' },
    { id: 2, message: 'ab' },
    { id: 3, message: 'abc' },
    { id: 4, message: 'd' },
    { id: 5, message: 'de' },
    { id: 6, message: 'def' },
    { id: 7, message: 'g' },
    { id: 8, message: 'gh' },
    { id: 9, message: 'ghi' },
    { id: 10, message: 'j' },
    { id: 11, message: 'jo' },
  ])


  const navigation = useNavigation()

  useLayoutEffect(() => {
    console.log('render')
    navigation.setOptions({
      headerTitle: () => {
        return (
          <CreateGroupNavTitle itemsSelected={itemsSelected} />
        )
      }
    })
  }, [itemsSelected])

  return (
    <FlatContainer
      listData={chatsData}
      noItemMessage='No users'
      isCreateGroup
      setItemsSelected={setItemsSelected}
      itemsSelected={itemsSelected}
    />
  );
}

export default CreateGroupScreen
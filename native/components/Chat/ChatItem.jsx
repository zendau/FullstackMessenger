import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import {Text, TouchableOpacity} from 'react-native';
import CheckBox from '../UI/CheckBox';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  height: 70px;
  margin-bottom: 10px;
  border-bottom-color: black;
  border-bottom-width: 1px;
  align-items: center;
`;

function ChatItem({
  id,
  isGroup,
  isPeopleNavigate,
  isCreateGroup,
  itemsSelected,
  setItemsSelected,
}) {
  const [checked, setChecked] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (isCreateGroup && itemsSelected?.includes(id)) {
      setChecked(true);
    }
  }, []);

  const onCheckBoxHandler = () => {
    setChecked(!checked);
    if (!checked) {
      setItemsSelected(value => [...value, id]);
    } else {
      setItemsSelected(value => value.filter(item => item !== id));
    }
  };

  const onNavigateItemHandeler = () => {
    if (isPeopleNavigate) {
      navigation.navigate('User', {id});
    } else if (isCreateGroup) {
      onCheckBoxHandler();
    } else {
      navigation.navigate('Chat', {id, isGroup});
    }
  };

  return (
    <ItemContainer onPress={onNavigateItemHandeler}>
      {isGroup && !isPeopleNavigate ? (
        <Ionicons name="people" size={48} color="white" />
      ) : (
        <Ionicons name="person" size={48} color="white" />
      )}
      <Text style={{color: 'white', fontSize: 18, marginLeft: 20, flex: 1}}>
        Login of user - {id}
      </Text>
      <CheckBox
        status={checked}
        isSelected={isCreateGroup}
        onPress={onCheckBoxHandler}
      />
    </ItemContainer>
  );
}

export default ChatItem;

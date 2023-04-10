import {Modal, FlatList, View, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalItem from './ModalItem';
import {memo} from 'react';

const ModalCenter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 22px;
`;

const ModalContainer = styled.View`
  margin: 20px;
  background-color: #3a3a3d;
  border-radius: 10px;
  width: 70%;
  height: 60%;
  align-items: stretch;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ModalText = styled.Text`
  color: black;
  font-weight: bold;
  text-align: center;
`;

const Button = styled.TouchableOpacity`
  padding: 10px;
`;

const HeaderText = styled.Text`
  color: white;
  flex: 1;
  text-align: center;
  margin-left: 25%;
  font-size: 20px;
`;

function ToolbarModel({title, setTitle, onClick}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!title}
      onRequestClose={() => {
        console.log('CLOSE MODAL');
        setTitle('');
      }}>
      <ModalCenter>
        <ModalContainer>
          <Container>
            <HeaderText>{title}</HeaderText>
            <Button onPress={() => setTitle('')}>
              <AntDesign name="close" size={40} color="white" />
            </Button>
          </Container>
          <FlatList
            style={{alignSelf: 'stretch'}}
            data={[
              {id: 1, message: 1},
              {id: 2, message: 2},
              {id: 3, message: 3},
              {id: 4, message: 4},
              {id: 5, message: 5},
              {id: 6, message: 6},
              {id: 7, message: 7},
              {id: 8, message: 8},
              {id: 9, message: 9},
              {id: 10, message: 10},
              {id: 11, message: 11},
            ]}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ModalItem
                title={item.id}
                onClick={id => {
                  setTitle('');
                  onClick(id);
                }}
              />
            )}
          />
        </ModalContainer>
      </ModalCenter>
    </Modal>
  );
}

export default memo(ToolbarModel);

import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native'
import { AntDesign } from '@expo/vector-icons';
import ModalItem from './ModalItem';

function ToolbarModel({ modal, setModal }) {


  const ModalCenter = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 22px;
  `

  const ModalContainer = styled.View`
    margin: 20px;
    background-color: #3A3A3D;
    border-radius: 10px;
    width: 70%;
    height: 60%;
    align-items: stretch;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 5;
  `

  const ModalText = styled.Text`
    color: black;
    font-weight: bold;
    text-align: center;
  `

  const Button = styled.TouchableOpacity`
    padding: 10px;
  `

  const HeaderText = styled.Text`
   color: white;
   flex: 1;
   text-align: center;
   margin-left: 25%;
   font-size: 20px;
  `

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!modal}
      onRequestClose={() => {
        setModal('');
      }}
    >
      <ModalCenter>
        <ModalContainer>
          <View style={{
             flexDirection: 'row',
             justifyContent: 'space-between',
             alignItems: 'center'
          }}>
            <HeaderText>{modal}</HeaderText>
            <Button
              onPress={() => setModal('')}
            >
              <AntDesign name="close" size={40} color="white" />
            </Button>
          </View>
          <ScrollView style={{ alignSelf: 'stretch' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => <ModalItem key={id} id={id} />)}
          </ScrollView>
        </ModalContainer>
      </ModalCenter>
    </Modal>
  )
}

export default ToolbarModel
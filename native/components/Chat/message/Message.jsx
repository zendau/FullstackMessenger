import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native'
import FileContainer from './FileContainer';
import MessageStatus from './MessageStatus';
import { memo, useState, useEffect } from 'react'
import CheckBox from '../../UI/CheckBox';

const MessageContainer = styled.View`
  margin-top: 5px;
  margin-bottom: 5px;
  width: 80%;
  border-radius: 4px; 
  background-color: ${props => props.type ? '#182533' : '#376EAF'}; 
  align-self: ${props => props.type ? 'flex-start' : 'flex-end'};
`

const MessageHeader = styled.View`
  justify-content: space-between;
  flex-direction: row;
`

const MessageImage = styled.Image`
  margin: 0 auto;
  height: 80px;
  width: 80px;
`


function Message({ author, time, message, type, isRead, setSelectedMessages, isSelected, setIsSelected }) {

  const firstColor = type ? '#35A7F7' : '#182533'
  const secondColor = type ? '#AA9D80' : '#000'

  const [checked, setChecked] = useState(false);

  const onLongPressHandler = () => {
    setIsSelected(true)
    setChecked(true)
    setSelectedMessages(value => {
      if (value.includes(message)) {
        return value
      } else {
        return [...value, message]
      }

    })
  }

  const onCheckBoxHandler = () => {
    setChecked(!checked)
    if (!checked) {
      setSelectedMessages(value => [...value, message])
    } else {
      setSelectedMessages(value => value.filter((item) => item !== message))
    }
  }

  useEffect(() => {

    if (!isSelected) {
      setChecked(false)
    }



  }, [isSelected])

  return (
    <TouchableWithoutFeedback onLongPress={onLongPressHandler}>

      <MessageContainer type={type}>
        {
          isSelected &&
          <CheckBox
            status={checked}
            onPress={onCheckBoxHandler}
          />
        }
        <View style={{ padding: 10 }}>
          <MessageHeader>
            <Text style={{ color: firstColor }}>{author}</Text>
            <Text style={{ color: secondColor }}>{time}</Text>
          </MessageHeader>
          <Text style={{ color: '#fff', fontSize: 18 }}>{message}</Text>
          <MessageImage source={require('../../../assets/favicon.png')} />
          <MessageStatus isRead={isRead} />
        </View>
        <FileContainer name={`image${message}.png`} size={'308228'} />
      </MessageContainer>
    </TouchableWithoutFeedback >

  )
}

export default memo(Message)
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native'
import FileContainer from './FileContainer';
import MessageStatus from './MessageStatus';
import { memo, useState, useEffect } from 'react'
import CheckBox from '../../UI/CheckBox';
import MessageContent from './MessageContent';

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

const MessageAuthor = styled.Text`
  color: ${props => props.primary ? '#35A7F7' : '#182533'};
`

const MessageTime = styled.Text`
color: ${props => props.primary ? '#AA9D80' : '#000'};
`

const MessageImage = styled.Image`
  margin: 0 auto;
  height: 80px;
  width: 80px;
`

const FlexWrapContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`


function Message({ author, time, message, type, isRead, setSelectedMessages, isSelected, setIsSelected, id }) {

  console.log('render', id)

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

  const renderPartMessage = (item, index) => <MessageContent url={item.url} text={item.text} key={index} />

  return (
    <TouchableWithoutFeedback onLongPress={onLongPressHandler}>
      <MessageContainer type={type}>
        <CheckBox
          isSelected={isSelected}
          status={checked}
          onPress={onCheckBoxHandler}
        />
        <View style={{ padding: 10 }}>
          <MessageHeader>
            <MessageAuthor primary={type}>{author}</MessageAuthor>
            <MessageTime primary={type}>{time}</MessageTime>
          </MessageHeader>
          <FlexWrapContainer>
            {message?.map(renderPartMessage)}
          </FlexWrapContainer>
          <MessageImage source={require('../../../assets/favicon.png')} />
          <MessageStatus isRead={isRead} />
        </View>
        <FileContainer name={`image${message[0].text}.png`} size={'308228'} />
      </MessageContainer>
    </TouchableWithoutFeedback >

  )
}

export default memo(Message)
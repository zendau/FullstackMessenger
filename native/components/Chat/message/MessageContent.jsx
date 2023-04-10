import styled from 'styled-components';
import {Text} from 'react-native';

const TextMessage = styled.Text`
  font-size: 18px;
  padding: 2px;
  color: ${props => (props.isLink ? '#0f13ff' : '#fff')};
`;

function MessageContent({url, text}) {
  const onLinkHandler = url => {
    console.log('go to ', url);
  };

  if (url) {
    return (
      <TextMessage isLink onPress={() => onLinkHandler(url)}>
        {text}
      </TextMessage>
    );
  } else {
    return <TextMessage>{text}</TextMessage>;
  }
}

export default MessageContent;

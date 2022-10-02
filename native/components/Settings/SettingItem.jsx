import styled from 'styled-components';

const SettingContainer = styled.TouchableOpacity`
  width: 80%;
  flex-direction: row;
  margin: 10px auto;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: white;
`

const TextTitle = styled.Text`
  flex: 1;
  margin: 10px;
  font-size: 20px;
`

function SettingItem({ icon, title, onNavigate }) {
  return (
    <SettingContainer onPress={onNavigate} >
      {icon}
      <TextTitle style={{ color: 'white' }}>{title}</TextTitle>
    </SettingContainer>
  )
}

export default SettingItem
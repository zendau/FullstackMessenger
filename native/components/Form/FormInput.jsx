import styled from 'styled-components/native'
import { memo } from 'react'
const Input = styled.TextInput`
  background-color: #242F3D;
  border-radius: 5px;
  color: #fff;
  font-size: 20px;
  margin-top: 15px;
  padding: 10px;
  height: 50px;
`

const ErrorMessage = styled.Text`
  font-size: 16px;
  color: red;
`

function FormInput({ placeholder, value, error, secure, touched, submitCount, handleChange, multiline }) {
  return (
    <>
      <Input
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#fff"
        secureTextEntry={secure}
        onChangeText={handleChange}
        defaultValue={value}
      />
      {
        ((touched || submitCount > 0) && error) && <ErrorMessage>{error}</ErrorMessage>

      }
    </>
  )
}

export default memo(FormInput)
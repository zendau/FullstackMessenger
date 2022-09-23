import { Formik } from 'formik';
import * as yup from 'yup'
import { Button, TextInput, View, Text, Linking } from 'react-native';
import styled from 'styled-components/native'
import FormInput from '../components/FormInput';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})



const Container = styled.View`
width: 80%;
margin: 50% auto;
`

const FormContainer = styled.View`
margin-bottom: 20px;
`






function LoginScreen() {


  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={values => console.log(values)}
      validationSchema={schema}
      // validateOnChange={false}
    >
      {({ handleChange, handleSubmit, values, errors }) => (
        <Container>
          <FormContainer>
            <FormInput
              placeholder='Email'
              onChange={handleChange('email')}
              value={values.email}
              error={errors.email}
            />
            <FormInput
              placeholder='Password'
              onChange={handleChange('password')}
              value={values.password}
              error={errors.password}
              secure={true}
            />

          </FormContainer>
          <Button color={'#464649'} onPress={handleSubmit} title="Submit" />
          <Text style={{ color: 'blue' }}
            onPress={() => Linking.openURL('http://google.com')}>
            Google
          </Text>
        </Container>
      )
      }
    </Formik>
  )
}

export default LoginScreen
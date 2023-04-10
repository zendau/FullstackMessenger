import { Button, View } from 'react-native';
import styled from 'styled-components/native'
import FormInput from './FormInput';
import { memo } from 'react'
import { Formik } from 'formik';
import * as yup from 'yup'

function RegisterForm({onSubmit}) {

  const schema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    confirmPassword: yup.string().required('Confirm password is a required fied').oneOf([yup.ref('password'), null], 'Passwords must match'),
  })

  const Container = styled.View`
    width: 80%;
    margin: 40% auto;
  `

  const FormContainer = styled.View`
    margin-bottom: 20px;
  `

  return (
    <Formik
      initialValues={{ email: '', password: '', confirmPassword: '' }}
      onSubmit={onSubmit}
      validationSchema={schema}

    >
      {({ handleSubmit, values, errors, touched, submitCount, handleChange }) => (
        <Container>
          <FormContainer>
            <FormInput
              placeholder='Email'
              value={values.email}
              error={errors.email}
              touched={touched.email}
              submitCount={submitCount}
              handleChange={handleChange('email')}
            />
            <FormInput
              placeholder='Password'
              value={values.password}
              error={errors.password}
              secure={true}
              touched={touched.password}
              name='password'
              submitCount={submitCount}
              handleChange={handleChange('password')}
            />
            <FormInput
              placeholder='Confirm password'
              value={values.confirmPassword}
              error={errors.confirmPassword}
              secure={true}
              touched={touched.password}
              name='confirmPassword'
              submitCount={submitCount}
              handleChange={handleChange('confirmPassword')}
            />

          </FormContainer>
          <Button color={'#464649'} onPress={handleSubmit} title="Submit" />
        </Container>
      )
      }
    </Formik>
  )
}

export default memo(RegisterForm)
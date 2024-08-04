import { Button, View } from 'react-native';
import styled from 'styled-components/native'
import FormInput from './FormInput';
import { memo } from 'react'
import { Formik } from 'formik';
import * as yup from 'yup'

function RegisterForm({ onSubmit }) {

  const schema = yup.object({
    email: yup.string().email(),
    login: yup.string().min(6),
    details: yup.string().min(4),
    password: yup.string().min(6),
    confirmPassword: yup.string().test('passwords-match', 'Passwords must match', function (value) { return this.parent.password === value }),

  })

  const Container = styled.View`
    width: 80%;
    margin: 30% auto;
  `

  const FormContainer = styled.View`
    margin-bottom: 20px;
  `

  return (
    <Formik
      initialValues={{ email: 'test@gmail.com', login: 'test', details: '', password: '', confirmPassword: '' }}
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
              placeholder='Login'
              value={values.login}
              error={errors.login}
              touched={touched.login}
              submitCount={submitCount}
              handleChange={handleChange('login')}
            />
            <FormInput
              placeholder='Details'
              value={values.details}
              error={errors.details}
              touched={touched.details}
              submitCount={submitCount}
              handleChange={handleChange('details')}
              multiline
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
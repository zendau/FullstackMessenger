import { Button } from 'react-native';
import styled from 'styled-components/native'
import FormInput from './FormInput';
import { memo } from 'react'
import { Formik } from 'formik';
import * as yup from 'yup'

function ForgotForm({onSubmit}) {

  const schema = yup.object({
    email: yup.string().required().email()
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
      initialValues={{ email: '' }}
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
          </FormContainer>
          <Button color={'#464649'} onPress={handleSubmit} title="Submit" />
        </Container>
      )
      }
    </Formik>
  )
}

export default memo(ForgotForm)
import { Button, View } from 'react-native';
import styled from 'styled-components/native'
import FormInput from './FormInput';
import { memo } from 'react'
import { Formik } from 'formik';
import * as yup from 'yup'

function RegisterForm({setConfirmStatus, onSubmit}) {

  const schema = yup.object({
    confirmCode: yup.string().required('Confirm code is a required field').min(6),
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
      initialValues={{ confirmCode: '' }}
      onSubmit={onSubmit}
      validationSchema={schema}

    >
      {({ handleSubmit, values, errors, touched, submitCount, handleChange }) => (
        <Container>
          <FormContainer>
            <FormInput
              placeholder='Confirm code'
              value={values.confirmCode}
              error={errors.confirmCode}
              touched={touched.confirmCode}
              submitCount={submitCount}
              handleChange={handleChange('confirmCode')}
            />
          </FormContainer>
          <Button color={'#464649'} onPress={handleSubmit} title="Submit" />
          <Button color={'red'} onPress={() => setConfirmStatus(false)} title="Reset" />
        </Container>
      )
      }
    </Formik>
  )
}

export default memo(RegisterForm)
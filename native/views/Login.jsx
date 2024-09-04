import { memo } from 'react'
import LoginForm from '../components/Form/LoginForm'

function LoginScreen() {

  const onSubmitLogin = (values) => {
    console.log(values)
  }

  return (
    <LoginForm onSubmit={onSubmitLogin} />
  )

}

export default memo(LoginScreen)
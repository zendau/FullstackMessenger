import RegisterForm from '../components/RegisterForm';
import { memo, useState } from 'react'
import ConfirmCodeForm from '../components/ConfirmCodeForm';


function LoginScreen() {

  const [isShowConfirmCode, setIsShowConfirmCode] = useState(false)
  const [userData, setUserData] = useState({})

  const onSumbitConfirmCode = (values) => {
    console.log(values)
  }

  const onSubmitRegister = (values) => {
    console.log(values)
    setUserData(values)
    setIsShowConfirmCode(true)
  }

  if (isShowConfirmCode) {
    return (
      <ConfirmCodeForm onSubmit={onSumbitConfirmCode} setConfirmStatus={setIsShowConfirmCode} />
    )
  }
  else {
    return (
      <RegisterForm onSubmit={onSubmitRegister} />
    )
  }


}

export default memo(LoginScreen)
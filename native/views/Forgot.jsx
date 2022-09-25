import { memo, useState } from 'react'
import ForgotForm from '../components/Form/ForgotForm';
import ConfirmCodeForm from '../components/Form/ConfirmCodeForm';
import { Alert } from 'react-native'

function ForgotScreen() {

  const [isShowConfirmCode, setIsShowConfirmCode] = useState(false)
  const [userData, setUserData] = useState({})

  const onSumbitConfirmCode = (values) => {
    console.log('t',values)
    Alert.alert('Success', 'Your new password was send')
  }

  const onSubmitForgot = (values) => {
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
      <ForgotForm onSubmit={onSubmitForgot} />
    )
  }


}

export default memo(ForgotScreen)
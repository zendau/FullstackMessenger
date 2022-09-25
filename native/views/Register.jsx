import { memo, useState } from 'react'
import RegisterForm from '../components/RegisterForm';
import ConfirmCodeForm from '../components/ConfirmCodeForm';
import axios from 'axios';
import * as Device from 'expo-device';

function RegisterScreen() {

  const [isShowConfirmCode, setIsShowConfirmCode] = useState(false)
  const [userData, setUserData] = useState({})
  
  const onSumbitConfirmCode = (values) => {
    console.log(values)
  }

  const onSubmitRegister = async (values) => {

    const name = Device.modelName

    console.log(values, name)
    setUserData(values)
    setIsShowConfirmCode(true)

    // try {
    //   const res = await axios.get('https://7452-213-111-177-241.eu.ngrok.io/')
    //   console.log('res', res.data)
    // } catch (e) {
    //   console.log('e', e)
    // }

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

export default memo(RegisterScreen)
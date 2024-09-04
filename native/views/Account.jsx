import { useState } from 'react'
import UserDataForm from '../components/Form/UserDataForm';
import ConfirmCodeForm from '../components/Form/ConfirmCodeForm';

function AccountScreen() {

  const [isShowConfirmCode, setIsShowConfirmCode] = useState(false)
  const [userData, setUserData] = useState({})
  
  const onSumbitConfirmCode = (values) => {
    console.log(values)
  }

  const onSubmitUserData = async (values) => {

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
      <UserDataForm onSubmit={onSubmitUserData} />
    )
  }


}

export default AccountScreen
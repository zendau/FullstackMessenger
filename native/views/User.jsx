import { memo } from 'react'
import {Text} from 'react-native'

function UserScreen({ route }) {

  const { id } = route.params;

  return (
    <Text>User with id - {id}</Text>
  )

}

export default memo(UserScreen)
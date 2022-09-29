import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

function CheckBox({ status, onPress }) {

  return (
    <TouchableOpacity onPress={onPress} style={{
      height: 35, width: 35, backgroundColor: '#5288C1',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {
        status &&
        <AntDesign name="check" size={24} color="white" />
      }

    </TouchableOpacity>
  )

}

export default CheckBox
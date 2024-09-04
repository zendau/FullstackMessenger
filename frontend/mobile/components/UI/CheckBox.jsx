import { TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { memo } from 'react';

function CheckBox({ status, onPress, isSelected }) {

  if (isSelected) {
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


}

export default memo(CheckBox)
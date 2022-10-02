import { View } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import SettingItem from '../components/Settings/SettingItem';

function SettingsScreen({ navigation }) {

  return (
    <View style={{marginTop: 15}}>
      <SettingItem
        icon={<MaterialIcons name="devices" size={30} color="black" />}
        title={'Devices'}
        onNavigate={() => navigation.navigate('Devices')}
      />
      <SettingItem
        icon={<FontAwesome5 name="user-cog" size={30} color="black" />}
        title={'Account'}
        onNavigate={() => navigation.navigate('Account')}
      />
    </View>
  );
}

export default SettingsScreen
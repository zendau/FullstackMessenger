import { View } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import SettingItem from '../components/Settings/SettingItem';

function SettingsScreen({ navigation }) {

  return (
    <View>
      <SettingItem
        icon={<MaterialIcons name="devices" size={30} color="gray" />}
        title={'Devices'}
        onNavigate={() => navigation.navigate('Devices')}
      />
      <SettingItem
        icon={<FontAwesome5 name="user-cog" size={30} color="gray" />}
        title={'Account'}
        onNavigate={() => navigation.navigate('People')}
      />
    </View>
  );
}

export default SettingsScreen
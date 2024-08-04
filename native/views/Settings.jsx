import {View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SettingItem from '../components/Settings/SettingItem';

function SettingsScreen({navigation}) {
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

export default SettingsScreen;

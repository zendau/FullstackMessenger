import {useState} from 'react';
import PublicScreens from './PublicScreens';
import PrivateScreens from './PrivateScreens';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LoginScreen from '../views/Login';
import Register from '../views/Register';
import Forgot from '../views/Forgot';

function ScreenGateway() {
  const [auth, setAuth] = useState(true);

  const Drawer = createDrawerNavigator();

  const drawerScreenOptions = {
    headerStyle: {
      backgroundColor: '#17212B',
      borderBottomColor: '#000',
    },
    headerTintColor: '#fff',
    sceneContainerStyle: {
      backgroundColor: '#0E1621',
    },
    drawerStyle: {
      backgroundColor: '#242426',
    },
    drawerInactiveTintColor: '#fff',
    drawerActiveTintColor: '#55BFFA',
  };

  if (auth) {
    return (
      <PrivateScreens
        Drawer={Drawer}
        drawerScreenOptions={drawerScreenOptions}
      />
    );
  } else {
    return (
      <PublicScreens
        Drawer={Drawer}
        drawerScreenOptions={drawerScreenOptions}
      />
    );
  }
}

export default ScreenGateway;

import LoginScreen from '../views/Login';
import RegisterScreen from '../views/Register';
import ForgotScreen from '../views/Forgot';

function PublicScreens({Drawer, drawerScreenOptions}) {
  return (
    <Drawer.Navigator screenOptions={drawerScreenOptions} initialRouteName="Login" >
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Register" component={RegisterScreen} />
      <Drawer.Screen name="Forgot password" component={ForgotScreen} />
    </Drawer.Navigator>
  )
}

export default PublicScreens
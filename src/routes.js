import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Home from './pages/Home';
import New from './pages/New';

const App = createStackNavigator({ Login }, { headerMode: 'none' });
const isLogged = createStackNavigator({ Home, New }, { headerMode: 'none' });

export default createAppContainer(createSwitchNavigator(
  {
    Loading,
    App,
    isLogged,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Loading',
  }
));
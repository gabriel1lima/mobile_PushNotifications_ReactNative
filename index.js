import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import bgMessaging from './bgMessaging';
import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  console.tron = Reactotron
  .configure({ host: '192.168.111.21' })
  .useReactNative()
  .connect();
}

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // <-- Add this line
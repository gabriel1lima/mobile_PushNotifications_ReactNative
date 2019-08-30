import React, { Component } from 'react'
import Routes from './routes';

import { AsyncStorage, YellowBox, StatusBar } from 'react-native';
import firebase from 'react-native-firebase';

YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps is deprecated'])

export default class App extends Component {
  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
    firebase.notifications().android.createChannel(channel);
    
    this.checkPermission();

    this.createNotificationListeners();
  }

  // Remove listeners
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
  }

  async createNotificationListeners() {

    // Primeiro plano
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      
      notification.android.setChannelId('insider').setSound('default')
      firebase.notifications().displayNotification(notification)
      
      console.tron.log('1', notification)

    });

    // Ssegundo plano
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.tron.log('2', notificationOpen.notification)
    });
  
    // Fechado
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      console.tron.log('3', notificationOpen.notification)
    }

    // Disparado apenas para carga útil de dados em primeiro plano
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.tron.log('4', JSON.stringify(message));
    });
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {

    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.tron.log('fcmToken Storage->', fcmToken);
    
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.tron.log('fcmToken Novo->', fcmToken);

      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }
  
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

      this.getToken();
    } catch (error) {

      console.tron.log('permission rejected');
    }
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor="#cccccc" barStyle="dark-content" />
        <Routes />
      </>
    )
  }
}
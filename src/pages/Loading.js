import React, { Component } from 'react';

import { AsyncStorage } from 'react-native';

export default class Loading extends Component {

  constructor(props) {
    super(props);

    this.verifyLogged();
  }

  verifyLogged = async () => {
    const token = await AsyncStorage.getItem('@Todo:token');

    this.props.navigation.navigate(token ? 'isLogged' : 'App');
  };

  render() {
    return null;
  }
}

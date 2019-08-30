import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class Label extends Component {
  render() {
    return <View style={[styles.label, { backgroundColor: this.props.color }]}></View>;
  }
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    right: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    marginTop: 17.5,
    width: 20,
    height: 6,
  }
})

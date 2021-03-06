import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import Label from '../Label';
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Card extends Component {

  renderTime(d){
    return moment(new Date(d)).format('DD/MM HH:mm')+" hrs"
  }

  renderResizeMode(type){
    switch (type) {
      case 1:
        return { width: '47%', height: 125 };
      case 2:
        return { width: '47%', height: 190 };
      case 3:
        return { width: '100%', height: 125 };
    }
  }

  render() {
    const { todo, removeTodo, toggleTodo, typeResize } = this.props;
    return (
      <TouchableHighlight
        key={todo._id}
        underlayColor="#dedede"
        onLongPress={() => removeTodo(todo)}
        onPress={() => toggleTodo(todo)}
        style={[styles.card, todo.done ? styles.borderCard : null, this.renderResizeMode(typeResize) ]}
      >
        <>
          <Label color={todo.colorLabel} />

          <Text style={{ fontSize: 12, color: 'gray', marginTop: 13, fontFamily: 'Montserrat-Regular' }}>{this.renderTime(todo.createdAt)}</Text>

          <Text
            numberOfLines={this.renderResizeMode(typeResize).height == 190 ? 7 : 3}
            style={{ color: '#000', marginTop: 4, fontFamily: 'Montserrat-Regular' }}
          >
            {todo.title}
          </Text>
          
          <View style={{ position: 'absolute', bottom: 0, flex: 1, marginBottom: 13, marginLeft: 20, alignItems: 'center', flexDirection: 'row', }}>
            { todo.done ?
              <Icon style={{ marginRight: 3 }} color="green" name="check-square-o" />
              :
              <Icon style={{ marginRight: 3 }} color="red" name="square-o" />
            }
            <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Montserrat-Regular' }}>
              { todo.done ? 'Feito' : 'À Fazer' }
            </Text>
          </View>
        </>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  borderCard: {
    opacity: 0.25,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
    elevation: 0,
  },
  card: {
    width: '47%',
    marginBottom: '6%',
    height: 125,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFF',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    
    elevation: 12,
  },
})

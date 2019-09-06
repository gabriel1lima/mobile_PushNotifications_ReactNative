import React, { Component } from 'react'
import { Text, SafeAreaView, View, StyleSheet, TouchableOpacity, TextInput, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import api from '../services/api';
import ColorPalette from 'react-native-color-palette'

export default class New extends Component {

	state = {
    title: "",
    colorLabel: '#ee4e22'
	};

	goBack() {
		this.props.navigation.pop()
	}
  
  async createTodo() {
    const { title, colorLabel } = this.state;

    if(!title.length) return;

		const id_user = await AsyncStorage.getItem('@Todo:id_user')

		const res = await api.post('todos', {title, id_user, colorLabel});

    if (res.status) this.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={() => this.goBack()}>
						<Icon name="arrow-left" size={24} color="#000" />
					</TouchableOpacity>
          <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 18, marginLeft: 32 }}>Nova Tarefa!</Text>
				</View>

        <Text style={{ marginLeft: 30, fontFamily: 'Montserrat-Regular', fontSize: 15, marginBottom: 20 }}>Descrição da tarefa: </Text>
				<TextInput
					style={styles.input}
					multiline
					placeholder="Ex.: Fazer café..."
					onChangeText={(value) => this.setState({ title: value })}
					value={this.state.title}
          placeholderTextColor="#999"
					returnKeyType="send"
					onSubmitEditing={this.handleNewTweet}
				/>

        
        <Text style={{ marginLeft: 30, fontFamily: 'Montserrat-Regular', fontSize: 15, marginBottom: 5 }}>Prioridade: </Text>
        <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
          <ColorPalette
            onChange={color => this.setState({colorLabel: color})}
            value={this.state.colorLabel}
            colors={['#000000', '#ee4e22', '#f38121', '#fecb0a', '#3f7f49', '#7bb435', '#264473', '#88d6e3', '#d7ae92', '#f4cec3', '#e75c77']}
            title=""
            paletteStyles={{ marginHorizontal: 30 }}
            icon={
              <Icon name={'circle'} size={25} color={'white'} />
            }
            // paletteStyles={{borderWidth: 1, borderColor: 'red'}}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => this.createTodo()}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF",
    },
  
    header: {
      height: 56,
      width: '100%',
      paddingHorizontal: 16,
      marginBottom: 40,
      flexDirection: "row",
      alignItems: "center"
    },
  
    button: {
      position: 'absolute',
      bottom: 0,
      elevation: 7,
      height: 50,
      width: '100%',
      backgroundColor: "#48bdd4",
      // borderRadius: 5,
      justifyContent: "center",
      alignItems: "center"
    },
  
    buttonText: {
      color: "#FFF",
      fontSize: 16,
      fontFamily: 'Montserrat-Bold'
    },
  
    input: {
      height: 44,
      borderWidth: 1,
      borderColor: "#DDD",
      borderRadius: 5,
      paddingHorizontal: 15,
      alignSelf: "stretch",
      marginHorizontal: 30,
      marginBottom: 40,
      fontFamily: 'Montserrat-Regular'
    },
  });
  
import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StackActions, NavigationActions } from 'react-navigation'
import api from '../services/api';

export default class Login extends Component {

	state = {
    username: "",
    password: "",
	};

	navigateToHome = () => {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({routeName: 'Home'})
			]
		});

		this.props.navigation.dispatch(resetAction);
	}

	handleLogin = async () => {
		const { username, password } = this.state;

		if(!username.length) return;

    let fcmtoken = await AsyncStorage.getItem('fcmToken');

    const { status, data: { user, token } } = await api.post('auth/login', { username, password, fcmtoken });

    if (status){
      await AsyncStorage.multiSet([['@Todo:username', user.name], ['@Todo:id_user', user._id], ['@Todo:token', token]]);
      this.navigateToHome();
    }

	}

  render() {
    return (
			<View style={styles.container}>
				<View style={styles.content}>
          <Image source={require('../assets/to-do.png')} style={{ width: '100%', height: 80, marginBottom: 15 }} resizeMode="contain" />
					
					<TextInput
            autoCapitalize = 'none'
						style={styles.input}
						placeholder="Nome de Usuário"
						value={this.state.username}
						onChangeText={(username) => this.setState({ username })}
					/>
					<TextInput
            secureTextEntry
						style={styles.input}
						placeholder="Senha"
						value={this.state.password}
						onChangeText={(password) => this.setState({ password })}
						returnKeyType="send"
						onSubmitEditing={this.handleLogin}
					/>

					<TouchableOpacity style={styles.button} onPress={this.handleLogin}>
						<Text style={styles.buttonText}>Entrar</Text>
					</TouchableOpacity>
				</View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF"
    },
  
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30
    },
  
    input: {
      borderWidth: 1,
      borderColor: "#DDD",
      borderRadius: 5,
      height: 44,
      paddingHorizontal: 15,
      alignSelf: "stretch",
      marginTop: 15
    },
  
    button: {
      height: 44,
      alignSelf: "stretch",
      marginTop: 15,
      backgroundColor: "#48bdd4",
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center"
    },
  
    buttonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold"
    }
  });
  
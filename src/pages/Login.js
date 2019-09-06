import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StackActions, NavigationActions } from 'react-navigation'
import api from '../services/api';

export default class Login extends Component {

	state = {
    username: "gabriel",
    password: "123456",
    erro: "Nenhum erro"
	};

	navigateToHome = () => {
    // Navegar resetando a Stack (sem voltar)
    /*
    const resetAction = StackActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({routeName: 'isLogged', action: NavigationActions.navigate({ routeName: 'isLogged-Home' })})
			]
    });
    this.props.navigation.dispatch(resetAction);
    */
    
    // Navegar para uma rota específica de outra Stack
    /*
    this.props.navigation.navigate(NavigationActions.navigate({
      routeName: 'isLogged',
      action: NavigationActions.navigate({ routeName: 'isLogged-Home' })
    }))
    */

    // Navega para outra Stack
    this.props.navigation.navigate('isLogged');

	}

	handleLogin = async () => {
		const { username, password } = this.state;

		if(!username.length) return;

    let fcmtoken = await AsyncStorage.getItem('fcmToken');

    try {
      const { status, data: { user, token, refreshToken } } = await api.post('auth/login', { username, password, fcmtoken });
      
      if (status == 200){
        await AsyncStorage.multiSet([['@Todo:username', user.username], ['@Todo:id_user', user._id], ['@Todo:token', token], ['@Todo:refreshToken', refreshToken]]);
        this.navigateToHome();
      }

    } catch (error) {
      // console.tron.log(error)
      this.setState({ erro: error.message })
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

          <Text>{ this.state.erro }</Text>

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
  
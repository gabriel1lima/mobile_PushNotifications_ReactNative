import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, AsyncStorage, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import api from '../services/api';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

export default class Home extends Component {
 
  state = {
    listTodos: [],
    loading: true,
    username: 'Usuário',
    organizar: false,
    typeResize: 1,
    actived: 1,
    visibleFab: true,
    heightScroll: 0,
  }

  constructor(props) {
    super(props);

    this.scrollAnim = new Animated.Value(0);
  }

  async componentDidMount(){
    
    const username = await AsyncStorage.getItem('@Todo:username');
    const typeResize = parseInt(await AsyncStorage.getItem('@Todo:typeResize'));
    
    this.setState({ username: username || 'Usuário', typeResize: typeResize || 1 });

    this.getTodosUser();

    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getTodosUser()
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  async getTodosUser(){

    this.setState({ actived: 1 });

    const id = await AsyncStorage.getItem('@Todo:id_user');
    try {
      const { status, data: { todos: listTodos }} = await api.get('todos/'+id);
      
      if (status === 200) {
        this.setState({ listTodos, loading: false });
      }
    } catch (error) { }
    
  }

  async getTodosShare(){

    this.setState({ actived: 2 });

    const { status, data: { todos: listTodos }} = await api.get('todos');
    
    if (status) {
      this.setState({ listTodos, loading: false });
    }
  }

  async toggleTodo(todo) {

    const { status }= await api.put(`todos/${todo._id}`, { done: !todo.done });

    if (status) { this.getTodosUser(); }
  }

  async removeTodo(todo) {
    const { status } = await api.delete(`todos/${todo._id}`);

    if (status) { this.getTodosUser(); }
  }

  async logout() {
    await AsyncStorage.multiRemove(['@Todo:username', '@Todo:id_user', '@Todo:token', '@Todo:refreshToken']);

    this.props.navigation.navigate('Loading');
  }

  async setTypeResize(typeResize){
    this.setState({ typeResize });
    await AsyncStorage.setItem('@Todo:typeResize', String(typeResize));
  }

  handlerOnScroll(nativeEvent) {
    
    let { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    let tmp_heightScroll = contentSize.height - layoutMeasurement.height
    this.setState({ heightScroll: tmp_heightScroll > 100 ? tmp_heightScroll - 100 : tmp_heightScroll });
    
    this.scrollAnim.setValue(contentOffset.y - 100);
    
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 1) {
      this.setState({ visibleFab: false });
    } else {
      this.setState({ visibleFab: true });
    }

  };
  
  render() {
    return(
      <>{
        !this.state.loading ?
          <View style={styles.container}>

            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => this.logout()}>
                <Icon2 style={{ transform: [ { rotate: '180deg' }] }} name="logout" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.header}>
              <Text style={styles.textHeader}>Bem-vindo, {this.state.username}!</Text>
              <Text style={styles.textSubHeader}>Abaixo, suas tarefas do dia-a-dia...</Text>
            </View>
            
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ height: 30 }} horizontal style={styles.scroll}>
              <TouchableOpacity onPress={() => this.getTodosUser()}>
                <Text style={[styles.textScroll, this.state.actived == 1 && styles.textScrollActived]}>Suas Tarefas</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.getTodosShare()}>
                <Text style={[styles.textScroll, this.state.actived == 2 && styles.textScrollActived]}>Tarefas Compartilhadas</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={[styles.textScroll, this.state.actived == 3 && styles.textScrollActived]}>Anotações</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={[styles.textScroll, this.state.actived == 4 && styles.textScrollActived]}>Anotações</Text>
              </TouchableOpacity>
            </ScrollView>


            <View style={{ width: '100%', height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingLeft: 40, marginBottom: 3 }}>

              <TouchableOpacity onPress={() => this.setState({ organizar: !this.state.organizar })} style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 13, color: 'gray' }}>Organizar</Text>
                <Icon3 name={this.state.organizar ? 'keyboard-arrow-right' : 'keyboard-arrow-down'} size={15} color="gray" />
              </TouchableOpacity>
              
              {
                this.state.organizar ?
                <>
                  <TouchableOpacity onPress={() => this.setTypeResize(1)} style={{ marginLeft: 10 }}>
                    <Animatable.Image
                      animation="swing"
                      source={this.state.typeResize == 1 ? require('../assets/icons/1b.png') : require('../assets/icons/1a.png')}
                      resizeMode="contain"
                      style={{ height: 25, width: 25 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setTypeResize(2)} style={{ marginLeft: 15 }}>
                    <Animatable.Image
                      animation="swing"
                      source={this.state.typeResize == 2 ? require('../assets/icons/2b.png') : require('../assets/icons/2a.png')}
                      resizeMode="contain"
                      style={{ height: 25, width: 25 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setTypeResize(3)} style={{ marginLeft: 15 }}>
                    <Animatable.Image
                      animation="swing"
                      source={this.state.typeResize == 3 ? require('../assets/icons/3b.png') : require('../assets/icons/3a.png')}
                      resizeMode="contain"
                      style={{ height: 25, width: 25 }}
                    />
                  </TouchableOpacity>
                </>
                : null
              }
            </View>

            <ScrollView
              style={{ height: '100%' }}
              contentContainerStyle={styles.containerCards}
              onScroll={({ nativeEvent }) => this.handlerOnScroll(nativeEvent) }
            >
              {
                this.state.listTodos.map(todo => 
                  <Card
                    key={todo._id}
                    todo={todo}
                    removeTodo={this.removeTodo.bind(this)}
                    toggleTodo={this.toggleTodo.bind(this)}
                    typeResize={this.state.typeResize}
                  />
                )
              }
            </ScrollView>

            {
              this.state.visibleFab
              ?
                <Animated.View
                  style={
                    [
                      styles.fab, 
                      { 
                        opacity: this.scrollAnim.interpolate({
                          inputRange: [0, this.state.heightScroll],
                          outputRange: [1, 0],
                          extrapolate: 'clamp',
                        }) 
                      }
                    ]
                  }
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('New')}
                    activeOpacity={0.7}
                  >
                    <Icon name="plus" size={20} color="#FFF" />
                  </TouchableOpacity>
                </Animated.View>
              :
                null
            }
            

          </View>
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 20, color: '#000' }}>Carregando...</Text>
            <LottieView style={{ width: '100%', height: 350 }} source={require('../assets/deadpool.json')} autoPlay loop />
          </View>
      }</>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingRight: 2,
  },
  header: {
    marginTop: 14,
    paddingLeft: 40
  },
  headerButtons: {
    height: 56,
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  textHeader: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 23,
    color: '#000'
  },
  textSubHeader: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: 'gray'
  },
  scroll: {
    height: 30,
    marginTop: 40,
    marginBottom: 7,
    marginLeft: 40,
    flexDirection: 'row'
  },
  containerCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: 40,
    paddingTop: 10,
  },
  textScroll: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: 'gray',
    marginRight: 20
  },
  textScrollActived: {
    fontFamily: 'Montserrat-Bold',
    color: '#000'
  },
  fab: {
    position: 'absolute',
    elevation: 12,
    bottom: 16,
    right: 16,
    alignSelf: 'flex-end',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

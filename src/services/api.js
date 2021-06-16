import axios from 'axios';
import NavigationService from "./NavigationService"
import {
  AsyncStorage
} from 'react-native';

const api = axios.create({
  baseURL: 'https://backpush.loca.lt'
});

async function goToLogin() {
  await AsyncStorage.multiRemove(['@Todo:username', '@Todo:id_user', '@Todo:token', '@Todo:refreshToken']);

  NavigationService.navigate("Loading");
}

api.interceptors.response.use(
  (response) => {
  
    return response;
  },
  async (error) => {

    const { config: originalRequest, response: { status, data: {error: msg} } } = error;

    // Se não for erro referente a expiração de token, apenas retorna o erro.
    if (status !== 498) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    } 

    if (originalRequest.url.endsWith('token') && (msg == 'Token de atualização inválido' || msg == 'Erro no Token de atualização fornecido')) {
       
      goToLogin();

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    const username = await AsyncStorage.getItem('@Todo:username');
    const refreshToken = await AsyncStorage.getItem('@Todo:refreshToken');

    try {
      const { data: { token } } = await api.post('auth/token', { username, refreshToken });

      if (token) await AsyncStorage.setItem('@Todo:token', token);
      
      return await api.request(originalRequest);
      
    } catch (error) {
      
    }


    return Promise.reject(error);
  }
);

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@Todo:token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  } catch (err) {

  }
});

export default api;
import axios from 'axios';
import {
  AsyncStorage
} from 'react-native';

const api = axios.create({
  baseURL: 'http://192.168.111.21:3000'
});

// Add a response interceptor
api.interceptors.response.use(function (response) {
  
  // console.tron.log("DEU CERTO");
  return response;
  
}, function (error) {

  // console.tron.log("DEU ERRO", error.response);
  return Promise.reject(error);
});

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
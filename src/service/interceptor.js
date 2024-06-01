import axios from './fetch';
import store from '../store/index';
import router from '../router/index';

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    });

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (store.state.auth.connected && error.response.status === 401) {
            store.commit('auth/SET_TOKEN', null)
            store.commit('auth/SET_CONNECTED', false)
            router.replace({ name: "Login" });
            return Promise.reject(error);
        }

        return Promise.reject(error);
    });

export default axios;
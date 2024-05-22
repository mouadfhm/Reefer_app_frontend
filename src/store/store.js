import Vuex from 'vuex';
import axios from 'axios';

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
    error: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    setError(state, error) {
      state.error = error;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const { data } = await axios.post('/login', credentials);
        const token = data.token;
        commit('setUser', data);
        commit('setToken', token);
        localStorage.setItem('token', token);
        window.location.href = '/';
      } catch (error) {
        commit('setError', error.message);
      }
    },
    async logout({ commit }) {
      commit('clearUser');
      localStorage.removeItem('token');
      window.location.href = '/login';
    },
    async register({ commit }, userData) {
      try {
        const { data } = await axios.post('/register', userData);
        commit('setUser', data);
      } catch (error) {
        commit('setError', error.message);
      }
    },
    async resetPassword({ commit }, userData) {
      try {
        const { data } = await axios.post('/reset-password', userData);
        commit('setUser', data);
      } catch (error) {
        commit('setError', error.message);
      }
    },
    async deleteUser({ commit }, userData) {
      try {
        const { data } = await axios.post('/delete', userData);
        commit('setUser', data);
      } catch (error) {
        commit('setError', error.message);
      }
    },
    async getUsers({ commit }) {
      try {
        const { data } = await axios.get('/users');
        commit('setUser', data);
      } catch (error) {
        commit('setError', error.message);
      }
    },
  },
});


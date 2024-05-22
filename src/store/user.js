import axios from 'axios';
import CustomizedAxios from '../services/axios';

const state = {
  users: [],
  token:null,
  currentUser: null,
};

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  LOGIN_USER(state, payload) {
    state.token = payload.token;
    state.currentUser = payload.user;
  }
};

const actions = {
  LoginAction({ commit }, user) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("users/login", user)
        .then((response) => {
          commit("LOGIN_USER", response.data.payload);
          CustomizedAxios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.payload.token}`;
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateAction({ commit }, user) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("users/update", user)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchUsers({ commit }) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.get("users")
        .then((response) => {
          commit("SET_USERS", response.data.payload);
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  registerAction({ commit }, user) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("users/register", user)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  logoutAction({ commit }, user) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("users/logout", user)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deleteAction({ commit }, user) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("users/delete", user)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  passwordResetAction({ commit }, user) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("users/reset-password", user)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};

const getters = {
  getUsers: state => state.users,
  getCurrentUser: state => state.currentUser
};

export default {
  state,
  mutations,
  actions,
  getters
};
  

import axios from 'axios';
import CustomizedAxios from '../services/axios';

const state = {
  houseKeeping: [],
};

const mutations = {
  SET_HOUSEKEEPING(state, houseKeeping) {
    state.houseKeeping = houseKeeping;
  },
};

const actions = {
  updateHouseKeeping({ commit }, houseKeeping) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("/housekeeping/update", houseKeeping)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchHouseKeeping({ commit }) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.get("housekeeping/getHouseKeeping")
        .then((response) => {
          commit("SET_HOUSEKEEPING", response.data.payload);
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  addHouseKeeping({ commit }, houseKeeping) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("housekeeping/add", houseKeeping)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deleteHouseKeeping({ commit }, houseKeeping) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("housekeeping/delete", houseKeeping)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

};
const getters = {
  getHouseKeeping: state => state.houseKeeping,
};

export default {
  state,
  mutations,
  actions,
  getters
};
  

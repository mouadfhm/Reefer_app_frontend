import CustomizedAxios from '../services/axios';

const state = {
    gates: [],
};

const mutations = {
    SET_GATES(state, gates) {
        state.gates = gates;
    },
};

const getters = {
    getGates: (state) => state.gates,
};

const actions = {
    fetchGatesIn({ commit }) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.get("/gate/in")
              .then((response) => {
                commit("SET_GATES", response.data.payload);
                resolve(response.data.payload);
              })
              .catch((error) => {
                reject(error);
              });
          });

    },
    fetchGatesOut({ commit }) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.get("/gate/out")
              .then((response) => {
                commit("SET_GATES", response.data.payload);
                resolve(response.data.payload);
              })
              .catch((error) => {
                reject(error);
              });
          });

    },
};

export default {
    state,
    mutations,
    getters,
    actions,    
};

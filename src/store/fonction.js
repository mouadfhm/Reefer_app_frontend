import { getFonctions } from '@/services/auth';
import CustomizedAxios from '../services/axios';

const state = {
    fonctions: [],
};

const mutations = {
    SET_FONCTIONS(state, fonctions) {
        state.fonctions = fonctions;
    },
};

const getters = {
    getFonctions: (state) => state.fonctions,
};

const actions = {
    fetchFonctions({ commit }) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.get("/fonction/")
              .then((response) => {
                commit("SET_FONCTIONS", response.data.payload);
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

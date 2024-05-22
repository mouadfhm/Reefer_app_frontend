import Vessels from '@/components/Vessels.vue';
import CustomizedAxios from '../services/axios';

const state = {
    Vessels: [],
};

const mutations = {
    SET_VESSELS(state, Vessels) {
        state.Vessels = Vessels;
    },
};

const getters = {
    getVessels: (state) => state.Vessels,
};

const actions = {
    fetchVessels({ commit }) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.get("/vessel/")
              .then((response) => {
                commit("SET_VESSELS", response.data.payload);
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

import Vessels from '@/components/Vessels.vue';
import CustomizedAxios from '../services/axios';

const state = {
    Vessels: [],
    selectedVessel: null,
};

const mutations = {
    SET_VESSELS(state, Vessels) {
        state.Vessels = Vessels;
    },

    SET_SELECTED_VESSEL(state, selectedVessel) {
        state.selectedVessel = selectedVessel;
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

    selectVessel({ commit }, selectedVessel) {
        commit("SET_SELECTED_VESSEL", selectedVessel);
    },
};

export default {
    state,
    mutations,
    getters,
    actions,    
};

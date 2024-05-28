import CustomizedAxios from '../services/axios';

const state = {
    discharges: [],
};

const mutations = {
    SET_DISCHARGES(state, discharges) {
        state.discharges = discharges;
    },
};

const getters = {
    getDischarges: (state) => state.discharges,
};

const actions = {
    fetchDischarges({ commit },vessel) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.post("/discharge/byvessel",vessel)
              .then((response) => {
                commit("SET_DISCHARGES", response.data.payload);
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

import CustomizedAxios from '../services/axios';

const state = {
    loads: [],
};

const mutations = {
    SET_LOADS(state, loads) {
        state.loads = loads;
    },
};

const getters = {
    getLoads: (state) => state.loads,
};

const actions = {
    fetchload({ commit },vessel) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.post("/load/byvessel",vessel)
              .then((response) => {
                commit("SET_LOADS", response.data.payload);
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

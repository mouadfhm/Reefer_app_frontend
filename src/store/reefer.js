import CustomizedAxios from '../services/axios';

const state = {
    reefers: [],
};

const mutations = {
    SET_REEFERS(state, reefers) {
        state.reefers = reefers;
    },
};

const getters = {
  getReefers: (state) => state.reefers,
};

const actions = {

    fetchReefers({ commit }) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.get("/reefers")
              .then((response) => {
                commit("SET_REEFERS", response.data.payload);
                resolve(response.data.payload);
              })
              .catch((error) => {
                reject(error);
              });
          });
    },
    changeStatus({ commit }, reefer) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.post("/reefers/changestatus", reefer)
              .then((response) => {
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

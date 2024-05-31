import CustomizedAxios from '../services/axios';

const state = {
    actionHistory: [],
};

const mutations = {
    SET_ACTIONHISTORY(state, actionHistory) {
        state.actionHistory = actionHistory;
    },
};

const getters = {
    getactionHistory: (state) => state.actionHistory,
};

const actions = {
    addActionHistory({ commit },data) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.post("/actions/add", data)
              .then((response) => {
                resolve(response.data.payload);
              })
              .catch((error) => {
                reject(error);
              });
          });

    },
    addActionHistoryHouseKeeping({ commit },data) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.post("/actions/addHouseKeeping", data)
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

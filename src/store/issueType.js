import CustomizedAxios from '../services/axios';

const state = {
    issueTypes: [],
};

const mutations = {
    SET_ISSUETYPES(state, issueTypes) {
        state.issueTypes = issueTypes;
    },
};

const getters = {
    getIssueTypes: (state) => state.issueTypes,
};

const actions = {
    fetchIssueTypes({ commit }) {
        return new Promise((resolve, reject) => {
            CustomizedAxios.get("/issue-type/")
              .then((response) => {
                commit("SET_ISSUETYPES", response.data.payload);
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

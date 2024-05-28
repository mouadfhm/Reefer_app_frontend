import CustomizedAxios from "../services/axios";

const state = {
  issues: [],
};

const mutations = {
  SET_ISSUES(state, issues) {
    state.issues = issues;
  },
};

const getters = {
  getissues: (state) => state.issues,
};

const actions = {
  repportIssue({ commit }, issue) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("/issues/add", issue)
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

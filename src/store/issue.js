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
  fetchIssues({ commit }) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.get("/issues/")
        .then((response) => {
          commit("SET_ISSUES", response.data.payload);
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
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
  deleteIssue({ commit }, issue) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("/issues/delete", issue)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  issueFixedMail({ commit }, issue) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("/issues/issueFixedMail", issue)
        .then((response) => {
          resolve(response.data.payload);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  firstTierIssue({ commit }, issue) {
    return new Promise((resolve, reject) => {
      CustomizedAxios.post("/issues/firstTier", issue)
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

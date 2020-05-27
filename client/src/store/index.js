import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isLoggedIn: false,
    isAdministrator: false,
    organisationTheme: "#010a43",
    userName: "Wayne Bruton",
    userID: null,
    organisationName: "",
    organisationID: null,
    country: "",
    documentID: null,
    documentName: "",
    documentURL: "",
    documentRead: true,
    documentType: "",
    usersAvailable: 0,
    usageAvailable: 0,
    hasExpired: false,
    isProducedReport: false,
    userIsEmployee: null,

    policies_documentItems: [],
    policies_allDocuments: [],
    policies_allStaff: 0,

    employees_documentItems: [],
    employees_allDocuments: [],
    // employees_allStaff: 0,
    dashboardArray: []
  },
  mutations: {
    logout(state) {
      state.isLoggedIn = false;
      state.isAdministrator = false;
      state.userName = "";
      state.organisationName = "";
      state.organisationID = null;
      state.country = "";
      state.userID = null;
      state.userIsEmployee = null;
    },
    login(state, criteria) {
      state.isLoggedIn = true;
      if (criteria.userType === 1) {
        state.isAdministrator = true;
      } else {
        state.isAdministrator = false;
      }
      state.organisationID = criteria.organisationID;
      state.organisationName = criteria.organisationName;
      state.userName = `${criteria.fname} ${criteria.lname}`;
      state.userID = criteria.userID;
      state.country = criteria.country;
      state.userIsEmployee = criteria.userIsEmployee;
    },
    viewdoc(state, criteria) {
      state.documentID = criteria.id;
      state.documentName = criteria.documentName;
      if (criteria.policyRead) {
        state.documentRead = criteria.policyRead;
      } else {
        state.documentRead = false;
      }
      state.documentRead = criteria.policyRead;
      state.documentURL = criteria.documentURL;
      state.documentType = criteria.documentType;
    },
    viewReport(state, criteria) {
      state.documentName = criteria.documentName;
      state.documentURL = criteria.documentURL;
      state.isProducedReport = criteria.isProducedReport;
    },
    availableAdditions(state, criteria) {
      state.usersAvailable = criteria.usersAvailable;
      state.usageAvailable = criteria.usageAvailable;
      state.hasExpired = criteria.hasExpired;
    },
    updateOrganisationName(state, criteria) {
      state.organisationName = criteria.organisationName;
      state.country = criteria.country;
    },
    changeTheme(state, criteria) {
      state.organisationTheme = criteria.organisationTheme;
    },
    country(state, criteria) {
      state.country = criteria.country;
    },
    dashboardArray(state, criteria) {
      state.dashboardArray = criteria;
    },
    policiesAllDocuments(state, criteria) {
      state.policies_allDocuments = criteria;
    },
    policiesDocumentItems(state, criteria) {
      state.policies_documentItems = criteria;
    },
    policiesAllStaff(state, criteria) {
      state.policies_allStaff = criteria;
    },
    employeesAllDocuments(state, criteria) {
      state.employees_allDocuments = criteria;
    },
    employeesDocumentItems(state, criteria) {
      state.employees_documentItems = criteria;
    }
    // employeesAllStaff(state, criteria) {
    //   state.employees_allStaff = criteria;
    // }
  },
  actions: {
    logout({ commit }) {
      commit("logout");
    },
    login({ commit }, criteria) {
      commit("login", criteria);
    },
    viewdoc({ commit }, criteria) {
      commit("viewdoc", criteria);
    },
    viewReport({ commit }, criteria) {
      commit("viewReport", criteria);
    },
    availableAdditions({ commit }, criteria) {
      commit("availableAdditions", criteria);
    },
    updateOrganisationName({ commit }, criteria) {
      commit("updateOrganisationName", criteria);
    },
    changeTheme({ commit }, criteria) {
      commit("changeTheme", criteria);
    },
    country({ commit }, criteria) {
      commit("country", criteria);
    },
    dashboardArray({ commit }, criteria) {
      commit("dashboardArray", criteria);
    },
    policiesDocumentItems({ commit }, criteria) {
      commit("policiesDocumentItems", criteria);
    },
    policiesAllDocuments({ commit }, criteria) {
      commit("policiesAllDocuments", criteria);
    },
    policiesAllStaff({ commit }, criteria) {
      commit("policiesAllStaff", criteria);
    },
    employeesDocumentItems({ commit }, criteria) {
      commit("employeesDocumentItems", criteria);
    },
    employeesAllDocuments({ commit }, criteria) {
      commit("employeesAllDocuments", criteria);
    }
    // employeesAllStaff({ commit }, criteria) {
    //   commit("employeesAllStaff", criteria);
    // }
  },
  modules: {}
});

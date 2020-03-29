import Api from "@/services/Api";

export default {
  register(credentials) {
    return Api().post(`/register`, credentials);
  },
  checkOrgName(credentials) {
    return Api().put(`/checkOrgName`, credentials);
  },
  checkOrgEmail(credentials) {
    return Api().put(`/checkOrgEmail`, credentials);
  },
  checkUserEmail(credentials) {
    return Api().put(`/checkUserEmail`, credentials);
  },
  login(credentials) {
    return Api().put(`/login`, credentials);
  },
  firstLogin(credentials) {
    return Api().put(`/firstlogin`, credentials);
  },
  getOrgData(credentials) {
    return Api().put(`/getOrgData`, credentials);
  },
  policiesAndStaffTypes(credentials) {
    return Api().put(`/policiesAndStaffTypes`, credentials);
  },
  staffTypes(credentials) {
    return Api().put(`/staffTypes`, credentials);
  },
  uploadfile(credentials) {
    return Api().post(`/uploadfile`, credentials);
  },
  deletePolicyFromCategory(credentials) {
    return Api().put(`/deletePolicyFromCategory`, credentials);
  },
  deletePolicy(credentials) {
    return Api().put(`/deletePolicy`, credentials);
  },
  createUser(credentials) {
    return Api().post(`/createUser`, credentials);
  },
  getEmployeesDocumentTypesAndDocuments(credentials) {
    return Api().put(`/getEmployeesDocumentTypesAndDocuments`, credentials);
  },
  getEmployees(credentials) {
    return Api().put(`/getEmployees`, credentials);
  },
  uploadEmployeefile(credentials) {
    return Api().post(`/uploadEmployeefile`, credentials);
  },
  viewDoc(credentials) {
    return Api().put(`/viewDoc`, credentials);
  },
  removeDoc(credentials) {
    return Api().put(`/removeDoc`, credentials);
  },
  deleteDocument(credentials) {
    return Api().put(`/deleteDocument`, credentials);
  },
  createOTP(credentials) {
    return Api().put(`/createOTP`, credentials);
  },
  getEmployeesToEdit(credentials) {
    return Api().put(`/getEmployeesToEdit`, credentials);
  },
  getEmployeeToEdit(credentials) {
    return Api().put(`/getEmployeeToEdit`, credentials);
  },
  editEmployee(credentials) {
    return Api().put(`/editEmployee`, credentials);
  },
  deleteEmployee(credentials) {
    return Api().put(`/deleteEmployee`, credentials);
  },
  getStaffTypes(credentials) {
    return Api().put(`/getStaffTypes`, credentials);
  },
  editStaffType(credentials) {
    return Api().put(`/editStaffType`, credentials);
  },
  deleteStaffType(credentials) {
    return Api().put(`/deleteStaffType`, credentials);
  },
  addStaffType(credentials) {
    return Api().post(`/addStaffType`, credentials);
  },
  getDocumentTypes(credentials) {
    return Api().put(`/getDocumentTypes`, credentials);
  },
  editDocumentType(credentials) {
    return Api().put(`/editDocumentType`, credentials);
  },
  addDocumentType(credentials) {
    return Api().post(`/addDocumentType`, credentials);
  },
  deleteDocumentType(credentials) {
    return Api().put(`/deleteDocumentType`, credentials);
  },
  getEmployeeDocuments(credentials) {
    return Api().put(`/getEmployeeDocuments`, credentials);
  },
  postPolicyRead(credentials) {
    return Api().put(`/postPolicyRead`, credentials);
  },
  getOrganisationStatistics(credentials) {
    return Api().put(`/getOrganisationStatistics`, credentials);
  },
  getPackages(credentials) {
    return Api().put(`/getPackages`, credentials);
  },
  getCountry(credentials) {
    return Api().put(`/getCountry`, credentials);
  },
  exchangeRate() {
    return Api().get(`/exchangeRate`);
  },
  usageThusFar(credentials) {
    return Api().put(`/usageThusFar`, credentials);
  },
  getOrganisationDetails(credentials) {
    return Api().put(`/getOrganisationDetails`, credentials);
  },
  updateOrganisationDetails(credentials) {
    return Api().put(`/updateOrganisationDetails`, credentials);
  },
  getUser(credentials) {
    return Api().put(`/getUser`, credentials);
  },
  contactform(credentials) {
    return Api().put(`/contactform`, credentials);
  },
  getTheme(credentials) {
    return Api().put(`/getTheme`, credentials);
  },
  updateTheme(credentials) {
    return Api().put(`/updateTheme`, credentials);
  },
  emailPolicies(credentials) {
    return Api().put(`/emailPolicies`, credentials);
  },
  emailDocuments(credentials) {
    return Api().put(`/emailDocuments`, credentials);
  },
  emailIndividual(credentials) {
    return Api().put(`/emailIndividual`, credentials);
  },
  printGlobalReport(credentials) {
    return Api().put(`/printGlobalReport`, credentials);
  },
  removeReport(credentials) {
    // console.log(credentials)
    return Api().put(`/removeReport`, credentials);
  },
  printIndividualReport(credentials) {
    // console.log(credentials)
    return Api().put(`/printIndividualReport`, credentials);
  },
  createSignature(credentials) {
    // console.log(credentials);
    return Api().put(`/createSignature`, credentials);
  }
};

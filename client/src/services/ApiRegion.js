import axios from "axios";

export default () => {
  axios.defaults.headers.common["Authorization"] = `Header:`;
  
  return axios.create({
    baseURL: process.env.VUE_APP_REGIONURL
  });
};

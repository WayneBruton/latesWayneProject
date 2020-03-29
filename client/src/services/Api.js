import axios from "axios";

export default () => {
  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
      return parts
        .pop()
        .split(";")
        .shift();
  }
  // console.log("cookie by name", getCookie("token"))
  let token = getCookie("token");
  axios.defaults.headers.common["Authorization"] = `${token}`;

  return axios.create({
    baseURL: process.env.VUE_APP_BASEURL
  });
};

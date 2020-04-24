import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import vueCountryRegionSelect from "vue-country-region-select";
import VueTelInput from "vue-tel-input";
import VueCookies from "vue-cookies";
import FlagIcon from "vue-flag-icon";
import UsageStats from "./plugins/usageStats";
import VueMeta from "vue-meta";
import VueYoutube from "vue-youtube";
import CountryFlag from "vue-country-flag";
import MyPlugin from "./plugins/usageStats";
import VueMask from "v-mask";
// import "vue-country-code/dist/vue-country-code.css";
import VueCountryCode from "vue-country-code";

Vue.use(VueCountryCode);

Vue.use(VueMask);

Vue.use(VueYoutube, VueMeta);
// Vue.use(VueMeta);
Vue.use(UsageStats);
Vue.use(FlagIcon);
Vue.use(MyPlugin);

Vue.component("country-flag", CountryFlag);
Vue.use(require("vue-moment"));
Vue.use(VueCookies);

Vue.use(VueTelInput);
Vue.use(vueCountryRegionSelect);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

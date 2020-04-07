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

// import moment from "vue-moment"
// Vue.use(moment);
Vue.use(VueMeta);
Vue.use(UsageStats);
Vue.use(FlagIcon);
Vue.use(MyPlugin);
import CountryFlag from "vue-country-flag";
import MyPlugin from "./plugins/usageStats";

Vue.component("country-flag", CountryFlag);
// import 'vue-loaders/dist/vue-loaders.css';
// import VueLoaders from 'vue-loaders';

// Vue.component('vue-loader', VueLoaders.component);
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

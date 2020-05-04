import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import vueCountryRegionSelect from "vue-country-region-select";
import VueTelInput from "vue-tel-input";
import VueCookies from "vue-cookies";
import UsageStats from "./plugins/usageStats";
import VueMeta from "vue-meta";
import VueYoutube from "vue-youtube";
import MyPlugin from "./plugins/usageStats";
import VueMask from "v-mask";
import VueCountryCode from "vue-country-code";

Vue.use(VueCountryCode);

Vue.use(VueMask);

Vue.use(VueYoutube);
Vue.use(VueMeta);
Vue.use(UsageStats);
Vue.use(MyPlugin);
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

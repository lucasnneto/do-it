import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";
Vue.use(VueToast);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");

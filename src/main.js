import "bootstrap/dist/css/bootstrap.css";
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

import "bootstrap/dist/js/bootstrap.bundle.js";

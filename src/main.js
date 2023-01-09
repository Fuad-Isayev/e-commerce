import "bootstrap/dist/css/bootstrap.css";
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import ImageKit from "imagekitio-vue";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(ImageKit, {
  urlEndpoint: "https://ik.imagekit.io/f5u3a9d5/e-commerce", 
  publicKey: "public_5HH32QFql1p4RXdrfvfsgInUnPE=", 
  authenticationEndpoint: "https://my-e-commerce-backend.vercel.app/auth" 
});

require('./prototypeMethods');

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

import "bootstrap/dist/js/bootstrap.bundle.js";

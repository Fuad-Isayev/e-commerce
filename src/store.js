import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const options = {
    state: {
        screenWidth: window.innerWidth
    },
    getters: {
        isMobile(state) {
             return state.screenWidth < 1264
        }
    }
}

export default new Vuex.Store(options);
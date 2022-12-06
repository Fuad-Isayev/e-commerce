import Vue from "vue";
import Vuex from "vuex";
import firebase from "../firebase";

Vue.use(Vuex);

const options = {
    state: {
        screenWidth: window.innerWidth,
        categories: [],
    },
    getters: {
        isMobile(state) {
             return state.screenWidth < 1264
        }
    },
    actions: {
        async getCategories({state}) {
            const response = await firebase.get('/categories.json');
            if (response.data) {
                let keys = Object.keys(response.data);
                let categories = keys.map(key => {
                    return { ...response.data[key], id: key };
                })
                state.categories = categories;
            } else {
                state.categories = [];
            }
        }
    }
}

export default new Vuex.Store(options);
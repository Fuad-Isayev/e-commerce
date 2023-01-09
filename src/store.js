import Vue from "vue";
import Vuex from "vuex";
import firebase from "../firebase";

Vue.use(Vuex);

const options = {
    state: {
        screenWidth: window.innerWidth,
        categories: [],
        items: [],
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
                let subkeys = keys.reduce((a, key) => ({...a, [key] :
                    Object.keys(response.data[key].subcategories)}), {}
                );

                let categories = keys.reduce((a, key) => 
                    ({ ...a, [key]: { ...response.data[key], id: key, 
                        subcategories : subkeys[key].reduce((b, subkey) => 
                            ({...b, [subkey]: {...response.data[key].subcategories[subkey],
                                id:subkey, categoryId: key}
                            }), {})}
                    }), {});
                state.categories = categories;
            } else {
                state.categories = [];
            }
        },
        async loadItems({state}, payload) {
            const response = await firebase.get(`/items/${payload.cat}/${payload.subcat}.json`);
            if (response.data) {
                let keys = Object.keys(response.data);
                let items = keys.map(key => {
                    return { ...response.data[key], id: key };
                })
                state.items = items;
            } else {
                state.items = [];
            }
        }
    }
}

export default new Vuex.Store(options);
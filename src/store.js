import Vue from "vue";
import Vuex from "vuex";
import firebase from "../firebase";

Vue.use(Vuex);

const options = {
    state: {
        screenWidth: window.innerWidth,
        categories: [],
        items: [],
        itemsInCart: {},
        cartItemsCount: 0,
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
        },
        async addToCart({state, dispatch}, item) {
            if (Object.keys(state.itemsInCart).includes(item.id)) {
                dispatch('incrementCartItem', item.id)
            } else {
            await firebase.put(`/cart/${item.id}.json`, item);
            await firebase.put(`/cart/${item.id}/amount.json`, 1);
            dispatch('loadCartItems');
            }
        },
        async deleteFromCart({dispatch}, id){
            await firebase.delete(`/cart/${id}.json`);
            dispatch('loadCartItems');
        },
        async loadCartItems({state, dispatch}){
            const response = await firebase.get('/cart.json');
            if(response.data) {
                state.itemsInCart = response.data;
            } else {
                state.itemsInCart = [];
            }
            dispatch('countCartItems')
        },
        async incrementCartItem({state, dispatch}, id) {
            await firebase.put(`/cart/${id}/amount.json`, state.itemsInCart[id].amount + 1);
            dispatch('loadCartItems');
        },
        async decrementCartItem({state, dispatch}, id) {
            await firebase.put(`/cart/${id}/amount.json`, state.itemsInCart[id].amount - 1);
            dispatch('loadCartItems');
        },
        countCartItems({state}) {
            state.cartItemsCount = 0;
            Object.keys(state.itemsInCart).forEach((item) => {
                state.cartItemsCount += state.itemsInCart[item].amount;
            })
        }
    }
}

export default new Vuex.Store(options);
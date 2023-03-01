import Vue from "vue";
import Vuex from "vuex";
import firebase from "../firebase";
import router from "./router";

Vue.use(Vuex);

const options = {
    state: {
        screenWidth: window.innerWidth,
        categories: [],
        subcategories: [],
        items: [],
        cartItems: {},
        wishlistItems: {},
        cartItemsCount: 0,
        cartTotalPrice: 0,
        selectedItemID: '',
        filteredItems: [],
        selectedSubcategory: null,
        filterOptions: {},
        queryOptions: {},
    },
    getters: {
        isMobile(state) {
             return state.screenWidth < 1264;
        },
        wishlistItemsCount(state) {
            return Object.keys(state.wishlistItems).length;
        },
        selectedFilterOptions(state) {
            const query1 = router.history.current.query;
            let query = state.queryOptions;
            query = {...query,...query1};
            const options = Object.keys(state.filterOptions);
            const selectedOptions = Object.keys(query).filter(q => options.some(o => o === q));
            return selectedOptions.reduce((acc, current) => {
                    return {...acc, [current]: query[current] ? query[current].split(',') : []}
            }, {});
        }
    },
    mutations: {
        selectItem(state, payload) {
            state.selectedItemID = payload;
        },
        sortByPriceAscending(state) {
            state.items.sort((a,b) => a.price - b.price);
            state.filteredItems.sort((a,b) => a.price - b.price);
        },
        sortByPriceDescending(state) {
            state.items.sort((a,b) => b.price - a.price);
            state.filteredItems.sort((a,b) => b.price - a.price);
        },
        filterItems(state, payload) {
            if(payload.subcategory) {
                let subcategory = state.subcategories.find(subcat => subcat.query === payload.subcategory);
                state.filteredItems = state.items.filter(i => i.subcategoryID === subcategory.id)
            }
            if(payload.filter) {
                state.filteredItems = state.filteredItems.filter((item) => {
                    return Object.keys(payload.filter).every((key) => {
                        const filterValue = payload.filter[key];
                        const itemValue = item.specifications[key];
                        console.log('filterValue, itemValue ', filterValue, itemValue)
                        if (filterValue.length > 0) {
                            if (Array.isArray(filterValue)) {
                                if(key === "color"){
                                    return filterValue.some((value) => itemValue.map((val) => val.hex)?.includes(value) || itemValue?.includes(value));
                                }else{
                                    return filterValue.some((value) => itemValue?.includes(value)); 
                                    }
                                } else {
                                return itemValue === filterValue;
                            }
                        } else {
                            return true
                        }
                    });
                });
            }
        },
        getFilterOptions(state){
            let options = {};
            state.filteredItems.forEach((i) => {
                Object.keys(i.specifications).forEach((spec) => {
                    if (!options[spec]) {
                        options[spec] = []
                    }
                    if (typeof i.specifications[spec] === "string") {
                        if (!options[spec].includes(i.specifications[spec])) {
                            options[spec].push(i.specifications[spec])
                        }
                    } else {
                        i.specifications[spec].forEach((value) => {
                            if (!options[spec].includes(value)) {
                                if(spec === "color" && typeof value !== "string") {
                                    options[spec].push(value.hex);
                                }
                                else{
                                    options[spec].push(value)
                                }
                            }
                        })
                    }
                })
            })
            state.filterOptions = options;
        },
        updateQueryOptions(state,payload) {
            state.queryOptions = payload
        }
    },
    actions: {
        async getCategories({state}) {  
            const response = await firebase.get('/categories.json');
            let keys = Object.keys(response.data);
            state.categories = keys.map(key => {
                return {...response.data[key], id: key}
            });
        },
        async getSubcategories({state, commit, getters}){
            const response = await firebase.get('/subcategories.json');
            let keys =  Object.keys(response.data);
            state.subcategories = keys.map(key => {
                return {...response.data[key], id: key}
            });

            if(router.history.current.params.subcategory) {
                commit('filterItems', { subcategory: router.history.current.params.subcategory})
                commit('getFilterOptions');
            }

            const filter = getters.selectedFilterOptions;
            if(Object.values(filter).some((f) => f[0] && f[0].length > 0)) {
                commit('filterItems', { filter: filter})
            }
        },
        async loadAllItems({state, commit}){
            const response = await firebase.get('/items.json');
            if (response.data) {
                let keys = Object.keys(response.data);
                let items = keys.map(key => {
                    return { ...response.data[key], id: key };
                })
                state.items = Object.values(items);
                if(router.history.current.query.sbp === "PRICE_ASCEND"){
                    commit('sortByPriceAscending')
                }
                if(router.history.current.query.sbp === "PRICE_DESCEND"){
                    commit('sortByPriceDescending')
                }

                
            } else {
                state.items = [];
            }
        },
        async addToCart({state, dispatch}, item) {
            if (Object.keys(state.cartItems).includes(item.id)) {
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
                state.cartItems = response.data;
            } else {
                state.cartItems = {};
            }
            dispatch('countCartItems')
        },
        async loadWishlistItems({state, dispatch}){
            const response = await firebase.get('/wishlist.json');
            if(response.data) {
                state.wishlistItems = response.data;
            } else {
                state.wishlistItems = {};
            }
            dispatch('countCartItems')
        },
        async incrementCartItem({state, dispatch}, id) {
            await firebase.put(`/cart/${id}/amount.json`, state.cartItems[id].amount + 1);
            dispatch('loadCartItems');
        },
        async decrementCartItem({state, dispatch}, id) {
            await firebase.put(`/cart/${id}/amount.json`, state.cartItems[id].amount - 1);
            dispatch('loadCartItems');
        },
        countCartItems({state}) {
            state.cartItemsCount = 0;
            state.cartTotalPrice = 0;
            Object.keys(state.cartItems).forEach((item) => {
                state.cartItemsCount += state.cartItems[item].amount;
                state.cartTotalPrice += Number(state.cartItems[item].price) * state.cartItems[item].amount;
            })
        },
        async addToWishlist({state, dispatch}, item) {
            if (Object.keys(state.wishlistItems).includes(item.id)) {
                return
            } else {
                await firebase.put(`/wishlist/${item.id}.json`, item);
                await firebase.put(`/items/${item.id}/inWishlist.json`, true);
                dispatch('loadWishlistItems');
                const selectedItem = state.items.find(i => i.id === item.id);
                selectedItem.inWishlist = true;
                
            }
        },
        async deleteFromWishlist({ state, dispatch},id){
            await firebase.delete(`/wishlist/${id}.json`);
            await firebase.put(`/items/${id}/inWishlist.json`, false);
            dispatch('loadWishlistItems');
            const selectedItem = state.items.find(i => i.id === id);
            selectedItem.inWishlist = false;
        }
    }
}

export default new Vuex.Store(options);
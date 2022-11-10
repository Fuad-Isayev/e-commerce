import Vue from 'vue';
import Router from "vue-router";
import Shop from "./views/Shop";
import Admin from "./views/Admin/Admin";
import ManageProducts from './views/Admin/ManageProducts';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            name: "Shop",
            component: Shop,
        },
        {
            path: "/admin",
            name: "Admin",
            component: Admin,
        },
        {
            path: "/manage",
            name: "Manage Products",
            component: ManageProducts,
        }
    ]
})
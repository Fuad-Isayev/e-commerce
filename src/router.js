import Vue from 'vue';
import Router from "vue-router";
import Shop from "./views/Shop";
import Admin from "./views/Admin/Admin";
import ManageProducts from './views/Admin/ManageProducts';
import ManageSpecifications from './views/Admin/ManageSpecifications';

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
            path: "/admin/manage-products",
            name: "Manage Products",
            component: ManageProducts,
        },
        {
            path: "/admin/manage-specs",
            name: "Manage Specifications",
            component: ManageSpecifications,
        }
    ]
})
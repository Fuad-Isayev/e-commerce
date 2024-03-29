import Vue from 'vue';
import Router from "vue-router";
// import Shop from "./views/Shop";
import Admin from "./views/Admin/Admin";
import Product from "./views/Product";
import ManageProducts from './views/Admin/ManageProducts';
import ManageCategories from './views/Admin/ManageCategories';
import ManageSpecifications from './views/Admin/ManageSpecifications';
import Cart from './views/Cart';
import Wishlist from './views/Wishlist';
import Catalog from './views/Catalog';
import CategoryList from './views/CategoryList';
import Home from './views/Home';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/" ,
            name: "Home",
            component: Home,
        },
        {
            path: "/products/:id",
            name: "Product",
            component: Product,
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
            path: "/admin/manage-categories",
            name: "Manage Categories",
            component: ManageCategories,
        },
        {
            path: "/admin/manage-specs",
            name: "Manage Specifications",
            component: ManageSpecifications,
        },
        {
            path: "/cart",
            name: "Cart",
            component: Cart,
        },
        {
            path: "/wishlist",
            name: "Wishlist",
            component: Wishlist,
        },
        {
            path: "/catalog/:category/:subcategory",
            name: "Catalog",
            component: Catalog,
        },
        {
            path: "/catalog/:category",
            name: "CategoryList",
            component: CategoryList,
        },
    ]
})
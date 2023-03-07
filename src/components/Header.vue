<template>
    <div>
        <v-container>
            <v-row class="align-center mt-sm-n8">
                <v-col cols="2" md="3">
                    <v-avatar v-show="!isMobile" rounded width="150">
                        <v-img class="logo" @click="goHome()" src="../assets/logo.png">
                        </v-img>
                    </v-avatar>
                    <NavigationDrawer class="d-inline ml-1" />
                </v-col>
                <v-col cols="4" md="6">
                    <v-autocomplete ref="autocomplete" class="pt-7" v-if="!isMobile" v-model="model" :items="items"
                        :menu-props="menu" :search-input.sync="search" :loading="isLoading" item-text="name" item-value="id"
                        label="Search for a product..." solo>
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-icon class="mr-2">mdi-magnify</v-icon>
                                <v-list-item-title>
                                    Search for your
                                    <strong>Product</strong>
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                        <template v-slot:item="{ item }">
                            <v-list-item @click="selectProduct(item)">
                                <v-list-item-avatar tile>
                                    <v-img :src="item.imgURL.original + '/tr:w-100'"></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.name }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                    <v-avatar v-if="isMobile" rounded width='130px'>
                        <v-img class="logo" @click="goHome()" src="../assets/logo.png">
                        </v-img>
                    </v-avatar>
                </v-col>
                <v-col cols="6" md="3" class="d-flex justify-end">
                    <v-btn v-if="!isMobile" class="mr-1 ml-2">
                        <v-icon>mdi-account-outline</v-icon>
                    </v-btn>
                    <v-btn @click="$router.push('/wishlist')" class="mr-2 ml-1">
                        <v-badge color="#077c8c" :content="wishlistItemsCount || '0'">
                            <v-icon>mdi-heart-outline</v-icon>
                        </v-badge>
                    </v-btn>
                    <v-btn @click="$router.push('/cart')">
                        <v-badge color="#077c8c" :content="cartItemsCount">
                            <v-icon>mdi-cart-outline</v-icon>
                        </v-badge>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-if="isMobile">
                <v-autocomplete class="px-3" ref="autocomplete" v-model="model" :items="items" :menu-props="menu"
                    :search-input.sync="search" :loading="isLoading" item-text="name" item-value="id"
                    label="Search for a product..." solo>
                    <template v-slot:no-data>
                        <v-list-item>
                            <v-icon class="mr-2">mdi-magnify</v-icon>
                            <v-list-item-title>
                                Search for your
                                <strong>Product</strong>
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                    <template v-slot:item="{ item }">
                        <v-list-item @click="selectProduct(item)">
                            <v-list-item-avatar tile>
                                <v-img :src="item.imgURL.original + '/tr:w-100'"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ item.name }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-autocomplete>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import NavigationDrawer from './NavigationDrawer.vue';
import firebase from "../../firebase";

export default {
    name: "Header",
    components: {
        NavigationDrawer,
    },
    data() {
        return {
            model: '',
            items: [],
            isLoading: false,
            search: '',
            menu: {
                closeOnClick: true,
                closeOnContentClick: true,
                disableKeys: true,
                openOnClick: false,
                maxHeight: 304,
                offsetY: true,
                offsetOverflow: true,
                transition: false
            }
        }
    },
    methods: {
        goHome() {
            if (this.$route.path !== "/" || Object.keys(this.$route.query).length > 0) {
                this.$router.push("/");
            }
        },
        selectProduct(item) {
            if (this.$route.params.id !== item.id) {
                this.$router.push(`/products/${item.id}`);
            }
        }
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
        cartItemsCount() {
            return this.$store.state.cartItemsCount || '0';
        },
        wishlistItemsCount() {
            return this.$store.getters.wishlistItemsCount;
        }
    },
    watch: {
        async search(val) {
            if (val && val.length > 1) {
                const resp = await firebase.get(`/items.json?orderBy="name"&startAt="${val.charAt(0).toUpperCase() + val.slice(1)}"`)
                this.items = Object.values(resp.data);
            }
        },
    }
}
</script>

<style>
.logo {
    cursor: pointer;
}

.logo:hover {
    opacity: .9;
    scale: 0.99;
}

.red {
    color: #710219
}
</style>
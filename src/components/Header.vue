<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="2" md="3">
                    <v-avatar v-show="!isMobile" rounded width='150px'>
                        <v-img class="logo" @click="goHome()" src="../assets/logo.png">
                        </v-img>
                    </v-avatar>
                    <NavigationDrawer class="d-inline" />
                </v-col>
                <v-col cols="4" md="6">
                    <v-autocomplete v-if="!isMobile" v-model="model" :items="items" :loading="isLoading"
                        :search-input.sync="search" chips clearable hide-details hide-selected item-text="name"
                        item-value="id" label="Search for a product..." solo>
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-icon class="mr-2">mdi-magnify</v-icon>
                                <v-list-item-title>
                                    Search for your
                                    <strong>Product</strong>
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                    <v-avatar v-if="isMobile" rounded class="ml-2" width='130px'>
                        <v-img class="logo" @click="goHome()" src="../assets/logo.png">
                        </v-img>
                    </v-avatar>
                </v-col>
                <v-col cols="6" md="3" class="d-flex align-items-center justify-end">
                    <!-- <v-btn class="mr-1 ml-2">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn> -->
                    <v-btn v-if="!isMobile" class="mr-1 ml-2">
                        <v-icon>mdi-account-outline</v-icon>
                    </v-btn>
                    <v-btn @click="$router.push('/wishlist')" class="mr-2 ml-1">
                        <v-badge color="#710219" :content="wishlistItemsCount || '0'">
                            <v-icon>mdi-heart-outline</v-icon>
                        </v-badge>
                    </v-btn>
                    <v-btn @click="$router.push('/cart')">
                        <v-badge color="#710219" :content="cartItemsCount">
                            <v-icon>mdi-cart-outline</v-icon>
                        </v-badge>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-if="isMobile">
                <v-autocomplete v-model="model" :items="items" :loading="isLoading" :search-input.sync="search" chips
                    clearable hide-details hide-selected item-text="name" item-value="id"
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
                </v-autocomplete>
            </v-row>
        </v-container>
        <v-divider></v-divider>
    </div>
</template>

<script>
import NavigationDrawer from './NavigationDrawer.vue';

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
        }
    },
    methods: {
        goHome() {
            if (this.$route.path !== "/") {
                this.$router.push("/");
            }
        }
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
        cartItemsCount() {
            return this.$store.state.cartItemsCount;
        },
        wishlistItemsCount() {
            return this.$store.state.wishlistItemsCount;
        }
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
<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="2" md="3">
                    <v-avatar v-show="!isMobile" rounded width='150px'>
                        <v-img class="logo" @click="goHome()" src="../assets/logo.png">
                        </v-img>
                    </v-avatar>
                    <v-app-bar-nav-icon @click="drawer = true" large class="ml-md-2">
                    </v-app-bar-nav-icon>
                    <v-navigation-drawer width="380px" v-model="drawer" absolute temporary>
                        <v-row class="mt-2">
                            <v-col cols="8">
                                <h4 class="ml-6">MENU</h4>
                            </v-col>
                            <v-col class="d-flex justify-end align-items-center pr-5" cols="4">
                                <v-icon color="#710219" large @click="drawer = false">mdi-close</v-icon>
                            </v-col>
                        </v-row>
                        <v-list nav dense>
                            <v-list-item-group v-model="group">
                                <v-list-item @click="goHome()">
                                    <v-list-item-icon>
                                        <v-icon>
                                            mdi-home
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        Home
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="$router.push('/admin')">
                                    <v-list-item-icon>
                                        <v-icon>
                                            mdi-account
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        Admin panel
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-navigation-drawer>
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
                    <v-btn v-if="isMobile" class="mr-1 ml-2">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn v-if="!isMobile" class="mr-1 ml-2">
                        <v-icon>mdi-account-outline</v-icon>
                    </v-btn>
                    <v-btn v-if="!isMobile" class="mr-2 ml-1">
                        <v-badge color="#710219" content="1">
                            <v-icon>mdi-heart-outline</v-icon>
                        </v-badge>
                    </v-btn>
                    <v-btn class="mr-md-2">
                        <v-badge color="#710219" content="2">
                            <v-icon>mdi-cart-outline</v-icon>
                        </v-badge>
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider color="black"></v-divider>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            model: '',
            items: [],
            isLoading: false,
            search: '',
            drawer: false,
            group: null,
        }
    },
    methods: {
        goHome() {
            if (this.$route.path !== "/") {
                this.$router.push("/");
            } else {
                this.drawer = false;
            }
        }
    },
    computed: {
        isMobile() {
            switch (this.$vuetify.breakpoint.name) {
                case "xs": case "sm": case "md": return true;
                default: return false;

            }
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
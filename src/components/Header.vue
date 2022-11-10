<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="2" sm="3">
                    <v-avatar v-show="!isMobile" rounded width='150px'>
                        <v-img class="logo" @click="goHome()" src="../assets/logo.png">
                        </v-img>
                    </v-avatar>
                    <v-app-bar-nav-icon large class="ml-sm-2">
                    </v-app-bar-nav-icon>
                </v-col>
                <v-col cols="4" sm="6">
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
                <v-col cols="6" sm="3" class="d-flex align-items-center justify-end">
                    <v-btn v-if="isMobile" class="mr-1 ml-2">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn @click="$router.push('/admin')" v-if="!isMobile" class="mr-1 ml-2">
                        <v-icon>mdi-account-outline</v-icon>
                    </v-btn>
                    <v-btn v-if="!isMobile" class="mr-2 ml-1">
                        <v-badge color="#710219" content="1">
                            <v-icon>mdi-heart-outline</v-icon>
                        </v-badge>
                    </v-btn>
                    <v-btn class="mr-sm-2">
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
        }
    },
    methods: {
        goHome() {
            this.$router.push("/")
        }
    },
    computed: {
        isMobile() {
            if (this.$vuetify.breakpoint.name === 'xs') {
                return true;
            } else return false;
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
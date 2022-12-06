<template>
    <div>
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
            <v-list class="mt-2">
                <v-list-item-group>
                    <v-list-item @click="(showCategories = !showCategories)">
                        <v-list-item-title>
                            <h4>Categories</h4>
                        </v-list-item-title>
                        <v-spacer></v-spacer>
                        <v-list-item-icon>
                            <v-icon :class="{ down: showCategories }">
                                mdi-chevron-right</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                    <transition name="slide-fade">
                        <Categories v-if="showCategories" />
                    </transition>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import Categories from "./Categories";

export default {
    name: "NavigationDrawer",
    components: {
        Categories,
    },
    data() {
        return {
            drawer: false,
            group: null,
            showCategories: true,
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
}
</script>

<style>
.slide-fade-enter-active {
    animation: slide .2s ease-out;
}

.slide-fade-leave-active {
    animation: slide .2s reverse ease-out;
}


@keyframes slide {
    0% {
        height: 1px;
        overflow: hidden;
    }

    100% {
        height: 200px;
        overflow: hidden;
    }
}

.down {
    transform: rotate(90deg)
}
</style>
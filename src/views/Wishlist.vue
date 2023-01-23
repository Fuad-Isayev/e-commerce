<template>
    <v-container>
        <v-row v-for="item, i in items" :key="i" class="align-center text-center">
            <!-- <v-col cols="6" sm="4" class="py-0" :class="!isMobile ? i % 3 ? 'pl-0 pr-1 ml-n1' : 'pl-0 pr-1' : ''"
                v-for="item, i in items" :key="item.id">
                <Items shop :item="item" />
            </v-col> -->
            <v-col cols="2">
                <v-img :max-width="isMobile ? 50 : 100" :src="item.imgURL"></v-img>
            </v-col>
            <v-col cols="4" sm="5">
                <p>{{ item.name }}</p>
            </v-col>
            <v-col>
                <v-btn @click="addToCart(item)" class="white--text" color="green" :small="isMobile">
                    Add To Cart</v-btn>
            </v-col>
            <v-col>
                <v-icon @click="deleteFromWishlist(item.id)">
                    mdi-trash-can-outline
                </v-icon>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    name: "Wishlist",
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
        items() {
            return this.$store.state.wishlistItems;
        }
    },
    methods: {
        deleteFromWishlist(id) {
            this.$store.dispatch('deleteFromWishlist', id);
        },
        addToCart(item) {
            this.$store.dispatch('addToCart', item);
        },
    }
}
</script>
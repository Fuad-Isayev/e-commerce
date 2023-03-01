<template>
    <v-container>
        <v-row v-for="item, i in items" :key="i" class="align-center text-center">
            <v-col cols="2">
                <v-img :max-width="isMobile ? 50 : 100" :src="item.imgURL.resized"></v-img>
            </v-col>
            <v-col cols="4">
                <p>{{ item.name }}</p>
            </v-col>
            <v-col cols="4">
                <v-btn @click="addToCart(item.id)" class="white--text" color="green" :small="isMobile">
                    Shop this Product</v-btn>
            </v-col>
            <v-col cols="2">
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
        addToCart(id) {
            this.$router.push(`/products/${id}`)
        },
    }
}
</script>

<style scoped>
.v-btn.v-size--small {
    font-size: 0.6rem;
}
</style>
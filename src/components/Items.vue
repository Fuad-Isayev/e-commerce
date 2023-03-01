<template>
    <div>
        <v-hover v-if="shop" v-slot:default="{ hover }">
            <v-card flat outlined tile class="" max-width="500">
                <div>
                    <v-img class="py-2" contain :src=item.imgURL.resized max-width="100%" max-height="100%">
                    </v-img>
                </div>
                <v-card-title class="font-weight-bold text-h6">
                    ${{ item.price }}
                </v-card-title>
                <v-card-title class="font-weight-bold text-h6 justify-space-between">
                    {{ item.name }}
                </v-card-title>
                <v-expand-transition>
                    <div v-if="hover"
                        class=" d-flex align-ceter text-center transition-fast-in-fast-out v-card--reveal white-text"
                        style="height: 100%">
                        <div class="">
                            <v-col cols='12'>
                                <v-btn @click="addToCart(item)" :small="isMobile" rounded color="white">
                                    <v-icon>mdi-cart-outline</v-icon>
                                    Buy
                                </v-btn>
                                <v-btn @click="addToWishlist(item)" fab :small="!isMobile" :x-small="isMobile" color="white"
                                    class="ml-2">
                                    <v-icon v-if="!item.inWishlist" color="black">mdi-heart-outline</v-icon>
                                    <v-icon v-if="item.inWishlist" color="#b20219">mdi-heart</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols='12'>
                                <v-btn @click="$router.push(`/products/${item.id}`)" rounded class="about-button">More
                                    about</v-btn>
                            </v-col>
                        </div>
                    </div>
                </v-expand-transition>
            </v-card>
        </v-hover>
        <v-card v-if="admin" class="mx-auto my-5 hover py-5" max-width="500">
            <div>
                <v-img contain max-width="100%" max-height="100%" :src=item.imgURL.resized>
                </v-img>
            </div>
            <v-card-title class="font-weight-bold text-h6">
                ${{ item.price }}
            </v-card-title>
            <v-card-title class="font-weight-bold text-subtitle-1 justify-space-between">
                {{ item.name }}
            </v-card-title>
            <v-card-actions class="d-flex justify-space-between">
                <v-btn text @click="$emit('edit-item', item)" color="green">
                    Edit
                </v-btn>
                <v-btn text @click="$emit('delete-item', item.id, item.imgID)" color="red">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>

export default {
    name: 'Items',
    props: {
        item: Object,
        shop: Boolean,
        admin: Boolean,
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
        cartItems() {
            return this.$store.state.cartItems;
        }
    },
    methods: {
        async addToCart(item) {
            this.$store.dispatch('addToCart', item);
        },
        addToWishlist(item) {
            if (!item.inWishlist) {
                this.$store.dispatch('addToWishlist', item);
                console.log('hover', this.hover);
                this.$set(item, 'inWishlist', true);
            } else {
                this.$store.dispatch('deleteFromWishlist', item.id);
                this.$set(item, 'inWishlist', false);
            }
        }
    }
}
</script>

<style>
.hover {
    box-shadow: none !important;
    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
}

.hover:hover {
    background: #fff;
    z-index: 2;
    box-shadow: 0 4px 15px 4px rgb(0 0 0 / 16%) !important;
}

.about-button {
    bottom: -100px;
}
</style>
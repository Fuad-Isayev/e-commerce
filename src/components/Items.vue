<template>
    <div>
        <v-hover v-slot:default="{ hover }">
            <v-card flat outlined tile v-if="shop" class="" max-width="500">
                <div>
                    <v-img contain :src=item.imgURL :max-width="isMobile ? '100%' : '290.25px'"
                        :max-height="isMobile ? '100%' : '290.25px'">
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
                                <v-btn fab :small="!isMobile" :x-small="isMobile" color="white" class="ml-2">
                                    <v-icon color="black">mdi-heart-outline</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols='12'>
                                <v-btn rounded class="about-button">More about</v-btn>
                            </v-col>
                        </div>
                    </div>
                </v-expand-transition>
            </v-card>
        </v-hover>
        <!-- <v-card v-if="admin" class="mx-auto my-5 hover py-5" max-width="500">
            <div style="height: 222.8px">
                <v-img max-width="222.8px" max-height="222.8px" :src=item.imgURL>
                </v-img>
            </div>
            <v-card-title class="font-weight-bold text-h6">
                ${{ item.price }}
            </v-card-title>
            <v-card-title class="font-weight-bold text-h6 justify-space-between">
                {{ item.name }}
                <v-btn @click="$emit('delete-item', item.id, item.imgID)" icon>
                    <v-icon color="red">
                        mdi-delete
                    </v-icon>
                </v-btn>
            </v-card-title>
        </v-card> -->
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
        itemsInCart() {
            return this.$store.state.itemsInCart;
        }
    },
    methods: {
        addToCart(item) {
            this.$store.dispatch('addToCart', item)
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
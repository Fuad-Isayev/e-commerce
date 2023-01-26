<template>
    <v-container>
        <h3 class="mb-5">
            Cart ({{ itemsCount }} {{ itemsCount > 1 ? 'items' : 'item' }})
        </h3>
        <v-row class="align-center text-center">
            <v-col cols="12" sm="10">
                <v-row class="align-center" v-for="item, i in items" :key="i">
                    <v-col cols="2">
                        <v-img :max-width="isMobile ? 50 : 100" :src="item.imgURL.resized"></v-img>
                    </v-col>
                    <v-col cols="4" sm="5">
                        <p>{{ item.name }}</p>
                    </v-col>
                    <v-col class="d-flex" cols="3" sm="2">
                        <div @click="item.amount !== 1 ? decrementCartItem(item.id) : ''" class="decrement-button"
                            :class="item.amount === 1 ? 'disabled' : ''">-</div>
                        <div class="amount">
                            {{ item.amount }}
                        </div>
                        <div @click="incrementCartItem(item.id)" class="increment-button ">+</div>
                        <v-overlay :value="loading" color="rgba(88, 120, 120, 0.63)">
                            Please wait
                            <v-progress-circular indeterminate size="32"></v-progress-circular>
                        </v-overlay>
                    </v-col>
                    <v-col cols="2">
                        <p class="m-0">
                            $ {{ item.price }}
                        </p>
                    </v-col>
                    <v-col class="p-0" cols="1">
                        <v-icon @click="deleteFromCart(item.id)">
                            mdi-trash-can-outline
                        </v-icon>
                    </v-col>
                </v-row>
            </v-col>
            <v-col class="cart-total" cols="12" sm="2">
                <h4>Cart Total:</h4>
                <h3 class="my-4"> $ {{ totalPrice }}</h3>
                <v-btn color="#a5042f" class="white--text">
                    Proceed
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    name: "Cart",
    data() {
        return {
            loading: false,
        }
    },
    computed: {
        items() {
            return this.$store.state.cartItems;
        },
        itemsCount() {
            return this.$store.state.cartItemsCount;
        },
        isMobile() {
            return this.$store.getters.isMobile;
        },
        totalPrice() {
            return this.$store.state.cartTotalPrice;
        }
    },
    methods: {
        deleteFromCart(id) {
            Swal.fire({
                title: 'Are you sure you want to delete this item from cart?',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: `Yes`,
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isDenied) {
                    this.$store.dispatch('deleteFromCart', id);
                    Swal.fire('Item deleted from cart!', '', 'success')
                }
            })
        },
        async incrementCartItem(id) {
            this.loading = true;
            await this.$store.dispatch('incrementCartItem', id)
            this.loading = false;
        },
        async decrementCartItem(id) {
            this.loading = true;
            await this.$store.dispatch('decrementCartItem', id)
            this.loading = false;
        }
    }
}
</script>

<style lang="scss">
@mixin button() {
    border: 1px solid #e6e6e6;
    background-color: #fafafa;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 35px;
    transition: .5s;
    color: lighten(#710219, 20%);

    &:hover:not(.disabled) {
        background-color: #e6e6e6;
        cursor: pointer;
    }

    &.disabled {
        cursor: context-menu;
        color: grey
    }
}

.amount {
    height: 35px;
    width: 45px;
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: center;
    align-items: center;
}

.decrement-button {
    @include button;
    border-radius: 5px 0 0 5px;
}

.increment-button {
    @include button;
    border-radius: 0 5px 5px 0;
}

.cart-total {
    border: 2px solid #d5042f;
    background-color: lighten(#160005, 90%);
}
</style>
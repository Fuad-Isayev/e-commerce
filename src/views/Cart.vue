<template>
    <v-container>
        <h3 class="mb-5">
            Cart ({{ itemsCount }} {{ itemsCount > 1 ? 'items' : 'item' }})
        </h3>
        <v-row v-for="item, i in items" :key="i">
            <v-col class="d-flex align-center" cols="2">
                <v-img :max-width="isMobile ? 50 : 100" :src="item.imgURL"></v-img>
            </v-col>
            <v-col class="d-flex align-center" cols="5">
                <p>{{ item.name }}</p>
            </v-col>
            <v-col class="d-flex align-center" cols="2">
                <div @click="item.amount !== 1 ? decrementCartItem(item.id) : ''" class="decrement-button"
                    :class="item.amount === 1 ? 'grey--text' : 'orange--text'" :disabled="item.amount === 1">-</div>
                <div class="amount">
                    {{ item.amount }}
                </div>
                <div @click="incrementCartItem(item.id)" class="increment-button orange--text">+</div>
            </v-col>
            <v-col class="d-flex align-center" cols="2">
                <p class="m-0">
                    $ {{ item.price }}
                </p>
            </v-col>
            <v-col class="d-flex align-center" cols="1">
                <v-icon @click="deleteFromCart(item.id)">
                    mdi-trash-can-outline
                </v-icon>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    name: "Cart",
    computed: {
        items() {
            return this.$store.state.itemsInCart;
        },
        itemsCount() {
            return this.$store.state.cartItemsCount;
        },
        isMobile() {
            return this.$store.getters.isMobile;
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
        incrementCartItem(id) {
            this.$store.dispatch('incrementCartItem', id)
        },
        decrementCartItem(id) {
            this.$store.dispatch('decrementCartItem', id)
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

    &:hover {
        background-color: #e6e6e6;
        cursor: pointer;
    }
}

.amount {
    height: 35px;
    width: 55px;
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
</style>
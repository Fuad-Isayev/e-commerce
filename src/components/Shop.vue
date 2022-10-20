<template>
    <div>
        <h1 class="centered">S H O P </h1>
        <div class="centered">
            <form @submit.prevent="handleSubmit">
                <v-text-field v-model="item.name" label="Name">
                </v-text-field>
                <v-text-field v-model="item.price" label="Price">
                </v-text-field>
                <v-btn @click="handleSubmit" class="btn btn-primary">Add item</v-btn>
            </form>
        </div>
        <v-container>
            <v-row>
                <v-col cols="6" v-for="item in items" :key="item.id">
                    <Items @delete-item="deleteItem" :id="item.id" :item="item" />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Items from './Items';
import axios from 'axios';

export default {
    name: "Shop",
    components: {
        Items,
    },
    data() {
        return {
            item: {
                name: '',
                price: '',
            },
            items: []
        }
    },
    created() {
        this.getItems();
    },
    methods: {
        async handleSubmit() {
            await axios.post('https://e-commerce-b33a7-default-rtdb.firebaseio.com/items.json', this.item);
            this.getItems();
        },
        async getItems() {
            const response = await axios.get('https://e-commerce-b33a7-default-rtdb.firebaseio.com/items.json');
            console.log(response);
            if (response.data) {
                let keys = Object.keys(response.data);
                let items = keys.map(key => {
                    return { ...response.data[key], id: key };
                })
                this.items = items;
            } else {
                this.items = []
            }

        },
        async deleteItem(id) {
            await axios.delete('https://e-commerce-b33a7-default-rtdb.firebaseio.com/items/' + id + '.json');
            this.getItems();
        }
    },
}
</script>

<style>
.centered {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
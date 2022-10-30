<template>
    <div>
        <h1 class="centered">S H O P </h1>
        <div class="centered">
            <form method="POST" action="https://my-e-service-admin.herokuapp.com/" enctype="multipart/form-data">
                <input type="file" name="file">
                <input style="display: block" type="submit" value="Upload">
            </form>
            <form @submit.prevent="handleSubmit">
                <!-- <input type="file" @change="selectImage"> -->
                <v-text-field v-model="item.name" label="Name">
                </v-text-field>
                <v-tooltip v-model="error" color="error">
                    Error
                </v-tooltip>
                <v-text-field type="number" v-model="item.price" label="Price">
                </v-text-field>
                <v-btn @click="handleSubmit" class="btn btn-primary">Add item</v-btn>
            </form>
        </div>
        <v-container>
            <v-row>
                <v-col cols="2">
                    Categories:
                    <ul>
                        <li>
                            Electronics
                        </li>
                        <li>
                            Sport
                        </li>
                        <li>
                            Kitchen
                        </li>
                    </ul>
                </v-col>
                <v-col cols="10">
                    <v-row>
                        <v-col cols="3" v-for="item in items" :key="item.id">
                            <Items @delete-item="deleteItem" :id="item.id" :item="item" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Items from './Items';
import axios from '../../axios';

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
                img: '',
            },
            items: [],
            error: false,
        }
    },
    created() {
        this.getItems();
    },
    methods: {
        selectImage(event) {
            console.log('event', event.target.files);
        },
        async handleSubmit() {
            await axios.post('/items.json', this.item);
            this.getItems();
        },
        async getItems() {
            const response = await axios.get('/items.json');
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
            await axios.delete('/items/' + id + '.json');
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
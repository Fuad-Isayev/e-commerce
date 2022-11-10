<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" sm="3">
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
                <v-col cols="12" sm="9">
                    <v-row>
                        <v-col sm="3" v-for="item in items" :key="item.id">
                            <Items shop :item="item" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Items from '../components/Items';
import firebase from '../../firebase';

export default {
    name: "Shop",
    components: {
        Items,
    },
    data() {
        return {
            items: [],
        }
    },
    created() {
        this.getItems();
    },
    methods: {
        async getItems() {
            const response = await firebase.get('/items.json');
            console.log(response);
            if (response.data) {
                let keys = Object.keys(response.data);
                let items = keys.map(key => {
                    return { ...response.data[key], id: key };
                })
                this.items = items;
            } else {
                this.items = [];
            }

        },
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
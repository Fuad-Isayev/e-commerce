<template>
    <div>
        <h1 class="centered">S H O P </h1>
        <div class="centered">
            <form @submit.prevent="handleSubmit">
                <input type="file" @change="selectImage">
                <v-btn class="btn btn-primary" @click="setImage">Set Image</v-btn>
                <h6> {{ msg }}</h6>
                <v-text-field v-model="item.name" label="Name">
                </v-text-field>
                <v-tooltip v-model="error" color="error">
                    Error
                </v-tooltip>
                <v-text-field type="number" v-model="item.price" label="Price">
                </v-text-field>
                <v-btn class="btn btn-primary" @click="handleSubmit">Add item</v-btn>
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
                            <Items @delete-item="deleteItem" :item="item" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Items from './Items';
import firebase from '../../firebase';
import axios from 'axios';
import Swal from 'sweetalert2';

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
                imgURL: '',
            },
            items: [],
            error: false,
            image: '',
            imageSelected: false,
            msg: '',
        }
    },
    created() {
        this.getItems();
    },
    methods: {
        selectImage(event) {
            console.log('event', event.target.files);
            this.image = event.target.files[0];
            this.imageSelected = true;
        },
        async setImage() {
            let formData = new FormData();
            formData.append("image", this.image);
            this.msg = 'Loading, please wait...'
            try {
                let res = await axios.post('https://my-e-service-admin.herokuapp.com/', formData);
                this.item.imgURL = res.data;
                this.msg = "File successfully uploaded"
            } catch (err) {
                console.log(err);
                this.msg = err.response.data.error;
            }
        },
        async handleSubmit() {
            await firebase.post('/items.json', this.item);
            this.getItems();
            this.msg = '';
            Swal.fire("Item added!", '', 'success')
        },
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
        async deleteItem(id, imgURL) {
            Swal.fire({
                title: 'Are you sure you want to delete this item?',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: `Yes`,
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isDenied) {
                    await firebase.delete('/items/' + id + '.json');
                    this.getItems();
                    await this.deleteImage(imgURL);
                    Swal.fire('File deleted!', '', 'success')
                }
            })
        },
        async deleteImage(imgURL) {
            if (imgURL) {
                let urlParts = imgURL.split('/')
                let imgName = urlParts[urlParts.length - 1]
                await axios.post('https://my-e-service-admin.herokuapp.com/delete', { imgName: imgName })
            }
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
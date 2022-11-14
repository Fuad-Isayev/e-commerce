<template>
    <div>
        <v-container>
            <v-row>
                <div class="centered">
                    <v-form @submit.prevent="handleSubmit" ref="form">
                        <input type="file" @change="selectImage">
                        <h6 style="color: red"> {{ msg }}</h6>
                        <v-text-field :rules="[rules.required]" v-model="itemName" label="Name">
                        </v-text-field>
                        <v-text-field :rules="[rules.required]" v-model="itemPrice" label="Price">
                        </v-text-field>
                        <v-btn class="btn btn-primary" @click="handleSubmit">Add item</v-btn>
                    </v-form>
                </div>
            </v-row>
            <v-row>
                <v-col cols="12" sm="2">
                    <h5>Categories</h5>
                </v-col>
                <v-col cols="12" sm="10">
                    <v-row>
                        <v-col sm="3" v-for="item in items" :key="item.id">
                            <Items admin @delete-item="deleteItem" :item="item" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Items from "../../components/Items.vue";
import firebase from '../../../firebase';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: "ManageProduct",
    data() {
        return {
            itemName: '',
            itemPrice: '',
            imgURl: '',
            items: [],
            image: '',
            imageSelected: false,
            msg: '',
            rules: {
                required: v => v !== '' || 'This field is required'
            }
        }
    },
    components: {
        Items,
    },
    created() {
        this.getItems();
    },
    methods: {
        selectImage(event) {
            console.log('event', event.target.files);
            this.image = event.target.files[0];
            this.imageSelected = true;
            let formData = new FormData();
            formData.append("image", this.image);
        },
        async handleSubmit() {
            if (this.$refs.form.validate()) {
                let formData = new FormData();
                formData.append("image", this.image);
                formData.append("name", this.itemName);
                formData.append("price", this.itemPrice);
                try {
                    let res = await axios.post('https://my-e-commerce-backend.vercel.app/api/uploads', formData);
                    console.log(res);
                    Swal.fire("Item added!", '', 'success')
                    this.getItems();
                    this.msg = '';
                } catch (err) {
                    console.log(err);
                    this.msg = err.response.data.error;
                    Swal.fire(this.msg, '', 'error')
                }
            }
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
                await axios.post('https://my-e-commerce-backend.vercel.app/delete', { imgName: imgName })
            }
        },
    },
    watch: {
        itemPrice(val) {
            this.$nextTick(() => {
                this.itemPrice = val.replace(/\D/g, '')
            })
        }
    },
}

</script>
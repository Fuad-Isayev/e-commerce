<template>
    <div>
        <v-container>
            <v-row>
                <div class="centered">
                    <v-form @submit.prevent="handleSubmit" ref="form">
                        <v-file-input @click:clear="deleteImage(imgID)" @change="getImageUrl" show-size
                            :rules="[rules.fileIput]" accept="image/png, image/jpeg, image/bmp"
                            placeholder="Choose file" prepend-icon="mdi-image" label="Choose file" ref="imagekit">
                        </v-file-input>
                        <img v-if="imgID" :src="loadedImagePath" width="100">
                        <v-progress-linear v-if="submit_disabled" v-model="uploadProgress" height="25">
                            <strong>{{ Math.ceil(uploadProgress) }}%</strong>
                        </v-progress-linear>
                        <!-- <ik-upload :onSuccess="getImageUrl" /> -->
                        <h6 style="color: red"> {{ error_msg }}</h6>
                        <h6 style="color: green"> {{ success_msg }}</h6>
                        <v-text-field :rules="[rules.required]" v-model="itemName" label="Name" ref="name">
                        </v-text-field>
                        <v-text-field :rules="[rules.required]" v-model="itemPrice" label="Price" ref="price">
                        </v-text-field>
                        <v-btn :disabled="submit_disabled" :loading="submit_loading" class="btn btn-primary"
                            @click="handleSubmit">Add
                            item</v-btn>
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
import imagekit from "../../../imagekit";

export default {
    name: "ManageProduct",
    data() {
        return {
            itemName: '',
            itemPrice: '',
            imgURl: '',
            imgID: '',
            items: [],
            image: '',
            error_msg: '',
            success_msg: '',
            loadedImagePath: '',
            rules: {
                required: v => v !== '' || 'This field is required',
                fileIput: v => !v || v.size < 1000000 || 'Picture size should be less than 1 MB!'
            },
            submit_loading: false,
            submit_disabled: false,
            uploadProgress: 0,
        }
    },
    components: {
        Items,
    },
    created() {
        this.getItems();
    },
    methods: {
        getImageUrl(event) {
            if (this.$refs.imagekit.validate() && event) {
                if (this.imgID) {
                    this.deleteImage(this.imgID)
                }
                var fileSize = event.size;
                var customXHR = new XMLHttpRequest();
                const _this = this;
                this.uploadProgress = 0;
                this.success_msg = '';
                customXHR.upload.addEventListener('progress', function (e) {
                    if (e.loaded <= fileSize) {
                        var percent = Math.round(e.loaded / fileSize * 100);
                        console.log(`Uploaded ${percent}%`);
                        _this.uploadProgress = percent;
                    }
                    if (e.loaded == e.total) {
                        _this.uploadProgress = 100;
                        console.log("Upload done");
                    }
                });
                this.submit_disabled = true;

                imagekit.upload({
                    xhr: customXHR,
                    file: event,
                    fileName: event.name,
                }).then(res => {
                    console.log(res);
                    let urlParts = res.url.split('/');
                    urlParts[urlParts.length - 1] = "tr:w-300/" + urlParts[urlParts.length - 1];
                    this.imgURl = urlParts.join('/');
                    this.imgID = res.fileId;
                    console.log(urlParts, "asd");
                    urlParts[urlParts.length - 1] = "tr:w-150,bl-2/" + urlParts[urlParts.length - 1].split('/')[1];
                    console.log(urlParts, "asd1");
                    this.loadedImagePath = urlParts.join('/');
                    this.submit_disabled = false;
                    this.success_msg = "File uploaded"
                }).then(error => {
                    console.log(error);
                })
            }
        },
        async handleSubmit() {
            if (this.$refs.form.validate()) {
                try {
                    this.submit_loading = true;
                    await firebase.post("/items.json", {
                        name: this.itemName,
                        price: this.itemPrice,
                        imgURL: this.imgURl,
                        imgID: this.imgID,
                    })
                    this.imgID = '';
                    Swal.fire("Item added!", '', 'success')
                    this.getItems();
                    this.resetForm();
                } catch (err) {
                    console.log(err);
                    this.error_msg = err.response.data.error;
                    Swal.fire(this.error_msg, '', 'error')
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
        async deleteItem(id, imgID) {
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
                    await this.deleteImage(imgID);
                    Swal.fire('File deleted!', '', 'success')
                }
            })
        },
        async deleteImage(imgID) {
            if (imgID) {
                this.success_msg = '';
                this.loadedImagePath = '';
                await axios.get(`https://my-e-commerce-backend.vercel.app/delete/${imgID}`)
            }
        },
        resetForm() {
            this.imgURl = '';
            this.imgID = '';
            this.$refs.imagekit.clearableCallback();
            this.success_msg = '';
            this.submit_loading = false;
            this.uploadProgress = 0;
        }
    },
    computed: {
        progress() {
            return this.uploadProgress;
        }
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
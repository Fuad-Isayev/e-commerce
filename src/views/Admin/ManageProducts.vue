<template>
    <div>
        <v-container>
            <v-row flat>
                <v-col cols="2">
                    <router-link class="text-decoration-none text-sm-h5 font-weight-medium" to="/admin">
                        <v-btn color="primary">
                            <v-icon>mdi-chevron-left</v-icon> Admin panel
                        </v-btn>
                    </router-link>
                </v-col>
                <v-col cols="8"></v-col>
                <v-col cols="2" class="d-flex justify-end">
                    <v-btn @click="toggleShowModal()" right color="success">ADD ITEM</v-btn>
                </v-col>
                <v-dialog v-model="showModal" light :width="isMobile ? '100%' : '50%'">
                    <template>
                        <AddItem :editingItem="editingItem" :isMobile="isMobile" @close=toggleShowModal() />
                    </template>
                </v-dialog>
            </v-row>
            <v-row>
                <div class="centered">
                    <!-- <v-form @submit.prevent="handleSubmit" ref="form">
                            <v-file-input @click:clear="deleteImage(imgID)" @change="getImageUrl" show-size
                                :rules="[rules.fileIput]" accept="image/png, image/jpeg, image/bmp"
                                placeholder="Choose file" prepend-icon="mdi-image" label="Choose file" ref="imagekit">
                            </v-file-input>
                            <img v-if="imgID" :src="loadedImagePath" width="100">
                            <v-progress-linear v-if="submit_disabled" v-model="uploadProgress" height="25">
                                <strong>{{ Math.ceil(uploadProgress) }}%</strong>
                            </v-progress-linear>
                            <h6 style="color: red"> {{ error_msg }}</h6>
                            <h6 style="color: green"> {{ success_msg }}</h6>
                            <v-text-field :rules="[rules.required]" v-model="itemName" label="Name" ref="name">
                            </v-text-field>
                            <v-text-field :rules="[rules.required]" v-model="itemPrice" label="Price" ref="price">
                            </v-text-field>
                            <v-btn :disabled="submit_disabled" :loading="submit_loading" class="btn btn-primary"
                                @click="handleSubmit">Add
                                item</v-btn>
                        </v-form> -->
                </div>
            </v-row>
            <v-row>
                <v-col cols="12" sm="2">
                    <h5>Categories</h5>
                </v-col>
                <v-col cols="12" sm="10">
                    <v-row>
                        <v-col cols="6" sm="3" v-for="item in items" :key="item.id">
                            <Items admin @delete-item="deleteItem" @edit-item="toggleShowModal" :item="item" />
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
import AddItem from "./Components/AddItem.vue";

export default {
    name: "ManageProduct",
    props: {
        isMobile: Boolean,
    },
    data() {
        return {
            showModal: false,
            itemName: '',
            itemPrice: '',
            imgURl: '',
            imgID: '',
            image: '',
            error_msg: '',
            success_msg: '',
            loadedImagePath: '',
            rules: {
                required: v => v !== '' || 'This field is required',
                fileIput: v => v && v.size < 1000000 || 'Picture is required and its size should be less than 1 MB!'
            },
            submit_loading: false,
            submit_disabled: false,
            uploadProgress: 0,
            editingItem: null,
        }
    },
    components: {
        Items,
        AddItem,
    },
    created() {
        this.$store.dispatch('loadAllItems');
    },
    methods: {
        toggleShowModal(item = null) {
            this.editingItem = item;
            this.showModal = !this.showModal;
        },
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
                    this.imgID = res.fileId;
                    this.imgURl = res.url + "/tr:w-300"
                    this.loadedImagePath = res.url + "/tr:w-150,bl-2"
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
                    Swal.fire("Item added!", '', 'success')
                    this.$store.dispatch('loadAllItems');
                    this.resetForm();
                } catch (err) {
                    console.log(err);
                    this.error_msg = err.response.data.error;
                    Swal.fire(this.error_msg, '', 'error')
                }
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
                if (result.isDenied) {
                    await firebase.delete('/items/' + id + '.json');
                    this.$store.dispatch('loadAllItems');
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
        },
        items() {
            return this.$store.state.items;
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

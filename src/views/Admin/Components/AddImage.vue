<template>
    <div class="position-relative">
        <img ref="previewImage" class="mx-auto contain" style="width:100%" :src="item.imgURL?.resized || defaultImg"
            alt="">
        <v-col class="custom-upload-button">
            <v-btn v-if="!this.imgURL.resized" @click="handleSubmit" color="primary">
                Choose
                Image</v-btn>
        </v-col>
        <label hidden ref="image" for="image"></label>
        <v-form ref="form">
            <v-file-input @change="getImgUrl" class="d-none" ref="imageUpload" id="image" :rules="[rules.fileIput]"
                accept="image/png, image/jpeg, image/bmp"></v-file-input>
        </v-form>
        <div class="mt-3" v-if="this.imgURL.resized">
            <v-btn class="mr-1" small color="success" @click="handleSubmit">Change Image</v-btn>
            <v-btn small color="error" @click="deleteImage">Delete Image</v-btn>
        </div>
    </div>
</template>

<script>
import imagekit from "../../../../imagekit";
import axios from "axios";

export default {
    name: "AddImage",
    props: {
        item: Object,
        url: Object,
    },
    data() {
        return {
            rules: {
                fileIput: v => v && v.size < 1000000 || 'Picture is required and its size should be less than 1 MB!'
            },
            imgID: '',
            defaultImg: 'https://ik.imagekit.io/f5u3a9d5/no-image.png',
            imgURL: {
                original: "",
                resized: ""
            },
        }
    },
    methods: {
        handleSubmit() {
            this.$refs.image.click();
        },
        getImgUrl(event) {
            if (this.$refs.imageUpload.validate() && event) {
                if (this.imgID) {
                    this.deleteImage(this.imgID)
                }
                imagekit.upload({
                    file: event,
                    fileName: event.name,
                }).then(res => {
                    console.log(res)
                    this.imgID = res.fileId;
                    this.imgURL.original = res.url;
                    if (res.height > res.width) {
                        this.imgURL.resized = res.url + "/tr:h-300";
                    } else {
                        this.imgURL.resized = res.url + "/tr:w-300";
                    }
                    this.$set(this.item, "imgURL", this.imgURL);
                    this.$emit('select', { imgID: this.imgID, imgURL: this.imgURL })
                }).then(error => {
                    console.log(error);
                })
            }
        },
        async deleteImage() {
            console.log('image delete')
            if (this.imgID) {
                this.$emit('select', { imgID: '', imgURL: '' })
                await axios.get(`https://my-e-commerce-backend.vercel.app/delete/${this.imgID}`)
                this.imgID = '';
                this.imgURL = {};
            }
        },
    },
    watch: {
        url(val) {
            if (val) {
                this.imgURL = val;
            } else {
                this.imgURL = {};
                this.imgID = '';
            }
        }
    }
}
</script>

<style>
.custom-upload-button {
    opacity: 80%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
}
</style>
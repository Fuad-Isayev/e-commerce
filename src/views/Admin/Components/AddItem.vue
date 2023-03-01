<template>
    <v-card>
        <v-container>
            <v-row class="mt-0">
                <v-col outlined class="text-center" cols="12" sm="5">
                    <AddImage ref="addImage" :url="imgURL" :item="item" @select="setImgUrl" />
                </v-col>
                <v-col cols="12" sm="7">
                    <v-toolbar flat>
                        <strong>SELLER:</strong>
                        <v-spacer></v-spacer>
                        <v-text-field placeholder="Enter user/company name" prepend-icon="mdi-account" dense
                            v-model="item.seller">
                        </v-text-field>
                    </v-toolbar>
                    <v-toolbar flat class="pr-6">
                        <strong>CATEGORY: </strong>
                        <v-spacer></v-spacer>
                        <v-menu bottom offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :small="isMobile" color="primary" style="opacity:80%" dark v-bind="attrs" v-on="on">
                                    {{ subcategory ? subcategory.name : "Choose Category" }}
                                </v-btn>
                            </template>
                            <v-list height="300" class="overflow-auto">
                                <div v-for="(cat, index) in categories" :key="index">
                                    <strong>{{ cat.name }}</strong>
                                    <v-list-item-group>
                                        <v-list-item v-for="(subcategory, index) in filterSubcategories(cat)" :key="index"
                                            @click="chooseCategory(cat, subcategory)">
                                            <v-list-item-title>{{ subcategory.name }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list-item-group>
                                </div>
                            </v-list>
                        </v-menu>
                    </v-toolbar>
                    <v-toolbar flat>
                        <strong>NAME:</strong>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="item.name" placeholder="Enter name" dense>
                        </v-text-field>
                    </v-toolbar>
                    <v-toolbar flat>
                        <strong>PRICE:</strong>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="item.price" placeholder="Enter price" dense>
                        </v-text-field>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row v-if="subcategory">
                <strong>SPECIFICATIONS:</strong>
                <v-row class="my-2 align-center" v-for="(spec, index) in subcategory.specifications" :key="index">
                    <v-col cols="4"> <strong class="mr-6 py-5">{{ spec.name }}: </strong></v-col>
                    <v-col cols="8" class="overflow-auto py-1">
                        <v-chip-group v-if="spec.type === 'color'" column :multiple="spec.multiple"
                            v-model="item.specifications[spec.name.toLowerCase()]">
                            <v-chip v-for="(color, index) in spec.values" :key="index" :small="isMobile" filter
                                :color="color === 'white' ? 'black' : color === 'gold' ? 'amber' : (color.hex || color)"
                                :outlined="color === 'white'"
                                :text-color="color === 'white' ? 'black' : color === 'yellow' ? 'red' : color === 'gold' ? 'red' : 'white'"
                                class="ml-2" :value="color">
                            </v-chip>
                        </v-chip-group>
                        <v-chip-group v-if="spec.type === 'number'" column :multiple="spec.multiple"
                            v-model="item.specifications[spec.name.toLowerCase()]" active-class="blue white--text"
                            class="ml-2">
                            <v-chip v-for="value in spec.values" :key="value" :value="value" :small="isMobile">
                                {{ value }}</v-chip>
                        </v-chip-group>
                        <v-menu v-if="spec.type === 'string'" class="d-flex align-center" bottom offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :small="isMobile" color="primary" style="opacity:80%" dark v-bind="attrs" v-on="on">
                                    {{
                                        item.specifications[spec.name.toLowerCase()] || (spec.selectedValue ?
                                            spec.selectedValue : 'Choose ' + spec.name)
                                    }}
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item-group>
                                    <v-list-item v-for="(value, index) in spec.values" :key="index"
                                        @click="chooseValue(spec, value)">
                                        <v-list-item-title>{{ value }}</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row class="mb-2">
                    <v-col class="text-center">
                        <v-btn class="mr-1" color="success" @click="editingItem ? editItem() : addItem()">
                            Submit
                        </v-btn>
                        <v-btn @click="cancelAddItem()" color="error">Cancel</v-btn>
                    </v-col>
                </v-row>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import Swal from 'sweetalert2';
import firebase from '../../../../firebase';
import AddImage from "./AddImage";

export default {
    name: "AddItem",
    props: {
        isMobile: Boolean,
        editingItem: Object,
    },
    components: {
        AddImage,
    },
    data() {
        return {
            subcategory: null,
            item: {
                specifications: {}
            },
        }
    },
    methods: {
        chooseCategory(cat, subcat) {
            this.subcategory = subcat;
            this.item.categoryID = cat.id;
            this.item.subcategoryID = subcat.id;
        },
        chooseValue(spec, value) {
            spec.selectedValue = value;
            this.item.specifications[spec.name.toLowerCase()] = value;
        },
        async addItem() {
            console.log(this.item);
            try {
                await firebase.post(`/items.json`, this.item);
                Swal.fire("Item added", '', 'success');
                this.$store.dispatch('loadAllItems');
                this.resetForm();
                this.$emit('close');
            }
            catch (err) {
                console.log(err);
                Swal.fire(err.response.data.error, '', 'error');
            }
        },
        async editItem() {
            await firebase.put(`/items/${this.item.id}.json`, this.item);
            this.$store.dispatch('loadAllItems');
            this.resetForm();
            this.$emit('close');
        },
        setImgUrl(payload) {
            this.item.imgID = payload.imgID;
            this.item.imgURL = payload.imgURL;
        },
        resetForm(deleteImg = false) {
            this.subcategory = null;
            this.item = {
                specifications: {}
            };
            console.log(this.$refs, ' o ', this.$refs.addImage)
            if (deleteImg) {
                this.$refs.addImage.deleteImage();
            }
        },
        cancelAddItem() {
            Swal.fire({
                title: 'Are you sure you want to cancel All progress will be lost?',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: `Yes`,
            }).then(async (result) => {
                if (result.isDenied) {
                    this.resetForm(true);
                    this.$store.dispatch('loadAllItems');
                    this.$emit('close')
                }
            })
        },
        filterSubcategories(category) {
            return this.subcategories.filter(subcat => subcat.categoryID === category.id);
        }
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        },
        subcategories() {
            return this.$store.state.subcategories;
        },
        imgURL() {
            return this.item.imgURL || null;
        }
    },
    async mounted() {
        if (this.editingItem) {
            this.item = this.editingItem?.specifications ? this.editingItem : { ...this.editingItem, specifications: {} }
            this.subcategory = this.subcategories.find(subcat => subcat.id === this.editingItem.subcategoryID);
        } else {
            this.item = { specifications: {} };
        }
    },
    watch: {
        async editingItem(val) {
            if (val) {
                if (val.specifications) {
                    this.item = val;
                    this.subcategory = this.subcategories.find(subcat => subcat.id === val.subcategoryID);
                } else {
                    this.item = { ...val, specifications: {} }
                }
            } else {
                this.item = { specifications: {} }
            }
        }
    }
}
</script>
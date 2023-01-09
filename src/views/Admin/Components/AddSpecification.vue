<template>
    <div>
        <v-card>
            <v-container>
                <v-row class="mt-1">
                    <h4 class="text-center">
                        {{ title }}
                    </h4>
                </v-row>
                <v-row class="mt-10 align-center">
                    <v-col>
                        <h6 class="text-start ">
                            Type :
                        </h6>
                    </v-col>
                    <v-col>
                        <v-select :items="types" v-model="specification.type" solo placeholder="Choose Type">
                        </v-select>
                    </v-col>
                </v-row>
                <v-row class="mt-3 align-center">
                    <v-col>
                        <h6 class="text-start ">
                            Name :
                        </h6>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="specification.name" solo placeholder="Enter Name  ...">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row class="mt-3 align-center justify-center">
                    <v-col>
                        <h6 class="text-start ">
                            Values :
                        </h6>
                    </v-col>
                    <v-col ref="listWrapper" class="overflow-auto " style="max-height: 180px;">
                        <List ref="list" class="text-center" :items="specification.values" @addItem="addValue"
                            @editItem="editValue" @deleteItem="deleteValue" />
                    </v-col>
                </v-row>
                <v-row class="mt-3 align-center">
                    <v-col>
                        <h6 class="text-start ">
                            Multiple :
                        </h6>
                        en
                    </v-col>
                    <v-col>
                        <v-checkbox v-model="specification.multiple">
                        </v-checkbox>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="text-center">
                        <v-btn @click="editingItem ? editItem(subcategory, editingItem) : addItem(subcategory)"
                            color="success">
                            Submit
                        </v-btn>
                        <v-btn @click="$emit('close')" class="ms-2">
                            Cancel
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import firebase from '../../../../firebase';
import List from './List';
import Swal from 'sweetalert2';

export default {
    name: "AddSpecification",
    components: {
        List,
    },
    props: {
        subcategory: Object,
        editingItem: Object,
    },
    data() {
        return {
            showAddValue: false,
            title: 'Add Specification',
            specification: {
                type: '',
                name: '',
                values: [],
                multiple: false,
            },
            types: ['color', 'number', "string"],
        }
    },
    methods: {
        scrollDown() {
            this.$refs.listWrapper.scrollTo({
                top: this.$refs.listWrapper.scrollHeight - 200,
                behavior: "smooth",
            })
        },
        async addItem(subcat) {
            await firebase.post(`/categories/${subcat.categoryId}/subcategories/${subcat.id}/specifications.json`, this.specification);
            this.$store.dispatch('getCategories');
            this.$emit('itemAdded')
            this.$emit('close');
        },
        async editItem(subcat, spec) {
            await firebase.put(`/categories/${subcat.categoryId}/subcategories/${subcat.id}/specifications/${spec.id}.json`, spec);
            this.$store.dispatch('getCategories');
            this.$emit('close');
        },
        addValue(value) {
            if (!this.specification.values) {
                console.log("No values");
                this.specification.values = new Array;
            }
            value ? this.specification.values.push(value) : null;
            setTimeout(this.scrollDown, 100);
        },
        editValue(payload) {
            this.specification.values[payload.id] = payload.name
        },
        deleteValue(index) {
            Swal.fire({
                title: 'Are you sure you want to delete this value?',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: `Yes`,
            }).then(async (result) => {
                if (result.isDenied) {
                    this.specification.values.splice(index, 1)
                }
            })
        }
    },
    mounted() {
        if (this.editingItem) {
            this.specification = this.editingItem;
            this.title = this.editingItem.name;
        }
    },
    watch: {
        editingItem(val) {
            if (val) {
                this.specification = val;
                this.title = val.name;
            } else {
                this.specification = {
                    type: '',
                    name: '',
                    values: [],
                    multiple: false,
                };
                this.title = "Add Specification"
            }
        }
    }
}
</script>

<style scoped>
.v-input {
    height: 50px !important;
}
</style>
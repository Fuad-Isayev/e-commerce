<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="6" class="text-center">
                    <v-card flat outlined>
                        <h3>Categories</h3>
                        <div class="mb-2" v-for="(category, index) in categories" :key="index">
                            <strong @click="selectCategory(category.id)">{{ category.name }}</strong>
                        </div>
                        <v-btn small color="primary" @click="toggleShowAddCategories"> + Add a Category</v-btn>
                        <v-col class="d-flex justify-center">
                            <v-form @submit.prevent="addCategory(category)" v-show="showAddCategory">
                                <v-text-field autofocus v-model="category" placeholder="Enter category">
                                </v-text-field>
                                <v-btn @click="addCategory(category)" color="primary"> Submit
                                </v-btn>
                            </v-form>
                        </v-col>
                    </v-card>


                </v-col>
                <v-col cols="6" class="text-center">
                    <v-card flat outlined>
                        <h3>{{ selectedCategory ? 'Subcategories for ' + selectedCategory.name : 'Choose a Category'
                        }}</h3>
                        <div class="mb-2" v-for="(category, index) in subcategories" :key="index">
                            <strong>{{ category.name }}</strong>
                        </div>
                        <v-col v-if="selectedCategory" class="d-flex justify-center">
                            <v-form>
                                <v-text-field autofocus v-model="subcategory" placeholder="Enter subcategory">
                                </v-text-field>
                                <v-btn @click="addSubcategory(selectedCategory, subcategory)" color="primary"> Submit
                                </v-btn>
                            </v-form>
                        </v-col>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import firebase from '../../../firebase';

export default {
    name: "ManageSpecifications",
    data() {
        return {
            categories: [],
            subcategories: [],
            category: "",
            subcategory: "",
            selectedCategory: null,
            showAddCategory: false,
        }
    },
    methods: {
        async getSubcategories(id) {
            const res = await firebase.get(`/categories/${id}/subcategories.json`);
            this.subcategories = res.data;
        },
        async addSubcategory(selectedCategory, subcat) {
            await firebase.post(`/categories/${selectedCategory.id}/subcategories.json`, { name: subcat });
            this.getSubcategories(selectedCategory.id);
        },
        async addCategory(cat) {
            await firebase.post(`/categories.json`, {
                name: cat,
            });
            this.showAddCategory = false;
            this.category = "";
            this.getCategories();
        },
        async selectCategory(id) {
            const response = await firebase.get(`/categories/${id}.json`);
            try {
                this.selectedCategory = { ...response.data, id: id };
                this.getSubcategories(id);
            } catch (error) {
                console.log(error)
            }
        },
        async getCategories() {
            const response = await firebase.get('/categories.json');
            if (response.data) {
                let keys = Object.keys(response.data);
                let categories = keys.map(key => {
                    return { ...response.data[key], id: key };
                })
                this.categories = categories;
            } else {
                this.categories = [];
            }
        },
        toggleShowAddCategories() {
            this.showAddCategory = !this.showAddCategory;
        }
    },
    mounted() {
        this.getCategories();
    }
}
</script>
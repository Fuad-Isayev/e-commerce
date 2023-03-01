<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="2">
                    <router-link class="text-decoration-none text-sm-h5 font-weight-medium" to="/admin">
                        <v-btn color="primary">
                            <v-icon>mdi-chevron-left</v-icon> Admin panel
                        </v-btn>
                    </router-link>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" class="text-center">
                    <List title="Categories" :items="categories" @selectItem="selectCategory" @addItem="addCategory"
                        @deleteItem="deleteCategory" @editItem="editCategory" />
                </v-col>
                <v-col cols="12" sm="6" class="text-center">
                    <List v-if="selectedCategory" :title="selectedCategory.name" :items="subcategories"
                        @addItem="addSubcategory(selectedCategory, $event)"
                        @editItem="editSubcategory(selectedCategory, $event)"
                        @deleteItem="deleteSubcategory(selectedCategory, $event)" />
                    <h3 v-else> Choose a Category </h3>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import firebase from '../../../firebase';
import List from './Components/List';
import Swal from 'sweetalert2';

export default {
    name: "ManageCategories",
    components: {
        List,
    },
    data() {
        return {
            subcategories: [],
            selectedCategory: null,
        }
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        },
        allSubcategories() {
            return this.$store.state.subcategories;
        }
    },
    methods: {
        async addCategory(cat) {
            await firebase.post(`/categories.json`, {
                name: cat,
                query: this.$query(cat)
            });
            this.getCategories();
        },
        async deleteCategory(id) {
            Swal.fire({
                title: 'Are you sure you want to delete this category?',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: `Yes`,
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isDenied) {
                    await firebase.delete('/categories/' + id + '.json');
                    this.getCategories();
                }
            })
        },
        async editCategory(item) {
            await firebase.put(`/categories/${item.id}.json`, {
                ...item,
                query: this.$query(item.name)
            });
            this.getCategories();
        },
        async getCategories() {
            this.$store.dispatch('getCategories')
        },
        selectCategory(id) {
            this.selectedCategory = this.categories.find(cat => cat.id === id);
            this.subcategories = this.allSubcategories.filter(subcat => subcat.categoryID === id);
        },
        async getSubcategories(id) {
            await this.$store.dispatch('getSubcategories');
            this.subcategories = this.allSubcategories.filter(subcat => subcat.categoryID === id);
        },
        async addSubcategory(category, subcat) {
            await firebase.post(`/subcategories.json`, { name: subcat, categoryID: category.id, query: this.$query(subcat) });
            this.getSubcategories(category.id);
        },
        async editSubcategory(category, subcategory) {
            // console.log(category, ' subcategory ', subcategory);
            await firebase.put(`/subcategories/${subcategory.id}.json`, { ...subcategory, query: this.$query(subcategory.name) });
            this.getSubcategories(category.id);
        },
        async deleteSubcategory(category, id) {
            Swal.fire({
                title: 'Are you sure you want to delete this subcategory?',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: `Yes`,
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isDenied) {
                    await firebase.delete(`/subcategories/${id}.json`);
                    this.getSubcategories(category.id);
                }
            })
        },
    },
    mounted() {
        this.getCategories();
    }
}
</script>
<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" sm="6" class="text-center">
                    <List title="Categories" :items="categories" @selectItem="selectCategory" @addItem="addCategory"
                        @deleteItem="deleteCategory" @editItem="editCategory" />
                </v-col>
                <v-col cols="12" sm="6" class="text-center">
                    <List :title="selectedCategory ? selectedCategory.name : 'Choose a Category'" :items="subcategories"
                        @addItem="addSubcategory(selectedCategory, $event)"
                        @editItem="editSubcategory(selectedCategory, $event)"
                        @deleteItem="deleteSubcategory(selectedCategory, $event)" />
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
        }
    },
    methods: {
        async addCategory(cat) {
            await firebase.post(`/categories.json`, {
                name: cat,
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
            await firebase.put(`/categories/${item.id}/name.json`, item.name);
            this.getCategories();
        },
        async selectCategory(id) {
            const response = await firebase.get(`/categories/${id}.json`);
            try {
                this.selectedCategory = { ...response.data, id: id };
                response.data.subcategories ? this.getSubcategories(id) : this.subcategories = []
            } catch (error) {
                console.log(error)
            }
        },
        async getCategories() {
            this.$store.dispatch('getCategories')
        },
        async getSubcategories(id) {
            const res = await firebase.get(`/categories/${id}/subcategories.json`);
            if (res.data) {
                let keys = Object.keys(res.data);
                let subcategories = keys.map(key => {
                    return { ...res.data[key], id: key };
                })
                this.subcategories = subcategories;
            } else {
                this.subcategories = [];
            }
        },
        async addSubcategory(category, subcat) {
            await firebase.post(`/categories/${category.id}/subcategories.json`, { name: subcat });
            this.getSubcategories(category.id);
        },
        async editSubcategory(category, subcategory) {
            await firebase.put(`/categories/${category.id}/subcategories/${subcategory.id}/name.json`, subcategory.name);
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
                    await firebase.delete(`/categories/${category.id}/subcategories/${id}.json`);
                    this.getSubcategories(category.id);
                }
            })
        }
    },
    mounted() {
        this.getCategories();
    }
}
</script>
<template>
    <v-container>
        <v-breadcrumbs class="pl-0" divider=">" :items="crumbs">
        </v-breadcrumbs>
        <v-row class="justify-center">
            <v-col cols="10">
                <v-row v-for="cat, i in     filteredCategories[0] ? filteredCategories : categories" :key="i"
                    class="align-center justify-center text-center mb-4">
                    <span @click="$router.push(`/catalog/${cat.query}`)" class="text-h6 mb-8 clickable">{{ cat.name
                    }}</span>
                    <v-col @click="$router.push(`/catalog/${cat.query}/${subcat.query}`)" class="subcategory" cols="4"
                        sm="2" v-for="subcat, i in     filterSubcategories(cat)" :key="i">
                        <v-img height="120" width="120" class="mx-auto" contain
                            :src="`/assets/Subcategories/${subcat.query}.png`">
                        </v-img>
                        <span>{{ subcat.name }}</span>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "CategoryList",
    data() {
        return {
            filteredCategories: [],
        }
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        },
        subcategories() {
            return this.$store.state.subcategories;
        },
        selectedCategoryQuery() {
            return this.$route.params.category;
        },
        crumbs() {
            let crumbs = [{ text: 'Home', to: '/' }, { text: 'Categories', to: '/catalog/all-categories' }, {}];
            if (this.$route.query.sub) {
                crumbs[2] = ({ text: this.$route.query.sub[0].toUpperCase() + this.$route.query.sub.slice(1) })
            } else {
                crumbs[2] = { text: '' };
            }
            return crumbs;
        }
    },
    methods: {
        filterSubcategories(category) {
            return this.subcategories.filter(subcat => subcat.categoryID === category.id);
        },
        filterCategories(query) {
            if (this.$route.query.sub) {
                this.crumbs[2] = ({ text: this.$route.query.sub[0].toUpperCase() + this.$route.query.sub.slice(1) })
            } else {
                this.crumbs[2] = { text: '' };
            }
            this.filteredCategories = this.categories.filter(cat => cat.query === query);
        }
    },
    watch: {
        selectedCategoryQuery(val) {
            this.filterCategories(val);
        }
    },
    created() {
        if (this.selectedCategoryQuery !== "all-categories") {
            this.filterCategories(this.selectedCategoryQuery);
        }
    }
}
</script>

<style>
.v-breadcrumbs__item {
    font-size: 18px !important;
}

.v-image {
    margin-left: auto;
    margin-right: auto;
}
</style>
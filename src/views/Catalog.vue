<template>
    <div>
        <v-container>
            <v-breadcrumbs divider=">" class="pl-0" :items="crumbs">
            </v-breadcrumbs>
        </v-container>
        <Shop :givenItems="filteredItems" />
    </div>
</template>

<script>
import Shop from "./Shop";

export default {
    name: "Catalog",
    components: {
        Shop,
    },
    data() {
        return {
            items: [],
        }
    },
    computed: {
        crumbs() {
            return [
                { text: 'Home', to: '/' },
                { text: "Categories", to: '/catalog/all-categories' },
                { text: this.cat[0].toUpperCase() + this.cat.slice(1), to: `/catalog/${this.cat}?sub=${this.cat}` },
                { text: this.subcat[0].toUpperCase() + this.subcat.slice(1), to: `/catalog/${this.cat}/${this.subcat}` }
            ];
        },
        cat() {
            return this.$route.params.category;
        },
        subcat() {
            return this.$route.params.subcategory;
        },
        filteredItems() {
            return this.$store.state.filteredItems;
        }
    },
    methods: {
        selectItems() {
            this.$store.commit('filterItems', { subcategory: this.subcat });
        }
    }
}
</script>
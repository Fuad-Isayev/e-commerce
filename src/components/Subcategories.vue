<template>
    <div>
        <v-list>
            <v-list-item-group>
                <v-list-item v-for="(subcategory, i) in subcategories" :key="i">
                    <v-list-item-icon>
                        <v-icon>{{ subcategory.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content @click="loadItems(selectedCategory, subcategory)">
                        <v-list-item-title v-text="subcategory.name">
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
</div>
</template>

<script>
export default {
    name: "Subcategories",
    props: {
        selectedCategory: Object,
    },
    computed: {
        subcategories() {
            return this.$store.state.subcategories.filter(subcat => subcat.categoryID === this.selectedCategory.id);
        }
    },
    methods: {
        loadItems(cat, subcat) {
            this.$router.push({ name: 'Catalog', params: { category: cat.query, subcategory: subcat.query } });
            this.$store.commit('filterItems', { subcategory: subcat.query });
            this.$store.commit('getFilterOptions');
        }
    }
}
</script>
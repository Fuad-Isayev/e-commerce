<template>
    <div>
        <v-list>
            <v-list-item-group>
                <v-list-item v-for="(subcategory, i) in selectedCategory.subcategories" :key="i">
                    <v-list-item-icon>
                        <v-icon>{{ subcategory.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
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
    data() {
        return {

        }
    }
}
</script>
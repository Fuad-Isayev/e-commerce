<template>
    <div>
        <v-list>
            <v-list-item-group v-for="(category, i) in categories" :key="i">
                <v-list-item @click="selectCategory(category)">
                    <v-list-item-icon>
                        <v-icon>{{ category.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="category.name">
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-spacer></v-spacer>
                    <v-list-item-icon>
                        <v-icon :class="{ down: (category === selectedCategory) }">mdi-chevron-right</v-icon>
                    </v-list-item-icon>
                </v-list-item>
                <transition name="slide-fade">
                    <Subcategories :selectedCategory="selectedCategory" v-if="(category === selectedCategory)" />
                </transition>
            </v-list-item-group>
        </v-list>
    </div>
</template>

<script>
import Subcategories from "./Subcategories";

export default {
    name: "Categories",
    components: {
        Subcategories,
    },
    data() {
        return {
            selectedCategory: null,
        }
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        }
    },
    methods: {
        selectCategory(category) {
            if (category === this.selectedCategory) {
                this.selectedCategory = null;
            } else {
                this.selectedCategory = category;
            }
        }
    }
}
</script>

<template>
    <div>
        <v-container>
            <v-breadcrumbs divider=">" class="pl-0" :items="crumbs">
            </v-breadcrumbs>
            <v-row>
                <v-col cols="12" sm="6" class="border">
                    <div class="d-flex justify-center">
                        <v-img max-width="80%" :src="item.imgURL?.original">
                        </v-img>
                    </div>
                </v-col>
                <v-col cols="12" sm="6" class="text-center border">
                    <h5 class="my-4"> {{ item.name }}</h5>
                    <h5 class="my-4"> ${{ item.price }}</h5>
                    <v-row class="align-center" v-for="spec, i in item.specifications" :key="i">
                        <v-col v-if="Array.isArray(spec)" class="text-start" cols="6">
                            <h6 class="m-0 text-capitalize">{{ i }}</h6>
                        </v-col>
                        <v-col v-if="Array.isArray(spec)" cols="6">
                            <v-chip-group v-model="selectedValues[i]" v-if="i === 'color'" column :multiple="spec.multiple">
                                <v-chip v-for="(color, index) in spec" :key="index" :small="isMobile" filter
                                    :color="color === 'white' ? 'black' : color === 'gold' ? 'amber' : (color.hex || color)"
                                    :outlined="color === 'white'"
                                    :text-color="color === 'white' ? 'black' : color === 'yellow' ? 'red' : color === 'gold' ? 'red' : 'white'"
                                    class="ml-2" :value="color">
                                </v-chip>
                            </v-chip-group>
                            <v-chip-group v-model="selectedValues[i]" v-else column :multiple="spec.multiple"
                                active-class="blue white--text" class="ml-2">
                                <v-chip :class="{ pill: i.length > 4 }" v-for="value in spec" :key="value" :value="value"
                                    :small="isMobile">
                                    {{ $unit(i, value) }}</v-chip>
                            </v-chip-group>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="9" sm="10" class="pr-0 ">
                            <v-btn @click="addToCart(item)" block :large="!isMobile" color="success">Add to
                                Cart</v-btn>
                        </v-col>
                        <v-col cols="3" sm="2" class="px-0">
                            <v-btn :large="!isMobile">
                                <v-icon>
                                    mdi-heart-outline
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row class="border">
                <h5 class="py-5 text-center border-bottom">Specifications</h5>
                <v-row class="align-center" v-for="spec, i in item.specifications" :key="i">
                    <v-col v-if="(!Array.isArray(spec))" class="text-center" cols="6">
                        <h6 class="m-0 text-capitalize">{{ i }}</h6>
                    </v-col>
                    <v-col cols="6" v-if="(!Array.isArray(spec))">
                        <span>{{ $unit(i, spec) }}</span>
                    </v-col>
                </v-row>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "Product",
    components: {
    },
    data() {
        return {
            item: {},
            specifications: {},
            selectedValues: {},
            category: '',
            subcategory: '',
        }
    },
    created() {
        if (this.items.length > 0) {
            this.item = this.items.find(i => i.id === this.id);
        }
        this.category = this.categories?.find(cat => cat.id === this.item.categoryID)?.query;
        this.subcategory = this.subcategories?.find(subcat => subcat.id === this.item.subcategoryID).query;
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
        items() {
            return this.$store.state.items;
        },
        id() {
            return this.$route.params.id;
        },
        categories() {
            return this.$store.state.categories;
        },
        subcategories() {
            return this.$store.state.subcategories;
        },
        crumbs() {
            if (this.category && this.subcategory) {
                return [
                    { text: 'Home', to: '/' },
                    { text: "Categories", to: '/catalog/all-categories' },
                    { text: this.category[0].toUpperCase() + this.category.slice(1), to: `/catalog/${this.category}?sub=${this.category}` },
                    { text: this.subcategory[0].toUpperCase() + this.subcategory.slice(1), to: `/catalog/${this.category}/${this.subcategory}` },
                    { text: this.item.name }
                ]
            } else {
                return [
                    { text: 'Home', to: '/' },
                    { text: "Categories", to: '/catalog/all-categories' },
                ]
            }
        }
    },
    watch: {
        id(val) {
            this.item = this.items.find(i => i.id === val);
        },
        items(val) {
            this.item = val.find(i => i.id === this.id);
        },
        categories(val) {
            this.category = val.find(cat => cat.id === this.item.categoryID).query;
        },
        subcategories(val) {
            this.subcategory = val.find(subcat => subcat.id === this.item.subcategoryID).query;
        },
    },
    methods: {
        addToCart() {
            let item = { ...this.item };
            Object.keys(this.selectedValues).forEach((key) => {
                let valueName = this.selectedValues[key].name || this.selectedValues[key];
                console.log('Value name ', valueName);
                item[key] = this.selectedValues[key];
                item.id = item.id.slice(0, -2);
                item.id += valueName.slice(0, 2);
                item.name += ' ' + valueName.charAt(0).toUpperCase() + valueName.slice(1);
            });
            this.$store.dispatch('addToCart', item);
        }
    }
}
</script>
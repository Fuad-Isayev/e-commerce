<template>
    <div>
        <div class="d-flex justify-center">
            <v-img max-width="50%" :src="item.imgURL.original">
            </v-img>
        </div>
        <div>
            <h5 class="my-4 text-center">Specifications</h5>
        </div>
        <v-container>
            <v-row v-for="spec, i in item.specifications" :key="i">
                <v-col class="text-center" cols="6">
                    <h6>{{ i }}</h6>
                </v-col>
                <v-col cols="6">
                    <span v-if="(!Array.isArray(spec))">{{ spec }}</span>
                    <!-- <span v-else v-for="value, i in spec" :key="i"> {{ value }} </span> -->
                    <div v-else>
                        <v-chip-group v-if="i === 'color'" column :multiple="spec.multiple">
                            <v-chip v-for="(color, index) in spec" :key="index" :small="isMobile" filter
                                :color="color === 'white' ? 'black' : color" :outlined="color === 'white'"
                                :text-color="color === 'white' ? 'black' : color === 'yellow' ? 'red' : 'white'"
                                class=" overflow-auto ml-2" :value="color">
                            </v-chip>
                        </v-chip-group>
                        <v-chip-group v-else column :multiple="spec.multiple" active-class="blue white--text"
                            class="ml-2">
                            <v-chip v-for="value in spec" :key="value" :value="value" :small="isMobile">
                                {{ value }}</v-chip>
                        </v-chip-group>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
// import Items from '../components/Items.vue';
import firebase from '../../firebase';

export default {
    name: "Product",
    components: {
        // Items
    },
    data() {
        return {
            id: '',
            item: {},
            specifications: {},
            selectedValue: null,
        }
    },
    async created() {
        console.log(this.$route.params.id)
        this.id = this.$route.params.id;
        // const items = await firebase.get(`/items/${this.$route.params.id}.json`);
        // console.log(items);
        // this.item = items.data;
        // this.item = this.items.filter(i => i.id === this.id)[0];
        const response = await firebase.get(`/items/${this.id}.json`);
        this.item = response.data;
        // const specs = await firebase.get('https://e-commerce-b33a7-default-rtdb.firebaseio.com/categories/-NIbT3hawOUeze2Cv4Ym/subcategories/-NIbT6WzS1ybcYk8uA6G/specifications.json')
        // this.specifications = specs.data;
        // this.specifications = this.item.specifications;
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
        items() {
            return this.$store.state.items;
        }
    },
    methods: {
        chooseValue(spec, value) {
            spec.selectedValue = value;
        }
    }
}
</script>
<template>
    <div>
        <div class="d-flex justify-center">
            <Items shop :item="item" />
        </div>
        <div>
            <h5 class="my-4 text-center">Specifications</h5>
        </div>
        <v-container>
            <v-row v-for="spec, i in specifications" :key="i">
                <v-col class="text-center" cols="6">
                    <h6>{{ spec.name }}</h6>
                </v-col>
                <v-col cols="6">
                    <!-- <span v-for="value, i in spec.values" :key="i">{{ value }} , </span> -->
                    <v-chip-group v-if="spec.type === 'number'" column :multiple="spec.multiple"
                        active-class="blue white--text" class="ml-2">
                        <v-chip v-for="value in spec.values" :key="value" :value="value" :small="isMobile">
                            {{ value }}</v-chip>
                    </v-chip-group>
                    <v-menu v-if="spec.type === 'string'" class="d-flex align-center" bottom offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn :small="isMobile" color="primary" style="opacity:80%" dark v-bind="attrs" v-on="on">
                                {{ spec.selectedValue ? spec.selectedValue : 'Choose ' + spec.name }}
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item-group>
                                <v-list-item v-for="(value, index) in spec.values" :key="index"
                                    @click="chooseValue(spec, value)">
                                    <v-list-item-title>{{ value }}</v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>
                    <v-chip-group v-if="spec.type === 'color'" column :multiple="spec.multiple">
                        <v-chip v-for="(color, index) in spec.values" :key="index" :small="isMobile" filter
                            :color="color === 'white' ? 'black' : color" :outlined="color === 'white'"
                            :text-color="color === 'white' ? 'black' : color === 'yellow' ? 'red' : 'white'"
                            class=" overflow-auto ml-2" :value="color">
                        </v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Items from '../components/Items.vue';
import firebase from '../../firebase';

export default {
    name: "Product",
    components: {
        Items
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
        const items = await firebase.get(`/items/${this.$route.params.id}.json`);
        console.log(items);
        this.item = items.data;
        const specs = await firebase.get('https://e-commerce-b33a7-default-rtdb.firebaseio.com/categories/-NIbT3hawOUeze2Cv4Ym/subcategories/-NIbT6WzS1ybcYk8uA6G/specifications.json')
        this.specifications = specs.data;
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        }
    },
    methods: {
        chooseValue(spec, value) {
            spec.selectedValue = value;
        }
    }
}
</script>
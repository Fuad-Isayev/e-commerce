<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-space-between">
                    <strong>CATEGORY: </strong>
                    <v-menu bottom offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn :small="isMobile" color="primary" dark v-bind="attrs" v-on="on">
                                {{ subcategory ? subcategory.name : "Choose Category" }}
                            </v-btn>
                        </template>
                        <v-list height="300" class="overflow-auto">
                            <div v-for="(cat, index) in categories" :key="index">
                                <strong>{{ cat.name }}</strong>
                                <v-list-item-group>
                                    <v-list-item v-for="(subcategory, index) in cat.subcategories" :key="index"
                                        @click="chooseCategory(cat, subcategory)">
                                        <v-list-item-title>{{ subcategory.name }}</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                            </div>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row class="mt-10">
                <h4 class="text-center">Specifications :</h4>
                <v-col cols="1">#</v-col>
                <v-col>Type</v-col>
                <v-col cols="12" sm="3">Name</v-col>
                <v-col cols="12" sm="3">Values</v-col>
                <v-col cols="2">Multiple</v-col>
            </v-row>
            <v-row class="mt-10 " v-for="(spec, i) in specifications" :key="i">
                <v-col cols="1">{{ i }}</v-col>
                <v-col cols="12" sm="3">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" v-bind="attrs" v-on="on" :small="isMobile">
                                {{ spec.type || "Choose Type" }}
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item v-for="type, i in types" :key="i" @click="chooseType(spec, type)">
                                <v-list-item-title>
                                    {{ type }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                    <h5>
                        {{ spec.name }}
                    </h5>
                </v-col>
                <v-col cols="12" sm="3" class="overflow-auto py-1" style="max-height: 100px">
                    <v-chip-group column>
                        <v-chip v-for="value, i in spec.values" :key="i">
                            {{ value }}
                        </v-chip>
                    </v-chip-group>
                    <!-- <List :items="spec.values" /> -->
                </v-col>
                <v-col cols="2">
                    <v-checkbox v-model="spec.multiple" :label="spec.multiple.toString()">
                    </v-checkbox>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-center">
                    <v-btn v-if="!showAddNew" @click="showAddNew = !showAddNew" color="success">
                        + Add new
                    </v-btn>
                    <div v-if="showAddNew">
                        <v-btn color="primary">
                            Save
                        </v-btn>
                        <v-btn @click="showAddNew = !showAddNew">
                            Cancel
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
// import List from './Components/List'

export default {
    name: "ManageSpecifications",
    components: {
        // List
    },
    props: {
        isMobile: Boolean,
    },
    data() {
        return {
            items: [{ name: '1' }, { name: '2' }],
            subcategory: '',
            specification: {
                type: '',
                name: '',
                values: [],
                multiple: false,
            },
            types: ['color', 'number', "string"],
            specifications: [{ name: "Color", type: "", values: ["red", "yellow"], multiple: true }, { name: "Sizes", type: "", values: [2, 4, 6, 8, 12], multiple: true }, { name: "Brand", type: "", values: ["red", "yellow"], multiple: false }],
            showAddNew: false,
        }
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        }
    },
    methods: {
        chooseCategory(cat, subcat) {
            this.subcategory = { ...subcat, categoryId: cat.id };
        },
        chooseType(spec, type) {
            spec.type = type;
        },
    }
}
</script>

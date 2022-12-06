<template>
    <v-card>
        <v-container>
            <v-toolbar flat>
                <v-spacer></v-spacer>
                <v-btn @click="$emit('close')" icon>
                    <v-icon color="red">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-row class="mt-0">
                <v-col outlined class="text-center" cols="12" sm="5">
                    <v-img style="opacity:100%" class="mx-auto" width="250" src="../assets/no-image.png">
                        <v-btn color="primary" style="top:45%;opacity:80%">Choose Image</v-btn>
                    </v-img>
                    <!-- <v-btn primary>Choose Image</v-btn> -->
                </v-col>
                <v-col cols="12" sm="7">
                    <v-toolbar flat>
                        <strong>SELLER:</strong>
                        <v-spacer></v-spacer>
                        <v-text-field placeholder="Enter user/company name" prepend-icon="mdi-account" dense>
                        </v-text-field>
                    </v-toolbar>
                    <v-toolbar flat class="pr-6">
                        <strong>CATEGORY: </strong>
                        <v-spacer></v-spacer>
                        <v-menu bottom offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :small="isMobile" color="primary" style="opacity:80%" dark v-bind="attrs"
                                    v-on="on">
                                    {{ category ? category.name : "Choose Category" }}
                                </v-btn>
                            </template>
                            <v-list height="300" class="overflow-auto">
                                <div v-for="(cat, index) in categories" :key="index">
                                    <strong>{{ cat.name }}</strong>
                                    <v-list-item-group>
                                        <v-list-item v-for="(subcategory, index) in cat.categories" :key="index"
                                            @click="chooseCategory(subcategory)">
                                            <v-list-item-title>{{ subcategory.name }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list-item-group>
                                </div>
                            </v-list>
                        </v-menu>
                    </v-toolbar>
                    <v-toolbar flat>
                        <strong>NAME:</strong>
                        <v-spacer></v-spacer>
                        <v-text-field placeholder="Enter name" dense>
                        </v-text-field>
                    </v-toolbar>
                    <v-toolbar flat>
                        <strong>PRICE:</strong>
                        <v-spacer></v-spacer>
                        <v-text-field placeholder="Enter price" dense>
                        </v-text-field>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row v-if="category">
                <strong>CPECIFICATIONS:</strong>
                <v-row class="my-2 align-center" v-for="(spec, index) in category.specifications" :key="index">
                    <v-col cols="4"> <strong class="mr-6 py-5">{{ spec.name }}: </strong></v-col>
                    <v-col cols="8" class="overflow-auto py-1">
                        <v-chip-group v-if="spec.type === 'Color'" column :multiple="spec.multiple">
                            <v-chip v-for="(color, index) in spec.values" :key="index" :small="isMobile" filter
                                :color="color === 'white' ? 'black' : color" :outlined="color === 'white'"
                                :text-color="color === 'white' ? 'black' : color === 'yellow' ? 'red' : 'white'"
                                class=" overflow-auto ml-2">
                            </v-chip>
                        </v-chip-group>
                        <v-chip-group v-if="spec.type === 'Digits'" column :multiple="spec.multiple"
                            active-class="blue white--text" class="ml-2">
                            <v-chip v-for="value in spec.values" :key="value" :value="value" :small="isMobile">
                                {{ value }}</v-chip>
                        </v-chip-group>
                        <v-menu class="d-flex align-center" bottom offset-y v-if="spec.type === 'String'">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :small="isMobile" color="primary" style="opacity:80%" dark v-bind="attrs"
                                    v-on="on">
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
                    </v-col>
                </v-row>
                <!-- <v-toolbar class="overflow-auto" v-for="(spec, index) in category.specifications" :key="index" flat>
                    <strong class="mr-6">{{ spec.name }}: </strong>
                    <v-chip-group v-if="spec.type === 'Color'" column :multiple="spec.multiple">
                        <v-chip v-for="(color, index) in spec.values" :key="index" :small="isMobile" filter
                            :color="color === 'white' ? 'black' : color" :outlined="color === 'white'"
                            :text-color="color === 'white' ? 'black' : 'white'" class=" overflow-auto ml-2">
                        </v-chip>
                    </v-chip-group>
                    <v-chip-group v-if="spec.type === 'Digits'" column :multiple="spec.multiple"
                        active-class="blue white--text" class="ml-2">
                        <v-chip v-for="value in spec.values" :key="value" :value="value" :small="isMobile">
                            {{ value }}</v-chip>
                    </v-chip-group>
                    <v-menu bottom offset-y v-if="spec.type === 'String'">
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
                </v-toolbar>
                <v-textarea placeholder="About product...">
                </v-textarea> -->
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: "AddItem",
    props: {
        isMobile: Boolean,
    },
    data() {
        return {
            categories: [
                {
                    name: "Clothes",
                    categories: [{
                        name: "Shoes",
                        specifications: [{
                            name: "COLOR",
                            type: "Color",
                            multiple: true,
                            values: ["black", "white", "red", "yellow", "blue"]
                        }, {
                            name: "SIZES",
                            type: "Digits",
                            multiple: true,
                            values: [38, 39, 40, 41, 42, 43],

                        }, {
                            name: "BRAND",
                            selectedValue: "",
                            type: "String",
                            values: ["Nike", "Adidas", "Reebok"]
                        }]
                    }, "T-shirts", "Pants", "Jumpers"]
                }, {
                    name: "Electronics",
                    categories: [{
                        name: "Smartphones",
                        specifications: [{
                            name: "RAM",
                            type: "Digits",
                            multiple: false,
                            values: [2, 3, 4, 8, 16]
                        }, {
                            name: "CPU",
                            selectedValue: "",
                            type: "String",
                            values: ["Dual-core", "Quad-core", "Hexa-core", "Octa-core"]
                        }, {
                            name: "MEMORY",
                            type: "Digits",
                            multiple: false,
                            values: [16, 32, 64, 128, 256]
                        }]
                    }, "Tablets", "TV", "Laptops"]
                }, {
                    name: "Books",
                    categories: ["Fantasy", "Romance", "Scientific", "Psychology"]
                }, {
                    name: "Tools",
                    categories: ["Screwdrivers", "Angle Grinders", "Drills", "Shovels"]
                }],
            category: null,
            specifications: [],
            brand: 'Choose Brand',
        }
    },
    methods: {
        chooseCategory(cat) {
            this.category = cat;
        },
        chooseValue(spec, value) {
            spec.selectedValue = value;
        },
    },
    watch: {
    }
}
</script>
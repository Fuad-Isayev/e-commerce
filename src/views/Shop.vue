<template>
    <div>
        <v-container>
            <v-card>
                <v-row v-if="!isMobile">
                    <v-col cols="12" sm="3" class="mt-n6 pr-0">
                        <v-toolbar flat outlined>
                            <strong>Filter</strong>
                            <v-spacer></v-spacer>
                            <v-divider vertical></v-divider>
                            <v-btn icon class="ml-1">
                                <v-icon color="#710219">mdi-sync</v-icon>
                            </v-btn>
                        </v-toolbar>
                    </v-col>
                    <v-col cols="12" sm="3" class="mt-n6 pl-0 pr-1 ">
                        <v-toolbar flat outlined>
                        </v-toolbar>
                    </v-col>
                    <v-col cols="12" sm="3" class="mt-n6 pl-0 pr-1 ml-n1">
                        <v-toolbar flat outlined>
                            <strong>SORT BY : <span>Price $-$$ </span></strong>
                            <v-spacer></v-spacer>
                            <v-divider vertical></v-divider>
                            <v-btn icon class="ml-1">
                                <v-icon color="black">mdi-menu-down</v-icon>
                            </v-btn>
                        </v-toolbar>
                    </v-col>
                    <v-col cols="12" sm="3" class="mt-n6 pl-0 pr-1 ml-n1">
                        <v-toolbar flat outlined>
                            <strong>SHOW: <span>12</span></strong>
                            <v-spacer></v-spacer>
                            <v-divider vertical></v-divider>
                            <v-btn icon class="ml-1">
                                <v-icon color="black">mdi-menu-down</v-icon>
                            </v-btn>
                        </v-toolbar>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="!isMobile || showFilter" cols="12" sm="3" :class="!isMobile ? 'py-0 pr-0 mt-n3' : ''">
                        <v-card flat outlined tile>
                            <v-toolbar flat>
                                <v-icon color="black" class="mr-2">mdi-chevron-down</v-icon>
                                <strong>CATEGORIES</strong>
                                <v-spacer></v-spacer>
                                <v-icon small color="grey">mdi-close</v-icon>
                            </v-toolbar>
                        </v-card>
                        <v-card flat outlined tile>
                            <v-toolbar flat>
                                <v-icon color="black" class="mr-2">mdi-chevron-down</v-icon>
                                <strong>PRICE</strong>
                                <v-spacer></v-spacer>
                                <v-icon small color="grey">mdi-close</v-icon>
                            </v-toolbar>
                            <v-toolbar flat>
                                <v-text-field :placeholder="'$ ' + range[0]" filled rounded dense class="mx-2">
                                </v-text-field>
                                <v-text-field :placeholder="'$ ' + range[1]" filled rounded dense class="mx-2">
                                </v-text-field>
                            </v-toolbar>
                            <v-range-slider v-model="range" max="200" min="75"></v-range-slider>
                        </v-card>
                        <v-card>
                            <v-toolbar flat>
                                <v-icon color="black" class="mr-2">mdi-chevron-down</v-icon>
                                <strong>COLOR</strong>
                                <v-spacer></v-spacer>
                                <v-icon small color="grey">mdi-close</v-icon>
                            </v-toolbar>
                            <v-chip-group column multiple>
                                <v-chip filter color="black" text-color="white" class="ml-2"></v-chip>
                                <v-chip filter outlined color="black" text-color="black" class="ml-2"></v-chip>
                                <v-chip filter color="red" text-color="white" class="ml-2"></v-chip>
                                <v-chip filter color="yellow" text-color="red" class="ml-2"></v-chip>
                                <v-chip filter color="blue" text-color="white" class="ml-2"></v-chip>
                            </v-chip-group>
                        </v-card>
                        <v-card flat outlined>
                            <v-toolbar flat>
                                <v-icon color="black" class="mr-2">mdi-chevron-down</v-icon>
                                <strong>SIZE</strong>
                                <v-spacer></v-spacer>
                                <v-icon small color="grey">mdi-close</v-icon>
                            </v-toolbar>
                            <v-chip-group column multiple active-class="blue white--text" class="ml-2">
                                <v-chip v-for="size in sizes" :key="size" :value="size">
                                    {{ size }}</v-chip>
                            </v-chip-group>
                        </v-card>
                        <v-card outlined class="text-center py-3">
                            <v-btn @click="toggleShowFilter" color=" success" center> Apply (3)</v-btn>
                        </v-card>
                    </v-col>
                    <v-col v-else class="d-flex align-center justify-space-between">
                        <v-btn @click="toggleShowFilter">
                            FILTER
                        </v-btn>
                        <v-btn>
                            SORT BY: <span>
                                PRICE $-$$
                            </span>
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="9" :class="isMobile ? '' : 'mt-n3'">
                        <v-row>
                            <v-col cols="12" sm="4" class="py-0"
                                :class="!isMobile ? i % 3 ? 'pl-0 pr-1 ml-n1' : 'pl-0 pr-1' : ''"
                                v-for="item, i in items" :key="item.id">
                                <Items shop :item="item" />
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import Items from '../components/Items';
import firebase from '../../firebase';

export default {
    name: "Shop",
    components: {
        Items,
    },
    props: {
        isMobile: Boolean,
    },
    data() {
        return {
            items: [],
            range: [75, 200],
            sizes: [38, 39, 40, 41, 42, 43],
            showFilter: false,
        }
    },
    created() {
        this.getItems();
    },
    methods: {
        toggleShowFilter() {
            this.showFilter = !this.showFilter;
        },
        async getItems() {
            const response = await firebase.get('/items.json');
            if (response.data) {
                let keys = Object.keys(response.data);
                let items = keys.map(key => {
                    return { ...response.data[key], id: key };
                })
                this.items = items;
            } else {
                this.items = [];
            }

        },
    }
}
</script>

<style>
.v-chip.v-size--default {
    border-radius: 50px !important;
    font-size: 14px !important;
    height: 40px !important;
    width: 40px !important;
}

.v-chip.v-size--small {
    border-radius: 50% !important;
    height: 25px !important;
    width: 25px !important;
}

.v-chip .v-chip__content {
    justify-content: center;
    margin: 0 auto;
}

.v-icon {
    margin-left: auto !important;
    margin-right: auto !important;
}
</style>
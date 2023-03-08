<template>
    <div>
        <v-card flat tile>
            <v-card flat outlined>
                <v-toolbar flat>
                    <v-icon color="black" class="mr-2">mdi-chevron-down</v-icon>
                    <strong>PRICE</strong>
                    <v-spacer></v-spacer>
                    <v-icon small color="grey">mdi-close</v-icon>
                </v-toolbar>
                <v-toolbar flat>
                    <v-text-field v-model="rangeText.min" ref="range-0" @blur="handleBlur($event, '0')"
                        :placeholder="'$ ' + range[0]" filled rounded dense class="mx-2">
                    </v-text-field>
                    <v-text-field v-model="rangeText.max" ref="range-1" @blur="handleBlur($event, '1')"
                        :placeholder="'$ ' + range[1]" filled rounded dense class="mx-2">
                    </v-text-field>
                </v-toolbar>
                <v-range-slider step="0.01" ref="slider" class="px-4" v-model="range" :max="highestItemPrice"
                    :min="lowestItemPrice"></v-range-slider>
            </v-card>
            <v-card v-for="spec, i in filterOptions" :key="i" flat outlined>
                <v-toolbar flat>
                    <v-icon color="black" class="mr-2">mdi-chevron-down</v-icon>
                    <strong>{{ i.toUpperCase() }}</strong>
                    <v-spacer></v-spacer>
                    <v-icon small color="grey">mdi-close</v-icon>
                </v-toolbar>
                <v-chip-group class="px-4" v-if="i === 'color'" column multiple v-model="selectedValues[i]">
                    <v-chip v-for="(color, index) in spec" :key="index" filter
                        :color="color === 'white' ? 'black' : color === 'gold' ? 'amber' : (color.hex || color)"
                        :outlined="color === 'white'"
                        :text-color="color === 'white' ? 'black' : color === 'yellow' ? 'red' : color === 'gold' ? 'red' : 'white'"
                        :value="color">
                    </v-chip>
                </v-chip-group>
                <v-chip-group v-else column filter multiple active-class="blue white--text" class=" px-4"
                    v-model="selectedValues[i]">
                    <v-chip :class="{ pill: value.length > 4 }" class="text-capitalize" v-for="value, index in spec"
                        :key="index" :value="value">
                        {{ value }}</v-chip>
                </v-chip-group>
            </v-card>
        </v-card>
        <v-card v-if="isMobile" outlined class="text-center py-3">
            <v-btn @click="$emit('toggleShowFilter')" color=" success" center> Show ({{ items.length }})</v-btn>
        </v-card>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
    name: "FilterItems",
    props: {
        items: Array,
    },
    data() {
        return {
            range: [0, 0],
            rangeText: {
                min: 0,
                max: 0
            },
            showFilter: false,
            selectedValues: {},
            filterByPriceDebouncer: null
        }
    },
    created() {
        this.filterByPriceDebouncer = _.debounce((val) => {
            this.filterByPrice(val)
        }, 500)
    },
    mounted() {
        this.$store.commit('filterItems', { subcategory: this.selectedSubcategory });
        this.$store.commit('getFilterOptions');
        this.$store.commit('getPriceLimits');
        this.range[0] = this.queryValues.minPrice || this.lowestItemPrice;
        this.range[1] = this.queryValues.maxPrice || this.highestItemPrice;
        this.rangeText.min = this.range[0];
        this.rangeText.max = this.range[1];
    },
    computed: {
        filterOptions() {
            return this.$store.state.filterOptions;
        },
        isMobile() {
            return this.$store.getters.isMobile;
        },
        selectedSubcategory() {
            return this.$route.params.subcategory;
        },
        queryValues() {
            return this.$store.getters.selectedFilterOptions;
        },
        lowestItemPrice() {
            return this.$store.state.lowestItemPrice;
        },
        highestItemPrice() {
            return this.$store.state.highestItemPrice;
        }
    },
    watch: {
        range(val) {
            this.rangeText.min = val[0];
            this.rangeText.max = val[1];
            this.filterByPriceDebouncer(val);
        },
        selectedValues: {
            handler: function (val) {
                // console.log('selected values ', JSON.stringify(val));
                let obj = { ...this.$route.query }
                Object.keys(val).forEach((key) => {
                    if (val[key] && val[key].length > 0) {
                        // console.log('add prop');
                        // console.log('val key ', val[key]);
                        obj = { ...this.$route.query, [key]: val[key].join(',') }
                    } else if (obj[key]) {
                        // console.log('delete prop');
                        delete obj[key]
                    } else {
                        // console.log('empty the object');
                        obj = {}
                    }
                })
                if (JSON.stringify(val) === "{}") {
                    // console.log('empty obj');
                    obj = { minPrice: this.lowestItemPrice, maxPrice: this.highestItemPrice }
                }
                // console.log('obj ', obj);
                if (JSON.stringify(this.$route.query) !== JSON.stringify(obj)) {
                    // console.log('query pushed');
                    this.$router.push({ query: obj });
                }
                this.$store.commit('updateQueryOptions', obj);
            },
            deep: true
        },
        queryValues(val) {
            if (JSON.stringify(val) !== JSON.stringify(this.selectedValues)) {
                this.selectedValues = val;
            }
            const { minPrice, maxPrice, ...filter } = val;
            this.$store.commit('filterItems', {
                subcategory: this.selectedSubcategory, filter: filter, price: {
                    min: minPrice ? minPrice[0] : 0, max: maxPrice ? maxPrice[0] : this.highestItemPrice
                }
            });
        },
        lowestItemPrice(val) {
            this.range[0] = val;
            this.$refs.slider.lazyValue[0] = this.queryValues.minPrice || val;
        },
        highestItemPrice(val) {
            this.range[1] = val;
            this.$refs.slider.lazyValue[1] = this.queryValues.maxPrice || val;
        },
    },
    methods: {
        filterByPrice(val) {
            let obj = { ...this.$route.query };
            // console.log('val', val);
            obj.minPrice = val[0].toString();
            obj.maxPrice = val[1].toString();
            if (JSON.stringify(this.$route.query) !== JSON.stringify(obj)) {
                // console.log('query pushed ', JSON.stringify(obj), JSON.stringify(this.$route.query));
                this.$router.push({ query: obj });
            }
            this.$store.commit('updateQueryOptions', obj);
        },
        handleBlur(event, index) {
            const value = Number(event.target.value);
            if (value < this.lowestItemPrice && Number(index) === 0) {
                this.$set(this.range, 0, this.lowestItemPrice)
            } else if (value > this.highestItemPrice && Number(index) === 1) {
                this.$set(this.range, 1, this.highestItemPrice)
            } else {
                this.$set(this.range, Number(index), value)
            }
        },
        resetFilter() {
            this.selectedValues = {}
            this.$set(this.range, 0, this.lowestItemPrice);
            this.$set(this.range, 1, this.highestItemPrice);
        }
    },
    beforeDestroy() {
        this.$store.commit('updateQueryOptions', {});
    }
}
</script>
<template>
    <div>
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
            <v-range-slider class="px-4" v-model="range" max="200" min="75"></v-range-slider>
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

export default {
    name: "FilterItems",
    props: {
        items: Array,
    },
    data() {
        return {
            range: [75, 200],
            showFilter: false,
            selectedValues: {},
        }
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
        }
    },
    watch: {
        selectedValues: {
            handler: function (val) {
                console.log('selected values ', JSON.stringify(val));
                let obj = { ...this.$route.query }
                Object.keys(val).forEach((key) => {
                    if (val[key] && val[key].length > 0) {
                        console.log('add prop');
                        console.log('val key ', val[key]);
                        obj = { ...this.$route.query, [key]: val[key].join(',') }
                    } else if (obj[key]) {
                        console.log('delete prop');
                        delete obj[key]
                    } else {
                        console.log('empty the object');
                        obj = {}
                    }
                })
                console.log('obj ', obj);
                if (JSON.stringify(this.$route.query) !== JSON.stringify(obj)) {
                    console.log('query pushed');
                    this.$router.push({ query: obj });
                }
                this.$store.commit('updateQueryOptions', obj);
            },
            deep: true
        },
        queryValues(val) {
            console.log(JSON.stringify(val), ' query, selected', JSON.stringify(this.selectedValues));
            if (JSON.stringify(val) !== JSON.stringify(this.selectedValues)) {
                this.selectedValues = val;
            }
            this.$store.commit('filterItems', { subcategory: this.selectedSubcategory, filter: val });
        }
    },
    mounted() {
        this.$store.commit('filterItems', { subcategory: this.selectedSubcategory });
        this.$store.commit('getFilterOptions');
    },
    beforeDestroy() {
        this.$store.commit('updateQueryOptions', {});
    }
}
</script>

<style></style>
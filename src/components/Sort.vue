<template>
    <v-row v-if="!isMobile">
        <v-col cols="12" sm="3" class="mt-n6 pr-2">
            <v-toolbar flat outlined>
                <strong>Filter</strong>
                <v-spacer></v-spacer>
                <v-divider vertical></v-divider>
                <v-btn @click="resetFilter()" icon class="ml-1">
                    <v-icon color="#077c8c">mdi-sync</v-icon>
                </v-btn>
            </v-toolbar>
        </v-col>
        <v-col cols="12" sm="3" class="mt-n6 pl-0 pr-1 ">
            <v-toolbar flat outlined>
            </v-toolbar>
        </v-col>
        <v-col cols="12" sm="3" class="mt-n6 pl-1 pr-2 ml-0">
            <v-toolbar flat outlined>
                <v-select v-model="selectedOption" @change="changeRoute" class="pt-6" solo dense :items="sortOptions"
                    label="Sort by:">
                </v-select>
            </v-toolbar>
        </v-col>
        <v-col cols="12" sm="3" class="mt-n6 pl-0 pr-3 ml-0">
            <v-toolbar flat outlined>
                <strong>SHOW: {{ $parent.displayedItems.length }} of ({{ filteredItems.length }})</strong>
                <v-spacer></v-spacer>
                <v-divider vertical></v-divider>
                <v-btn icon class="ml-1">
                    <v-icon color="black">mdi-menu-down</v-icon>
                </v-btn>
            </v-toolbar>
        </v-col>
    </v-row>
    <v-row v-else class="align-center mb-4 text-center ">
        <v-col class="ms-0 pe-2">
            <v-btn class="text-caption font-weight-bold" block @click="$emit('toggleShowFilter')">
                FILTER
            </v-btn>
        </v-col>
        <v-col class="me-0 ps-2 sort">
            <v-btn class="text-caption font-weight-bold" block @click="showSortOptions = !showSortOptions">
                {{ sortText || 'Sort By' }}
            </v-btn>
            <transition name="fade">
                <div class="sort-dropdown " v-if="showSortOptions">
                    <v-btn block class="text-caption font-weight-bold" @click="changeRoute(option)"
                        v-for="option, i in sortOptions" :key="i"> {{
                            option.text
                        }}</v-btn>
                </div>
            </transition>
        </v-col>
        <v-col v-if="$parent.showFilter" class="text-start pt-0" cols="12">
            <v-chip @click="resetFilter()" color="#07acac" text-color="white" class="pill">Reset filters
            </v-chip>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "Sort",
    data() {
        return {
            sortOptions: [
                { value: 0, text: "Price: Low to High" },
                { value: 1, text: "Price: High to Low" },
            ],
            selectedOption: '',
            showSortOptions: false,
            sortText: ''
        }
    },
    mounted() {
        this.selectedOption = this.route === "PRICE_ASCEND" ? 0 : this.route === "PRICE_DESCEND" ? 1 : ''
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
        route() {
            return this.$route.query.sbp;
        },
        filteredItems() {
            return this.$store.state.filteredItems;
        }
    },
    methods: {
        changeRoute(opt) {
            switch (this.isMobile ? opt.value : opt) {
                case 0:
                    this.$router.push("?sbp=PRICE_ASCEND")
                    break;
                case 1:
                    this.$router.push("?sbp=PRICE_DESCEND")
            }
            this.showSortOptions = false;
            this.sortText = opt.text
        },
        resetFilter() {
            this.$parent.$refs.filter.resetFilter();
        }
    },
    watch: {
        route(val) {
            if (val === "PRICE_ASCEND") {
                this.$store.commit('sortByPriceAscending')
            }
            if (val === "PRICE_DESCEND") {
                this.$store.commit('sortByPriceDescending')
            }
        }
    }
}
</script>

<style>
.sort {
    position: relative;
}

.sort-dropdown {
    position: absolute;
    left: 0;
    top: 50px;
    z-index: 100;
    width: inherit;
    padding-left: 12px;
    padding-right: 12px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
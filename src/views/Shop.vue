<template>
    <div>
        <v-container>
            <Sort @toggleShowFilter="toggleShowFilter" />
            <v-row>
                <v-col v-show="!isMobile || showFilter" cols="12" sm="3" class="py-0 pr-2 mt-n1 mb-6 mb-sm-0">
                    <FilterMenu @toggleShowFilter="toggleShowFilter" :items="givenItems || items" />
                </v-col>
                <v-col cols="12" sm="9" :style="!isMobile ? 'height: 1650px' : 'height: 1590px'"
                    :class="isMobile ? 'mt-n6' : 'mt-n3'">
                    <v-row :class="isMobile ? 'px-2' : ''">
                        <v-col cols="6" sm="4" class="py-0" :class="!isMobile ? i % 3 ?
                            'pl-2 pr-1 ml-n1' :
                            'pl-0 pr-1'/*first elements */
                            : 'px-1'" v-for="(item, i) in displayedItems" :key="item.id">
                            <Items shop :item="item" @toggleWishlist="item.inWishlist = !item.inWishlist" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-pagination v-model="currentPage" :total-visible="5" :items-per-page="itemsPerPage"
                    @input="updateDisplayedItems" :length="totalPages" />
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Items from '../components/Items';
import Sort from '../components/Sort';
import FilterMenu from '../components/Filter';

export default {
    name: "Shop",
    components: {
        Items,
        Sort,
        FilterMenu,
    },
    props: {
        givenItems: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            showFilter: false,
            currentPage: 1,
            itemsPerPage: 12,
            displayedItems: []
        }
    },
    mounted() {
        this.updateDisplayedItems();
    },
    methods: {
        toggleShowFilter() {
            this.showFilter = !this.showFilter;
        },
        updateDisplayedItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            this.displayedItems = this.givenItems.slice(start, end);
        }
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
        totalItems() {
            return this.givenItems.length;
        },
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        }
    },
    watch: {
        givenItems: {
            immediate: true,
            handler() {
                this.updateDisplayedItems();
            }
        },
        currentPage() {
            window.scrollTo(0, 0);
        }
    }
}
</script>

<style lang="scss">
.v-chip.v-size--default {
    border-radius: 50px !important;
    font-size: 14px !important;
    height: 40px !important;
    width: 40px !important;

    &.pill {
        border-radius: 20px !important;
        width: auto !important;
    }
}


.v-chip.v-size--small {
    border-radius: 50% !important;
    height: 25px !important;
    width: 25px !important;

    &.pill {
        border-radius: 20px !important;
        width: 60px !important;
    }
}

.v-chip .v-chip__content {
    justify-content: center;
    margin: 0 auto;
}

.v-icon {
    margin-left: auto !important;
    margin-right: auto !important;
}

.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    background-color: rgba(0, 150, 256, 0.433) !important;
    position: absolute;
    width: 100%;
}

.card1 {
    z-index: 10;
}

.card2 {
    z-index: 1;
}
</style>
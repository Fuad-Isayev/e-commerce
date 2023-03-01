<template>
    <div>
        <v-container>
            <v-card>
                <Sort @toggleShowFilter="toggleShowFilter" />
                <v-row>
                    <v-col v-show="!isMobile || showFilter" cols="12" sm="3" class="py-0 pr-2 mt-n3">
                        <FilterMenu @toggleShowFilter="toggleShowFilter" :items="givenItems || items" />
                    </v-col>
                    <v-col cols="12" sm="9" :class="isMobile ? '' : 'mt-n3'">
                        <v-row>
                            <v-col cols="6" sm="4" class="py-0"
                                :class="!isMobile ? i % 3 ? 'pl-0 pr-1 ml-n1' : 'pl-0 pr-1' : ''"
                                v-for="item, i in givenItems" :key="item.id">
                                <Items shop :item="item" @toggleWishlist="item.inWishlist = !item.inWishlist" />
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
        givenItems: Array,
    },
    data() {
        return {
            showFilter: false,
        }
    },
    methods: {
        toggleShowFilter() {
            this.showFilter = !this.showFilter;
        },

    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        }
    },
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
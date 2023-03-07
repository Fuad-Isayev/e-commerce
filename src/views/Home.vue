<template>
    <v-container>
        <v-carousel v-if="!isMobile" height="300" hide-delimiters class="mb-16">
            <v-carousel-item>
                <v-row class="carousel pl-8 py-4">
                    <v-col cols="3">
                        <div>
                            <h2 class="mb-8">Work, play and create!</h2>
                            <p class="my-8">Browse a huge selection of TVs, laptops, cameras and more.</p>
                            <v-btn @click="$router.push('/catalog/electronics')" class="custom-btn mt-6">Shop electronics
                                →</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="3">
                        <v-img class="carousel-img" @click="$router.push('/catalog/electronics/smartphones')"
                            src="../assets/Carousel/Smartphones.webp"></v-img>
                    </v-col>
                    <v-col cols="3">
                        <v-img class="carousel-img" @click="$router.push('/catalog/electronics/tablets')"
                            src="../assets/Carousel/Tablets.webp"></v-img>
                    </v-col>
                    <v-col cols="3">
                        <v-img class="carousel-img" @click="$router.push('/catalog/electronics/game-consoles')"
                            src="../assets/Carousel/Game.webp"></v-img>
                    </v-col>
                </v-row>
            </v-carousel-item>
        </v-carousel>
        <v-row>
            <v-col class="text-h5 font-weight-medium">
                <span class="pe-2">
                    Explore Popular Categories
                </span>
                <span @click="$router.push('/catalog/all-categories')" class="border-start clickable ps-2">
                    See all →
                </span>
            </v-col>
        </v-row>
        <v-row class="align-center text-center mb-4">
            <v-col @click="$router.push(`/catalog/${subcat.cat}/${subcat.query}`)" class="subcategory" cols="4" sm="2"
                v-for="subcat, i in subcategories" :key="i">
                <v-img height="150" width="150" contain center :src="`/assets/Subcategories/${subcat.query}.png`">
                </v-img>
                <span>{{ subcat.name }}</span>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            subcategories: [{ query: "smartphones", cat: "electronics", name: "Smartphones" }, { query: "tablets", cat: "electronics", name: "Tablets" }, { query: "tv", cat: "electronics", name: "TV" }, { query: "laptops", cat: "electronics", name: "Laptops" }, { query: "shoes", cat: "clothes", name: "Shoes" }, { query: "game-consoles", cat: "electronics", name: "Game consoles" }]
        }
    },
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        },
    }
}

</script>

<style >
.carousel {
    background: #93c9ff;
}

.carousel-img {
    cursor: pointer;
    margin-left: 4px;
}

.subcategory:hover {
    box-sizing: border-box;
    padding: 11px !important;
    border: 1px solid black;
    background: #d6e8fe90;
    scale: 1.05;
    cursor: pointer;
}

.custom-btn {
    box-shadow: #93c9ff 0px 0px 0px 0px inset;
    color: #93c9ff;
}

.custom-btn:hover {
    box-shadow: #3f6a95 0px 0px 0px 30px inset;
    color: white;
    transition: all 500ms cubic-bezier(0.39, 0.5, 0.15, 1.36);
}

.clickable {
    cursor: pointer;
}
</style>
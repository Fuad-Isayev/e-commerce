<template>
    <div>
        <v-hover>
            <v-card class="mx-auto my-5 hover py-5" max-width="500">
                <v-img heigh="230" :src=item.imgURL>
                </v-img>
                <v-card-title class="font-weight-bold text-h6">
                    ${{ item.price }}
                </v-card-title>
                <v-card-title class="font-weight-bold text-h6 justify-space-between">
                    {{ item.name }}
                    <v-btn @click="$emit('delete-item', item.id, item.imgURL)" icon>
                        <v-icon color="red">
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </v-card-title>
            </v-card>
        </v-hover>
    </div>
</template>

<script>
export default {
    name: 'Items',
    props: {
        item: Object,
    }
}
</script>

<style>
.hover {
    box-shadow: none !important;
    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
}

.hover:hover {
    background: #fff;
    z-index: 2;
    box-shadow: 0 4px 15px 4px rgb(0 0 0 / 16%) !important;
}
</style>
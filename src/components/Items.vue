<template>
    <div>
        <v-card flat outlined tile v-if="shop" class="" max-width="500">
            <div>
                <v-img :src=item.imgURL max-width="290.25px" max-height="290.25px">
                </v-img>
            </div>
            <v-card-title class="font-weight-bold text-h6">
                ${{ item.price }}
            </v-card-title>
            <v-card-title class="font-weight-bold text-h6 justify-space-between">
                {{ item.name }}
            </v-card-title>
        </v-card>
        <v-card v-if="admin" class="mx-auto my-5 hover py-5" max-width="500">
            <div style="height: 222.8px">
                <v-img max-width="222.8px" max-height="222.8px" :src=item.imgURL>
                </v-img>
            </div>
            <v-card-title class="font-weight-bold text-h6">
                ${{ item.price }}
            </v-card-title>
            <v-card-title class="font-weight-bold text-h6 justify-space-between">
                {{ item.name }}
                <v-btn @click="$emit('delete-item', item.id, item.imgID)" icon>
                    <v-icon color="red">
                        mdi-delete
                    </v-icon>
                </v-btn>
            </v-card-title>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'Items',
    props: {
        item: Object,
        shop: Boolean,
        admin: Boolean,
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
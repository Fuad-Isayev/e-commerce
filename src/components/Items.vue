<template>
    <div>
        <v-card class="mx-auto my-5" max-width="300">
            <v-card-title class="justify-space-between">
                {{ item.name}}
                <v-btn @click="$emit('delete-item', id)" icon>
                    <v-icon color="red">
                        mdi-delete
                    </v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                Price: ${{ item.price}}
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'Items',
    props: {
        item: Object,
        id: String,
    }
}
</script>
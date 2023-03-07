<template>
    <v-container fluid class="bg-black text-white mt-4">
        <v-container>
            <v-row style="height: 140px">
                <v-col>
                    <h5 class="mb-4 text-body-2 text-sm-h6">About us</h5>
                    <h6 class=" text-caption text-sm-subtitle-1">Our Company</h6>
                    <h6 class=" text-caption text-sm-subtitle-1">Clients</h6>
                </v-col>
                <v-col class="text-center">
                    <h5 class="mb-4 text-body-2 text-sm-h6">Contacts</h5>
                    <v-icon :small="isMobile" class="ml-2" color="white">mdi-cellphone</v-icon>
                    <v-icon :small="isMobile" class="ml-2" color="white">mdi-phone</v-icon>
                    <v-icon :small="isMobile" class="ml-2" color="white">mdi-map-marker-outline</v-icon>
                </v-col>
                <v-col class="text-end">
                    <h5 class="mb-4 text-body-2 text-sm-h6">Social Media</h5>
                    <v-icon :small="isMobile" class="ml-2" color="white">mdi-facebook</v-icon>
                    <v-icon :small="isMobile" class="ml-2" color="white">mdi-instagram</v-icon>
                    <v-icon :small="isMobile" class="ml-2" color="white">mdi-youtube</v-icon>
                    <v-icon :small="isMobile" class="ml-2" color="white">mdi-twitter</v-icon>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
export default {
    name: 'Footer',
    computed: {
        isMobile() {
            return this.$store.getters.isMobile;
        }
    }
}
</script>
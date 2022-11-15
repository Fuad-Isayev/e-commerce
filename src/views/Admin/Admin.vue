<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" class="text-center py-8">
                    <router-link class="text-decoration-none text-sm-h5 font-weight-medium" to="./admin/manage">Manage
                        Products
                    </router-link>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

export default {
    name: "Admin",
}
</script>

<style>
.link {
    text-align: center;
}
</style>
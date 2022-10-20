<template>
  <v-app>
    <v-main>
      <Shop />
    </v-main>
  </v-app>
</template>

<script>
import Shop from "./components/Shop";

export default {
  name: "App",

  components: {
    Shop,
  },

  data: () => ({
    //
  }),
};
</script>

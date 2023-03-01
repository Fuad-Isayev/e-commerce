<template>
  <v-app>
    <v-main>
      <Header />
      <router-view :isMobile="isMobile"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Header';

export default {
  name: "App",
  components: {
    Header,
  },
  async mounted() {
    window.onresize = this.getDimensions;
    await this.$store.dispatch('loadAllItems');
    this.$store.dispatch('getCategories');
    this.$store.dispatch('loadCartItems');
    this.$store.dispatch('loadWishlistItems');
    this.$store.dispatch('getSubcategories');
    // this.$store.commit('getSelectedFilterOptions');
  },
  methods: {
    getDimensions() {
      this.$store.state.screenWidth = window.innerWidth;
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile;
    }
  }
};
</script>

<style>
strong {
  display: flex;
  align-items: center;
}
</style>
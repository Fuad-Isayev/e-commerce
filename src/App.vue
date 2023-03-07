<template>
  <v-app>
    <v-content>
      <Header />
      <router-view :isMobile="isMobile"></router-view>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  name: "App",
  components: {
    Header,
    Footer
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

.truncate-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(2 * var(--line-height-base));
  word-break: keep-all;
}
</style>